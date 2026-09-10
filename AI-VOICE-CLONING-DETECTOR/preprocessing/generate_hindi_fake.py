from gtts import gTTS
import os
import time

OUTPUT_DIR = "./dataset/hi/fake"

sentences = [
    "नमस्ते, यह एक परीक्षण वाक्य है।",
    "आज मौसम बहुत अच्छा है।",
    "मेरा नाम राहुल है और मैं पुणे में रहता हूं।",
    "कृपया मुझे कल सुबह फोन करना।",
    "भारत एक बहुत बड़ा और विविध देश है।",
    "मुझे कंप्यूटर साइंस पढ़ना पसंद है।",
    "आज कॉलेज में हमारी एक महत्वपूर्ण मीटिंग है।",
    "आपका दिन शुभ हो।",
    "कृपया इस संदेश को ध्यान से सुनें।",
    "मैं अभी घर जाने के लिए तैयार हो रहा हूं।",
    "यह एक सामान्य हिंदी आवाज का परीक्षण है।",
    "हमारा प्रोजेक्ट आर्टिफिशियल इंटेलिजेंस पर आधारित है।",
    "मुझे नई तकनीक सीखने में बहुत रुचि है।",
    "क्या आप मुझे इस समस्या को समझा सकते हैं?",
    "कल हमारी परीक्षा सुबह दस बजे शुरू होगी।",
    "आज मैंने अपने दोस्त से बात की।",
    "कृत्रिम बुद्धिमत्ता तेजी से विकसित हो रही है।",
    "यह रिकॉर्डिंग केवल परीक्षण के लिए बनाई गई है।",
    "कृपया अपना काम समय पर पूरा करें।",
    "मैं अपने भविष्य के लिए मेहनत कर रहा हूं।",
]

os.makedirs(OUTPUT_DIR, exist_ok=True)

count = 0

for repeat in range(5):
    for i, sentence in enumerate(sentences):

        count += 1

        filename = f"hi_fake_{count:04d}.mp3"
        filepath = os.path.join(OUTPUT_DIR, filename)

        if os.path.exists(filepath):
            continue

        try:
            tts = gTTS(
                text=sentence,
                lang="hi",
                slow=False
            )

            tts.save(filepath)

            print(f"Created {count}/100: {filename}")

            time.sleep(0.5)

        except Exception as e:
            print(f"Error creating {filename}: {e}")

print("\n100 Hindi AI samples generated!")