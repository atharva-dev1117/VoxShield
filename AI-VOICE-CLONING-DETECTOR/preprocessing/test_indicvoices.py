from datasets import load_dataset, Audio

print("Connecting to IndicVoices...")

dataset = load_dataset(
    "ai4bharat/IndicVoices",
    "hindi",
    split="valid",
    streaming=True
)

# Disable automatic audio decoding
dataset = dataset.cast_column("audio", Audio(decode=False))

print("Access successful!")

sample = next(iter(dataset))

print("Sample received!")
print(sample.keys())
print("Audio information:")
print(sample["audio"])