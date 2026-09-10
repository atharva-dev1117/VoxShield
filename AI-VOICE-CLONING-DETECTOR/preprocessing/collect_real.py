from datasets import load_dataset
import soundfile as sf
import numpy as np
import os

OUTPUT_DIR = "dataset/hi/real"
TARGET_SAMPLES = 50
TARGET_SR = 16000
TARGET_SECONDS = 3

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Connecting to IndicVoices...")

dataset = load_dataset(
    "ai4bharat/IndicVoices",
    "hindi",
    split="valid",
    streaming=True
)

print("Connected!")
print("Collecting Hindi REAL samples...")

count = 0

for sample in dataset:
    try:
        audio = sample["audio"]

        waveform = np.asarray(audio["array"], dtype=np.float32)
        sample_rate = audio["sampling_rate"]

        # Convert stereo → mono
        if waveform.ndim > 1:
            waveform = np.mean(waveform, axis=0)

        # Resample to 16 kHz
        if sample_rate != TARGET_SR:
            import librosa
            waveform = librosa.resample(
                waveform,
                orig_sr=sample_rate,
                target_sr=TARGET_SR
            )

        # Exactly 3 seconds
        target_length = TARGET_SR * TARGET_SECONDS

        if len(waveform) < target_length:
            waveform = np.pad(
                waveform,
                (0, target_length - len(waveform))
            )
        else:
            waveform = waveform[:target_length]

        filename = os.path.join(
            OUTPUT_DIR,
            f"hindi_real_{count + 1:03d}.wav"
        )

        sf.write(filename, waveform, TARGET_SR)

        count += 1
        print(f"Saved {count}/{TARGET_SAMPLES}")

        if count >= TARGET_SAMPLES:
            break

    except Exception as e:
        print("Skipped sample:", e)

print("\nDONE!")
print(f"Saved {count} Hindi REAL samples.")