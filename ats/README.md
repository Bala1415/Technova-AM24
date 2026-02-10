# ATS Module - Run Instructions

This folder contains the complete Applicant Tracking System (ATS) module, including:

1.  **AI Service** (`ai-service`): The core resume analysis and building engine (Python).
2.  **Auth Backend** (`backend`): User authentication service (Node.js).
3.  **Frontend** (`frontend`): The user interface (React).

## Setup

Since this is a fresh copy, you need to install dependencies.

1.  **Backend**:

    ```poweshell
    cd backend
    npm install
    ```

2.  **Frontend**:

    ```powershell
    cd frontend
    npm install
    ```

3.  **AI Service**:
    ```powershell
    cd ai-service
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    python setup_chromedriver.py
    ```

## Running

Double-click or run the `start_all.ps1` script in PowerShell:

```powershell
.\start_all.ps1
```

This will launch all three services in separate windows.
