import pyarrow.parquet as pq
import io
import os
import soundfile as sf
import numpy as np

PARQUET_FILE = r"C:\Users\Spandan\.cache\huggingface\hub\datasets--ai4bharat--IndicVoices\snapshots\c96f9088f138cf89d419da7e8e643e1f05c00a87\hindi\train-00000-of-00082.parquet"

OUTPUT_DIR = r".\dataset\hi\real"

MAX_FILES = 100
TARGET_SAMPLE_RATE = 16000
TARGET_DURATION = 3

os.makedirs(OUTPUT_DIR, exist_ok=True)

table = pq.read_table(PARQUET_FILE)

print("Total records:", table.num_rows)
print("Extracting Hindi real audio...")

count = 0

for i in range(table.num_rows):

    if count >= MAX_FILES:
        break

    audio_data = table["audio_filepath"][i].as_py()

    if audio_data is None:
        continue

    audio_bytes = audio_data["bytes"]

    if audio_bytes is None:
        continue

    try:
        audio, sample_rate = sf.read(io.BytesIO(audio_bytes), dtype="float32")

        # Convert stereo to mono
        if audio.ndim > 1:
            audio = np.mean(audio, axis=1)

        # Resample to 16 kHz
        if sample_rate != TARGET_SAMPLE_RATE:
            import librosa
            audio = librosa.resample(
                audio,
                orig_sr=sample_rate,
                target_sr=TARGET_SAMPLE_RATE
            )

        # Exactly 3 seconds
        target_length = TARGET_SAMPLE_RATE * TARGET_DURATION

        if len(audio) < target_length:
            audio = np.pad(
                audio,
                (0, target_length - len(audio))
            )
        else:
            audio = audio[:target_length]

        output_file = os.path.join(
            OUTPUT_DIR,
            f"hi_real_{count + 1:04d}.wav"
        )

        sf.write(
            output_file,
            audio,
            TARGET_SAMPLE_RATE
        )

        count += 1
        print(f"[{count}/{MAX_FILES}] {output_file}")

    except Exception as e:
        print(f"Skipping record {i}: {e}")

print()
print("Extraction complete!")
print("Hindi real samples:", count)