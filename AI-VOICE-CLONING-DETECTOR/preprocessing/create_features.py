import os
import numpy as np
import librosa

SAMPLE_RATE = 16000
N_MELS = 128
DURATION = 3
N_FFT = 1024
HOP_LENGTH = 512

DATASET_DIR = "./dataset/hi"
FEATURE_DIR = "./preprocessing/features"

os.makedirs(FEATURE_DIR, exist_ok=True)


def create_features():

    X = []
    y = []

    classes = {
        "real": 0,
        "fake": 1
    }

    target_length = SAMPLE_RATE * DURATION

    for class_name, label in classes.items():

        folder = os.path.join(DATASET_DIR, class_name)

        print(f"\nProcessing {class_name.upper()} audio...")

        files = [
            f for f in os.listdir(folder)
            if f.lower().endswith(".wav")
        ]

        for i, filename in enumerate(files):

            path = os.path.join(folder, filename)

            try:

                # Load audio
                audio, sr = librosa.load(
                    path,
                    sr=SAMPLE_RATE,
                    mono=True
                )

                # --------------------------------
                # FORCE EXACTLY 3 SECONDS
                # --------------------------------

                if len(audio) < target_length:

                    audio = np.pad(
                        audio,
                        (0, target_length - len(audio))
                    )

                else:

                    audio = audio[:target_length]

                # --------------------------------
                # MEL SPECTROGRAM
                # --------------------------------

                mel = librosa.feature.melspectrogram(
                    y=audio,
                    sr=SAMPLE_RATE,
                    n_mels=N_MELS,
                    n_fft=N_FFT,
                    hop_length=HOP_LENGTH
                )

                # Convert to dB
                mel_db = librosa.power_to_db(
                    mel,
                    ref=np.max
                )

                # --------------------------------
                # NORMALIZATION
                # --------------------------------

                mel_min = mel_db.min()
                mel_max = mel_db.max()

                mel_db = (
                    mel_db - mel_min
                ) / (
                    mel_max - mel_min + 1e-8
                )

                X.append(mel_db)
                y.append(label)

                print(
                    f"{i + 1}/{len(files)} processed",
                    end="\r"
                )

            except Exception as e:

                print(
                    f"\nError: {filename} -> {e}"
                )

    # Convert to NumPy
    X = np.array(
        X,
        dtype=np.float32
    )

    y = np.array(
        y,
        dtype=np.int64
    )

    # CNN channel dimension
    X = X[..., np.newaxis]

    # Save
    np.save(
        os.path.join(
            FEATURE_DIR,
            "X.npy"
        ),
        X
    )

    np.save(
        os.path.join(
            FEATURE_DIR,
            "y.npy"
        ),
        y
    )

    print("\n\nFeature extraction completed!")

    print("X shape:", X.shape)
    print("y shape:", y.shape)

    print("\nLabels:")

    print(
        "REAL =",
        np.sum(y == 0)
    )

    print(
        "FAKE =",
        np.sum(y == 1)
    )


if __name__ == "__main__":
    create_features()