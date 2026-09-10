import os
import librosa

folders = [
    "./dataset/hi/real",
    "./dataset/hi/fake"
]

for folder in folders:

    print("\nChecking:", folder)

    files = [
        f for f in os.listdir(folder)
        if f.endswith(".wav")
    ]

    print("Files:", len(files))

    errors = 0

    for filename in files:

        path = os.path.join(folder, filename)

        try:
            audio, sr = librosa.load(
                path,
                sr=None,
                mono=True
            )

            duration = len(audio) / sr

            if sr != 16000 or abs(duration - 3.0) > 0.05:
                print(
                    f"WARNING: {filename} | "
                    f"Sample Rate: {sr} | "
                    f"Duration: {duration:.2f}s"
                )
                errors += 1

        except Exception as e:
            print(f"ERROR: {filename} -> {e}")
            errors += 1

    if errors == 0:
        print("✓ All files are valid!")
    else:
        print("⚠ Problems found:", errors)