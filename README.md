
---

# 🛡️ AI-Powered Legal Document Analyzer

This project lets you upload **legal documents (PDF, DOCX, TXT)** and get smart AI-generated summaries, key clauses, potential legal risks, and actionable recommendations — all powered by **open-source LLMs via LM Studio**.

---

## 🚀 Features

* 📄 Upload PDF, DOCX, or TXT legal documents
* 🤖 Analyze using a **local LLM** through [LM Studio](https://lmstudio.ai/)
* 🧠 Get:

  * Document summary
  * Key terms and clauses
  * Potential risk flags
  * Legal recommendations
* 🎨 Beautiful UI built with Next.js + TailwindCSS
* 🔧 FastAPI backend that handles file parsing and AI logic
* 🔐 All offline — no OpenAI or Hugging Face required!

---

## 🗂️ Project Structure

```
legal-analyzer/
├── backend/           # FastAPI server
│   ├── main.py        # API routes
│   ├── parser.py      # PDF/DOCX/text file parser
│   ├── llm_handler.py # LM Studio integration
│   └── requirements.txt
│
├── frontend/          # Next.js 14 app (App Router)
│   └── app/           # Main UI
│
└── README.md
```

---

## 💻 Requirements

* ✅ Python 3.9+
* ✅ Node.js 18+
* ✅ [LM Studio](https://lmstudio.ai/) installed and running locally
* ✅ Internet (only for installing packages)
* 🧠 Any supported LLM model loaded in LM Studio (e.g. `Mistral`, `LLaMA3`, etc.)

---

## 🛠️ Setup Instructions (Run Locally)

### 🔹 1. Clone the Repo

```bash
git clone https://github.com/yourusername/legal-analyzer.git
cd legal-analyzer
```

---

### 🔹 2. Start LM Studio

1. Open LM Studio
2. Load a model like:

   * `TheBloke/Mistral-7B-Instruct-v0.1`
   * `meta-llama/Meta-Llama-3-8B-Instruct`
3. Enable the **OpenAI-compatible API server**:

   * Click “API” tab
   * Toggle ON: `Enable OpenAI API Compatible Server`
   * Set base URL: `http://localhost:1234`
   * Model name: match what you load in LM Studio

> 🧠 Note: Leave LM Studio running in the background

---

### 🔹 3. Run Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

This will start the API server at:

```
http://localhost:8000
```

---

### 🔹 4. Run Frontend (Next.js)

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

This will start the frontend at:

```
http://localhost:3000
```

---

## 🧪 How It Works

* The frontend lets users upload a legal document.
* The file is sent to the FastAPI backend at `/analyze`.
* The backend parses the file → sends extracted text to LM Studio.
* LM Studio generates a legal analysis.
* The result is shown in a beautiful UI.

---

## 📂 Example Models (Recommended)

| Model                                 | Description                      |
| ------------------------------------- | -------------------------------- |
| `mistralai/Mistral-7B-Instruct`       | Fast and instruction-following   |
| `meta-llama/Meta-Llama-3-8B-Instruct` | High quality reasoning           |
| `TheBloke/OpenHermes-2.5-Mistral`     | Legal QA friendly                |
| `NousResearch/Hermes-2-Pro-Mistral`   | Great for summarization & advice |

Load them via LM Studio → click **"Download & Load"** → enable API server.

---

## 📎 File Support

You can upload:

* `.pdf`
* `.docx`
* `.txt`

File limit: \~10MB (recommended). For best results, use clean OCRed/legal text.

---

## 📌 Troubleshooting

| Issue                                 | Fix                                       |
| ------------------------------------- | ----------------------------------------- |
| `Failed to fetch`                     | Backend not running or CORS issue         |
| `Error analyzing document`            | LM Studio not running or model not loaded |
| `NoneType has no attribute 'ainvoke'` | Backend is missing LLM connection         |
| Long wait times                       | Use smaller model in LM Studio            |

---

## 🙌 Authors

* 🧑‍💻 [KathirChelvan](https://github.com/KathirChelvan)
* 💡 Project powered by FastAPI, Next.js, and LM Studio

---

## 📜 License

MIT License – free to use, modify, and share.

---

## ⭐ Final Notes

This project is perfect for:

* Hackathons 💡
* Resume/portfolio 🚀
* AI product prototypes 🤖
* Legal-tech startups ⚖️

> Want to deploy this to the cloud? Switch LM Studio to Groq API or Hugging Face Inference — we’ve got support for that too!

---
