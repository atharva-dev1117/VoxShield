import os
import numpy as np
import librosa
import onnxruntime as ort


MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "models",
    "voice_detector.onnx"
)

TARGET_SR = 16000
N_MELS = 128
N_FFT = 2048
HOP_LENGTH = 512


class VoiceDetector:

    def __init__(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"ONNX model not found: {MODEL_PATH}"
            )

        self.session = ort.InferenceSession(
            MODEL_PATH,
            providers=["CPUExecutionProvider"]
        )

        self.input = self.session.get_inputs()[0]
        self.outputs = self.session.get_outputs()

        print("\n========== VoxShield Model ==========")
        print("Model:", MODEL_PATH)
        print("Input name:", self.input.name)
        print("Input shape:", self.input.shape)
        print("Input type:", self.input.type)

        for output in self.outputs:
            print("Output:", output.name, output.shape, output.type)

        print("======================================\n")

    def preprocess(self, filepath):

        audio, sr = librosa.load(
            filepath,
            sr=TARGET_SR,
            mono=True
        )

        if len(audio) == 0:
            raise ValueError("Audio file contains no audio.")

        # Normalize
        peak = np.max(np.abs(audio))

        if peak > 0:
            audio = audio / peak

        # Mel spectrogram
        mel = librosa.feature.melspectrogram(
            y=audio,
            sr=TARGET_SR,
            n_fft=N_FFT,
            hop_length=HOP_LENGTH,
            n_mels=N_MELS,
            power=2.0
        )

        mel_db = librosa.power_to_db(
            mel,
            ref=np.max
        )

        # Normalize approximately to 0-1
        mel_db = (mel_db + 80.0) / 80.0
        mel_db = np.clip(mel_db, 0.0, 1.0)

        return mel_db.astype(np.float32), len(audio) / TARGET_SR

    def prepare_input(self, mel):

        shape = self.input.shape

        # Common CNN format:
        # [batch, channel, mel, time]

        if len(shape) == 4:
            return np.expand_dims(
                np.expand_dims(mel, axis=0),
                axis=0
            ).astype(np.float32)

        # [batch, mel, time]
        if len(shape) == 3:
            return np.expand_dims(
                mel,
                axis=0
            ).astype(np.float32)

        # Flat input
        if len(shape) == 2:
            return mel.reshape(1, -1).astype(np.float32)

        raise ValueError(
            f"Unsupported model input shape: {shape}"
        )

    def predict(self, filepath):

        mel, duration = self.preprocess(filepath)

        model_input = self.prepare_input(mel)

        result = self.session.run(
            None,
            {
                self.input.name: model_input
            }
        )

        raw = np.asarray(result[0])

        print("Raw model output shape:", raw.shape)
        print("Raw model output:", raw)

        ai_probability = self.interpret_output(raw)

        real_probability = 1.0 - ai_probability

        if ai_probability >= 0.70:
            verdict = "AI_GENERATED"
            confidence = "HIGH"

        elif ai_probability >= 0.50:
            verdict = "SUSPICIOUS"
            confidence = "MEDIUM"

        else:
            verdict = "LIKELY_REAL"
            confidence = "HIGH"

        return {
            "verdict": verdict,
            "ai_probability": round(ai_probability * 100, 2),
            "real_probability": round(real_probability * 100, 2),
            "confidence": confidence,
            "duration": round(duration, 2)
        }

    def interpret_output(self, raw):

        values = raw.flatten()

        if len(values) == 1:

            value = float(values[0])

            # Sigmoid-style output
            if 0 <= value <= 1:
                return value

            # Logit output
            return 1.0 / (1.0 + np.exp(-value))

        if len(values) >= 2:

            # If probabilities
            if np.all(values >= 0) and np.all(values <= 1):
                total = np.sum(values)

                if total > 0:
                    values = values / total

                # Assumption:
                # class 0 = real
                # class 1 = AI
                return float(values[1])

            # Otherwise treat as logits
            exp_values = np.exp(
                values - np.max(values)
            )

            probabilities = (
                exp_values / np.sum(exp_values)
            )

            return float(probabilities[1])

        raise ValueError("Model returned empty output.")


detector = VoiceDetector()