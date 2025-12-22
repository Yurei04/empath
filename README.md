# 🌱 EmPath — An Empathetic Conversational AI

> ⚠️ **Important Note**  
> If the model is not working properly, it is likely due to the **Hugging Face free credit limit (≈ $0.10)**. Unfortunately, I am unable to purchase additional credits at this time. Thank you for your understanding.

---

## 🧠 Inspiration

EmPath is inspired by my earlier project, **Sumire**, an artificial intelligence assistant, and by my personal experiences with friends who struggle with depression. Many of them didn't need advice or solutions — they simply wanted someone who would listen and understand.

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

EmPath dynamically adapts its responses based on the **flow of the conversation** and the user's emotional state.

### 💌 Additional Platform Features
- **Anonymous Letter Sending** — Users can send anonymous messages of encouragement. Other users receive random supportive messages from the community.
- **Blog Page** — A space where users can share stories and personal experiences for others to read and relate to.

---

## 🚀 Setup Instructions

### Prerequisites

Before you begin, make sure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **Hugging Face account** (free tier is sufficient)
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/YourUsername/empath-ai.git
cd empath-ai
```

---

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

---

### Step 3: Set Up Hugging Face Models

#### 3.1 Create Hugging Face Spaces

You need to deploy **two models** as Hugging Face Spaces:

##### **A) Empathy Model (Emotion Classification)**

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click **"New Space"**
3. Choose **Gradio** as SDK
4. Name it: `empathy-classifier` (or your preferred name)
5. Upload the `app.py` file for emotion classification
6. Create `requirements.txt`:
```
   transformers==4.36.0
   torch==2.1.0
   gradio==4.44.0
   fastapi==0.109.0
   uvicorn==0.27.0
```
7. Wait for deployment to complete
8. Copy the Space URL (e.g., `https://yourname-empathy-classifier.hf.space`)

##### **B) Emphasist Model (Cognitive Distortion Detection)**

1. Create another **New Space**
2. Choose **Gradio** as SDK
3. Name it: `emphasist-detector` (or your preferred name)
4. Upload the distortion detection `app.py`
5. Use the same `requirements.txt` as above
6. Copy the Space URL (e.g., `https://yourname-emphasist-detector.hf.space`)

---

### Step 4: Get Your Hugging Face API Key

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Click **"New token"**
3. Name it: `EmPath-API`
4. Select **Read** permission
5. Click **"Generate"**
6. Copy the token (starts with `hf_...`)

---

### Step 5: Configure Environment Variables

Create a `.env.local` file in the root directory:
```bash
touch .env.local
```

Add the following configuration:
```env
# Hugging Face API Key
HUGGINGFACE_API_KEY=hf_your_actual_api_key_here

# Empathy Model Space URL
EMOTION_CLASSIFIER_URL=https://yourname-empathy-classifier.hf.space

# Emphasist Model Space URL
DISTORTION_DETECTOR_URL=https://yourname-emphasist-detector.hf.space
```

**Important:** Replace the placeholder values with your actual:
- Hugging Face API key
- Space URLs (without trailing slashes)

---

### Step 6: Test Your API Connections

Before running the full application, test if your APIs are accessible:
```bash
# Test Emotion Classifier
curl -X POST https://yourname-empathy-classifier.hf.space/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "I feel sad today"}'

# Test Distortion Detector
curl -X POST https://yourname-emphasist-detector.hf.space/detect \
  -H "Content-Type: application/json" \
  -d '{"text": "I always mess everything up", "threshold": 0.5}'
```

If both return JSON responses, your models are working! ✅

---

### Step 7: Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Step 8: Verify Everything Works

1. Open the browser console (F12)
2. Send a test message: "I'm feeling overwhelmed"
3. Check console logs:

**Frontend (Browser Console):**
```
[Frontend] Sending message: I'm feeling overwhelmed
[Frontend] Stream complete
```

**Backend (Terminal):**
```
[User] I'm feeling overwhelmed...
[Emotion] anxiety | concerned | Severity: 45
[Distortion] None
[LLM] Calling meta-llama/Llama-3.2-3B-Instruct
[LLM] ✓ Response: That sounds really tough...
```

---

## 🔧 Troubleshooting

### Issue: "No console logs appearing"

**Solution:** Check if your `.env.local` file is properly configured and restart the dev server.
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

---

### Issue: "API calls failing"

**Possible causes:**
1. **Hugging Face Spaces not deployed** — Check if both Spaces show "Running" status
2. **Wrong URLs** — Verify URLs in `.env.local` match your Space URLs exactly
3. **API key invalid** — Generate a new token from Hugging Face settings
4. **Free tier limit reached** — Wait for credit reset or upgrade account

---

### Issue: "Model responses are repetitive"

**Solution:** This was due to simulated responses in the old code. Make sure you're using the updated `EmapthConversationScreen` component that makes real API calls.

---

### Issue: "Streaming not working"

**Solution:** Switch to non-streaming mode by changing this line in your component:
```javascript
// Change from:
sendMessage={sendMessageStreaming}

// To:
sendMessage={sendMessageNoStreaming}
```

---

## 📁 Project Structure
```
empath-ai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # Main chat API endpoint
│   ├── components/
│   │   └── EmapthConversation.jsx # Chat UI component
│   └── page.js                    # Main page
├── public/                        # Static assets
├── .env.local                     # Environment variables (create this)
├── package.json
└── README.md
```

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

> **Hugging Face Links:**
> - Empathy Model: `YureiYuri/empathy`
> - Emphasist Model: `YureiYuri/Empahist`

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

## 🚀 What's Next for EmPath

- Improve **contextual reasoning** for deeper conversations
- Expand and diversify the training datasets
- Add **voice-based interaction** for a more natural experience
- Explore better long-term memory and emotional continuity

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## ❤️ Disclaimer

EmPath is **not a replacement for professional mental health care**.  
If you are experiencing severe distress, please seek help from a licensed professional or local support services.

**Crisis Resources:**
- 🇺🇸 **US:** Call/Text 988 (Suicide & Crisis Lifeline) or Text HOME to 741741
- 🌍 **International:** Visit [findahelpline.com](https://findahelpline.com)

---

## 🙏 Acknowledgments

- **Hugging Face** for providing free model hosting
- **Meta AI** for the LLaMA models
- The mental health community for inspiration and guidance

---

Made with empathy, care, and intention 💙
