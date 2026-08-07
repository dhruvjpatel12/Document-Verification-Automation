# 🚀 AI-Powered Document Verification Automation

An AI-powered document verification system that automates the verification of aspirant documents by comparing uploaded PDFs with database records. Built using **n8n**, **Gemini AI**, **MySQL**, and a **JavaScript-based frontend**, the system significantly reduces manual verification effort while improving speed and accuracy.

---

## 📌 Project Overview

This project automates the complete document verification workflow for training organizations and educational institutions.

Users can upload an entire batch folder containing multiple aspirant folders. The system automatically:

- Reads all uploaded documents
- Groups documents by Aspirant ID
- Merges each aspirant's PDFs
- Extracts document information using Gemini AI
- Compares extracted data with MySQL database records
- Identifies mismatches and missing information
- Generates a downloadable Excel verification report

---

# ✨ Features

- 📁 Batch Folder Upload
- 📄 Automatic PDF Processing
- 🤖 AI-Based Document Information Extraction
- 🆔 Aspirant-wise Document Grouping
- 📊 Database Verification
- 📑 Automatic Excel Report Generation
- ⚡ Fully Automated n8n Workflow
- 🌐 Simple and User-Friendly Frontend

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| n8n | Workflow Automation |
| Gemini AI | Document Analysis & Data Extraction |
| MySQL | Database |
| HTML | Frontend |
| CSS | Styling |
| JavaScript | Frontend Logic |
| PDF Toolkit | PDF Merging |
| Excel | Verification Report |

---

# 📂 Project Structure

```text
Document-Verification-Automation/
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
├── Workflows/
│   └── document-verification-workflow.json
│
├── Documentation/
│
├── Screenshots/
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# 🔄 Workflow

```text
Folder Upload
      │
      ▼
Webhook (n8n)
      │
      ▼
Manifest Generation
      │
      ▼
File Mapping
      │
      ▼
Extract Aspirant ID
      │
      ▼
Group Documents
      │
      ▼
Merge PDFs
      │
      ▼
Gemini AI Analysis
      │
      ▼
Database Verification
      │
      ▼
Generate Excel Report
```

---

# 📸 Screenshots

## Frontend

> Add screenshot here

```
Screenshots/homepage.png
```

---

## n8n Workflow

> Add screenshot here

```
Screenshots/workflow.png
```

---

## Verification Report

> Add screenshot here

```
Screenshots/report.png
```

---

# ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/dhruvjpatel12/Document-Verification-Automation.git
```

### Open Project

Open the project in Visual Studio Code.

### Configure

- Configure your Gemini API Key.
- Configure MySQL credentials.
- Import the workflow into n8n.
- Update webhook URLs if required.

### Run

1. Start n8n.
2. Open the frontend.
3. Upload a batch folder.
4. Download the generated Excel report.

---

# 📊 Expected Output

The generated Excel report includes:

- Aspirant ID
- Verification Status
- Remarks
- Missing Documents
- Database Mismatches
- Final Decision

---

# 🎯 Future Enhancements

- OCR Confidence Scoring
- Image Document Support
- Multi-language OCR
- Authentication System
- Dashboard Analytics
- Email Notifications
- Cloud Storage Integration
- Audit Logs
- Digital Signature Verification

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Dhruv Patel**

Data Science Engineering Student

AI Automation • Business Intelligence • n8n Workflows • Data Analytics

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub!
