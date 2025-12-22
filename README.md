# 🌱 EmPath — An Empathetic Conversational AI

> ⚠️ **Important Note**  
> If the model is not working properly, it is likely due to the **Hugging Face free credit limit (≈ $0.10)**. Unfortunately, I am unable to purchase additional credits at this time. Thank you for your understanding.

---

## 🧠 Inspiration

EmPath is inspired by my earlier project, **Sumire**, an artificial intelligence assistant, and by my personal experiences with friends who struggle with depression. Many of them didn’t need advice or solutions — they simply wanted someone who would listen and understand.

EmPath was created to be that presence:  
a **conversational AI companion** designed to respond with empathy, care, and emotional awareness.

---

## 💬 What It Does

EmPath is a **web-based conversational AI** powered by adaptive machine learning models. It detects emotional cues in user input and responds in a **supportive, empathetic, and emotionally appropriate** way.

EmPath is **not a diagnostic or clinical tool**.  
Instead, it serves as a **safe emotional companion**, offering:
- validation
- comfort
- encouragement
- gentle reframing of negative thoughts

---

## ✨ Features & How It Works

EmPath is built on the **`meta-llama/Llama-3.2-3B-Instruct / 3.3-3B`** large language model and enhanced with **two custom-trained models**:

### 🧩 1. Empathy Model
A text classification model trained to recognize emotional tone and guide the LLM toward emotionally appropriate responses.

- Detects emotions such as distress, sadness, anxiety, and neutrality  
- Helps the LLM decide *how* to respond (validation vs encouragement)

### 🧠 2. Emphasist Model (CBT-Inspired)
A fine-tuned **DistilBERT** model designed to detect **cognitive distortions** based on **Cognitive Behavioral Therapy (CBT)** principles, including:
- catastrophizing  
- overgeneralization  
- self-blame  
- black-and-white thinking  

This allows EmPath to **gently reframe negative thought patterns** without being prescriptive or diagnostic.

### 🔄 3. Adaptive AI System
By merging:
- the LLM  
- the Empathy Model  
- the Emphasist Model  

EmPath dynamically adapts its responses based on the **flow of the conversation** and the user’s emotional state.

### 💌 Additional Platform Features
- **Anonymous Letter Sending** — Users can send anonymous messages of encouragement. Other users receive random supportive messages from the community.
- **Blog Page** — A space where users can share stories and personal experiences for others to read and relate to.

---

## 📊 Model Training Results

### Empathy Model — Training Details

| Epoch | Training Loss | Validation Loss |
|------:|---------------|----------------|
| 1 | 1.0512 | 0.6480 |
| 2 | 0.2452 | 0.1822 |
| 3 | 0.0486 | 0.0720 |
| 4 | 0.0254 | 0.0489 |
| 5 | 0.0146 | 0.0317 |
| 6 | 0.0084 | 0.0317 |

- 📉 **Final Validation Loss:** `0.0317`

---

### Emphasist Model — Training Performance

| Epoch | Training Loss | Validation Loss |
|------:|---------------|----------------|
| 1 | 0.1200 | 0.0857 |
| 2 | 0.0322 | 0.0258 |
| 3 | 0.0165 | 0.0129 |
| 4 | 0.0335 | 0.0084 |
| 5 | 0.0079 | 0.0067 |
| 6 | 0.0066 | 0.0056 |
| 7 | 0.0311 | 0.0048 |
| 8 | 0.0523 | 0.0045 |
| 9 | 0.0051 | 0.0044 |
| 10 | 0.0278 | 0.0043 |

- 📉 **Final Validation Loss:** `0.0043`

> Hugging Face model and Space links are available in the repository.

---

## 🛠 Tech Stack

### Frontend
- **Next.js (React)**
- **JavaScript (JSX)**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide Icons**

### Backend / AI
- **Python**
- **Hugging Face Transformers**
- **Meta LLaMA (3.2 / 3.3 – 3B Instruct)**
- **DistilBERT**
- **NumPy**

### Model Training & Deployment
- **Google Colab**
- **Kaggle Notebooks**
- **Hugging Face Hub**
- **Hugging Face Spaces**

---

## ⚠️ Challenges Faced

- ⏳ **Time constraints:** Joined the hackathon only one week before the deadline  
- 💳 **Limited AI credits:** Hugging Face free-tier credit restrictions required careful token usage  
- 🖥 **Compute limitations:** Training multiple models was resource-intensive  
- 🚧 **Deployment issues:** Initial Hugging Face Space was misconfigured as a chatbot instead of a model inference Space, requiring a full rebuild

---

## 🏆 Accomplishments

- Successfully trained and deployed **two custom NLP models**
- Integrated emotional classification and cognitive distortion detection into an LLM
- Built a **non-diagnostic, ethically mindful AI** focused on emotional support
- Created a community-driven platform encouraging anonymous kindness

---

## 📚 What I Learned

- End-to-end **NLP model fine-tuning pipelines**
- How emotional signals can guide LLM behavior meaningfully
- Responsible AI design for mental health–adjacent applications
- Managing real-world constraints like compute limits and API credits

---

## 🚀 What’s Next for EmPath

- Improve **contextual reasoning** for deeper conversations
- Expand and diversify the training datasets
- Add **voice-based interaction** for a more natural experience
- Explore better long-term memory and emotional continuity

---

## ❤️ Disclaimer

EmPath is **not a replacement for professional mental health care**.  
If you are experiencing severe distress, please seek help from a licensed professional or local support services.

---

Made with empathy, care, and intention 💙
