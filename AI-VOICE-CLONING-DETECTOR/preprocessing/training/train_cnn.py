import numpy as np
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# -----------------------------
# Load features
# -----------------------------

X = np.load("./preprocessing/features/X.npy")
y = np.load("./preprocessing/features/y.npy")

print("Dataset loaded")
print("X shape:", X.shape)
print("y shape:", y.shape)

# -----------------------------
# Train / Validation split
# -----------------------------

X_train, X_val, y_train, y_val = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Validation samples:", len(X_val))

# -----------------------------
# CNN Model
# -----------------------------

model = tf.keras.Sequential([

    tf.keras.layers.Input(
        shape=X.shape[1:]
    ),

    tf.keras.layers.Conv2D(
        32,
        (3, 3),
        activation="relu",
        padding="same"
    ),

    tf.keras.layers.MaxPooling2D(
        (2, 2)
    ),

    tf.keras.layers.Conv2D(
        64,
        (3, 3),
        activation="relu",
        padding="same"
    ),

    tf.keras.layers.MaxPooling2D(
        (2, 2)
    ),

    tf.keras.layers.Conv2D(
        128,
        (3, 3),
        activation="relu",
        padding="same"
    ),

    tf.keras.layers.MaxPooling2D(
        (2, 2)
    ),

    tf.keras.layers.Flatten(),

    tf.keras.layers.Dense(
        128,
        activation="relu"
    ),

    tf.keras.layers.Dropout(0.5),

    tf.keras.layers.Dense(
        1,
        activation="sigmoid"
    )
])

# -----------------------------
# Compile
# -----------------------------

model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# -----------------------------
# Train
# -----------------------------

history = model.fit(
    X_train,
    y_train,
    validation_data=(X_val, y_val),
    epochs=20,
    batch_size=16,
    verbose=1
)

# -----------------------------
# Evaluate
# -----------------------------

loss, accuracy = model.evaluate(
    X_val,
    y_val,
    verbose=0
)

print("\n==============================")
print("VALIDATION RESULTS")
print("==============================")

print("Loss:", loss)
print("Accuracy:", accuracy)

# -----------------------------
# Predictions
# -----------------------------

predictions = model.predict(X_val)

y_pred = (
    predictions >= 0.5
).astype(int).flatten()

print("\nClassification Report:")
print(
    classification_report(
        y_val,
        y_pred,
        target_names=["REAL", "FAKE"]
    )
)

print("Confusion Matrix:")
print(
    confusion_matrix(
        y_val,
        y_pred
    )
)

# -----------------------------
# Save model
# -----------------------------

model.save(
    "./model/voice_detector.keras"
)

print("\nModel saved successfully!")
print("Location: model/voice_detector.keras")