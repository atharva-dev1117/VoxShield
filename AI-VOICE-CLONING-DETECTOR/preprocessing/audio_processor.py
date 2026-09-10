import librosa
import numpy as np


SAMPLE_RATE = 16000
DURATION = 3
N_MELS = 128
MAX_LENGTH = SAMPLE_RATE * DURATION


def load_audio(file_path):
    """
    Load audio file and convert it to 16 kHz mono.
    """

    audio, sr = librosa.load(
        file_path,
        sr=SAMPLE_RATE,
        mono=True
    )

    return audio


def fix_audio_length(audio):
    """
    Make every audio sample exactly 3 seconds long.
    """

    if len(audio) < MAX_LENGTH:
        audio = np.pad(
            audio,
            (0, MAX_LENGTH - len(audio))
        )

    else:
        audio = audio[:MAX_LENGTH]

    return audio


def create_mel_spectrogram(audio):
    """
    Convert audio into a Mel-Spectrogram.
    """

    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=SAMPLE_RATE,
        n_mels=N_MELS,
        n_fft=1024,
        hop_length=256
    )

    mel_db = librosa.power_to_db(
        mel,
        ref=np.max
    )

    return mel_db


def preprocess_audio(file_path):
    """
    Complete preprocessing pipeline.
    """

    audio = load_audio(file_path)

    audio = fix_audio_length(audio)

    mel = create_mel_spectrogram(audio)

    # Normalize between 0 and 1
    mel = (mel - mel.min()) / (mel.max() - mel.min())

    # Add CNN channel dimension
    mel = np.expand_dims(mel, axis=-1)

    return mel


if __name__ == "__main__":
    print("Audio processor loaded successfully!")