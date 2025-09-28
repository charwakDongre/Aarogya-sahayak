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
- **Database**: PostgreSQL (preferred) or SQLite (fallback)
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Authentication**: Flask-Login / Flask-JWT-Extended
- **CORS Handling**: Flask-CORS

## 🗄️ PostgreSQL Setup
- Ensure PostgreSQL is installed and running locally or accessible remotely.
- Create a database and user with appropriate privileges.

Example (local setup):

```
psql
CREATE DATABASE aarogya_sahayak;
CREATE USER aarogya_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aarogya_sahayak TO aarogya_user;
```

### Configure the Backend
- The backend reads the `DATABASE_URL` environment variable.
- If unset, it falls back to a SQLite file under `backend/instance/`.
- Legacy `postgres://` URLs are automatically normalized to `postgresql://`.

Examples:

```
export DATABASE_URL="postgresql://aarogya_user:your_password@localhost:5432/aarogya_sahayak"
# or for cloud providers
export DATABASE_URL="postgresql://user:pass@host:port/dbname"
```

### Install and Migrate

```
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Set Flask app for CLI
export FLASK_APP=app.py

# Apply migrations
flask db upgrade

# Run the API
python app.py
```

Once running, the API will use PostgreSQL if `DATABASE_URL` is set.

---
---

