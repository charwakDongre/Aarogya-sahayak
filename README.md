# Aarogya Sahayak

## 🚀 Project Overview
**Aarogya Sahayak** is a healthcare platform designed to provide **medical assistance in rural areas**. It bridges the gap in healthcare accessibility by connecting patients with healthcare professionals, tracking vitals, managing reminders, and facilitating communication through a chat system. This project was developed as part of the **Bit-N-Build: Around the World 2025 Hackathon** by **Hacktronics**.

---

## 🛠️ Tech Stack
### **Frontend**
- **Framework**: React (with TypeScript)
- **Routing**: React Router
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Context API
- **API Communication**: Fetch API / Axios

### **Backend**
- **Framework**: Flask
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Authentication**: Flask-Login / Flask-JWT-Extended
- **CORS Handling**: Flask-CORS

---
### 1. Clone the Repository

First, clone the repository to your local machine and navigate into the project directory:

```bash
git clone [https://github.com/charwakDongre/Aarogya-sahayak.git](https://github.com/charwakDongre/Aarogya-sahayak.git)
cd Aarogya-sahayak
---

### 2. Backend Setup (Flask)

```markdown
### 2. Backend Setup (Flask)

The backend is built with **Flask** and Python.

1.  **Navigate** to the `backend` directory:
    ```bash
    cd backend
    ```

2.  **Create and activate** a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate    # On Windows: venv\Scripts\activate
    ```

3.  **Install** the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run** the Flask application:
    ```bash
    python app.py
    ```
    > The backend server will start on `http://localhost:5001`.
### 3. Frontend Setup (React/Vue/etc.)

The frontend is built with [***Specify frontend framework, e.g., React, Vue, etc.***].

1.  **Navigate** to the `frontend` directory:
    ```bash
    cd ../frontend
    ```

2.  **Install** the required dependencies:
    ```bash
    npm install
    ```

3.  **Start** the development server:
    ```bash
    npm run dev
    ```
    > The frontend application will start on `http://localhost:5173`.
### 4. Verify the Application

Open your browser and navigate to the following URLs to ensure everything is running:

| Component | URL | Status Check |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:5173` | The main application UI should load. |
| **Backend API** | `http://localhost:5001/api/test` | You should see a success message (e.g., JSON response). |

