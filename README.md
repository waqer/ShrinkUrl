# ShrinkURL

ShrinkURL is a full-stack URL shortening application built with **Flask** (backend) and **React** (frontend). It allows users to paste or enter URLs, optionally auto-fix them with `https://` and `.com`, and generate short URLs for easier sharing.

---

## Features

- Shorten long URLs
- Auto-add `https://` and `.com` if missing
- Copy shortened URLs to clipboard
- Dashboard to view all shortened URLs
- Lightweight and easy to deploy

---

## Getting Started

Backend Setup

1. Navigate to the backend folder:

```bash
cd backend

2. Create and activate a virtual environment:

python -m venv venv
# Windows
venv\Scripts\activate
# Linux / macOS
source venv/bin/activate

3. Install dependencies:

pip install -r requirements.txt

4. Run the backend server:

python app.py

Frontend Setup

1. Navigate to the frontend folder:

cd frontend


2. Install dependencies:

npm install
# or
yarn install


3. Start the frontend server:

npm start
# or
yarn start


Frontend runs at: http://localhost:3000


Folder Structure
ShrinkURL/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── database.db
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── URLList.js
│   ├── package.json
│   └── public/
├── .gitignore
└── README.md
