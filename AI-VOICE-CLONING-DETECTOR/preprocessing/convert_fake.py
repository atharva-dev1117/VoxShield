import os
import librosa
import soundfile as sf

INPUT_DIR = "./dataset/hi/fake"
OUTPUT_DIR = "./dataset/hi/fake"

SAMPLE_RATE = 16000
DURATION = 3
TARGET_LENGTH = SAMPLE_RATE * DURATION


def convert_audio(input_path, output_path):
    audio, _ = librosa.load(
        input_path,
        sr=SAMPLE_RATE,
        mono=True
    )

    # Make exactly 3 seconds
    if len(audio) < TARGET_LENGTH:
        audio = librosa.util.fix_length(
            audio,
            size=TARGET_LENGTH
        )
    else:
        audio = audio[:TARGET_LENGTH]

    sf.write(output_path, audio, SAMPLE_RATE)


for filename in os.listdir(INPUT_DIR):

    if filename.endswith(".mp3"):

        input_path = os.path.join(INPUT_DIR, filename)

        output_name = os.path.splitext(filename)[0] + ".wav"
        output_path = os.path.join(OUTPUT_DIR, output_name)

        convert_audio(input_path, output_path)

        print("Converted:", output_name)

print("\nFake audio conversion completed!")