# Aarogya Sahayak - Medical Assistance for Rural Communities

### Project Overview

Healthcare access is severely limited in many rural areas, leading to delayed diagnoses and inconsistent care. **Aarogya Sahayak** is a full-stack prototype designed to provide **remote medical assistance** by connecting patients with healthcare professionals digitally. This project demonstrates my ability to integrate full-stack technologies (Flask and React), manage complex state, and apply product thinking to a high-impact social challenge. It facilitates remote consultations, vital tracking, and communication, bridging the care gap. This solution was developed as part of the **Bit-N-Build: Around the World 2025 Hackathon** by **Hacktronics**.

---

### Core Technology Stack

* **Frontend**: React (TypeScript, Vite)
* **Backend**: Python (Flask)
* **Database**: SQLite (managed by SQLAlchemy)
* **API Communication**: REST API (Flask-CORS)
* **Deployment**: Local Virtual Environments

---

### Key Features (MVP)

The prototype I built focuses on delivering essential services for remote care management:

* **Secure Patient/Provider Dashboards**: Role-based access ensuring data privacy and relevant information display for both patients and healthcare workers.
* **Vitals Tracking**: Allows users to log and track key health metrics over time, presented in a clean, chart-based interface.
* **Medication Reminders**: Implements a reminder system to ensure patient compliance with treatment schedules.
* **Chat System Integration**: Facilitates secure, asynchronous communication between the patient and their assigned professional.
* **Robust Backend API**: A Flask REST API handles authentication (Flask-JWT-Extended) and secure data storage (SQLAlchemy/SQLite).
* **API Verification Endpoint**: Includes a dedicated test endpoint (`/api/test`) to simplify debugging and ensure reliable connectivity.

---

### Local Setup & Installation

I designed the project to be easy to run end-to-end using standard Python and Node environments.

**Prerequisites**
* Git
* Python 3.x and pip (for backend)
* Node.js and npm (for frontend)

**Step-by-step Installation**

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/charwakDongre/Aarogya-sahayak.git](https://github.com/charwakDongre/Aarogya-sahayak.git)
    cd Aarogya-sahayak
    ```

2.  **Set up Backend (Flask)**:
    * Navigate to the backend: `cd backend`
    * Create and activate the virtual environment: `python3 -m venv venv` and `source venv/bin/activate`
    * Install dependencies: `pip install -r requirements.txt`
    * Run the server: `python test_app.py` (Starts on `http://localhost:5001`)

3.  **Set up Frontend (React)**:
    * Navigate to the frontend: `cd ../frontend`
    * Install dependencies: `npm install`
    * Run the development server: `npm run dev` (Starts on `http://localhost:5173`)

4.  **Access the Application**:
    Once both servers are running, access the application UI at **`http://localhost:5173`** and verify the backend connection at **`http://localhost:5001/api/test`**.

---

### Architectural Decisions

* **Flask-React Separation**: Used separate repositories (or directories) for the frontend and backend to enforce a clear **API contract** (REST) and promote modular development.
* **Virtual Environments**: Standard practice for Python development, ensuring dependencies are isolated and portable.
* **Type Safety (TypeScript)**: Utilizing TypeScript in the React frontend reduces runtime errors and makes the large codebase easier to maintain.
* **SQLAlchemy ORM**: Abstracting raw SQL allows for faster development and easier database migration between SQLite (development) and a production database (e.g., PostgreSQL).

---

### Verification and Troubleshooting

* **API Test Route**: The dedicated frontend route, **`http://localhost:5173/api-test`**, confirms that the CORS settings and API calls are functioning correctly between the React and Flask servers.
* **Troubleshooting**: If issues arise, ensure the virtual environment is *active* before running `python app.py` and check the terminal logs for port conflicts.

---

### TODO.md (Future Enhancements)

* [ ] Integrate a true persistent database (PostgreSQL/MySQL) and containerize with Docker Compose.
* [ ] Implement secure file storage for medical records (e.g., utilizing AWS S3).
* [ ] Add a video/telehealth consultation feature using WebRTC.
* [ ] Build a comprehensive admin dashboard for managing users and system data.
