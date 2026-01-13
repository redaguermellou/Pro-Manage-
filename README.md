# Pro Manage 🚀

**Pro Manage** is a premium, high-performance project management application built with a modern tech stack centered around a **Neo4j Graph Database**. It provides a sleek, glassmorphic interface for teams to manage workspaces, projects, and tasks with real-time relational insights.

---

## ✨ Features

- **Graph-Powered Data**: Leverages Neo4j to model complex relationships between users, projects, and tasks.
- **Kanban Board**: Interactive "To-Do", "In Progress", and "Done" columns with smooth transitions.
- **Workspace Management**: Create and manage multiple projects/workspaces seamlessly.
- **Premium Design**: A state-of-the-art UI featuring glassmorphism, dark mode, and smooth micro-animations.
- **Secure Authentication**: Robust user registration and login with hashed passwords and server-side validation.
- **Responsive Layout**: Optimized for various screen sizes with a professional sidebar navigation.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django (Python)
- **Database**: Neo4j (Graph Database)
- **ORM**: Neomodel & Django-Neomodel
- **API**: RESTful endpoints

### Frontend
- **Framework**: React.js (Vite)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Premium Glassmorphism Design System)
- **Routing**: React Router DOM
- **API Client**: Axios

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.8+**
- **Node.js & npm**
- **Neo4j Desktop** or **Neo4j Aura** instance

### 1. Neo4j Setup
1. Open Neo4j Desktop and create a new database instance.
2. Ensure the instance is running.
3. Default credentials used in this project:
   - **URI**: `bolt://127.0.0.1:7687`
   - **User**: `neo4j`
   - **Password**: `Password!0` (Update in `core/settings.py` if different)

### 2. Backend Installation
```bash
cd core
# Create a virtual environment
python -m venv venv
# Activate virtual environment (Windows)
.\venv\Scripts\activate
# Install dependencies
pip install django neomodel django-neomodel django-cors-headers
# Setup database schema/labels
python manage.py install_labels
# Start the server
python manage.py runserver 8000
```

### 3. Frontend Installation
```bash
cd frontend
# Install dependencies
npm install
# Start dev server
npm run dev
```
The frontend will typically run on `http://localhost:5173` or `5174`.

---

## 📂 Project Structure

```text
project_management/
├── core/                   # Django Backend
│   ├── core/               # Project Settings & URLs
│   ├── jira/               # Main App (Models, Views, Utils)
│   └── manage.py           # Django CLI
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable Components (Board, etc.)
│   │   ├── pages/          # Full Pages (Login, Dashboard, etc.)
│   │   ├── api.js          # Axios Configuration
│   │   └── index.css       # Global Premium Design System
│   └── vite.config.js
└── README.md
```

---

## 🎨 Design System
The project uses a custom-built design system defined in `index.css`, featuring:
- **Glassmorphism**: High-quality blur and transparency effects.
- **Vibrant Gradients**: Professional dark-themed background animations.
- **Inter Font**: Modern typography for readability.
- **Utility Classes**: Optimized for performance and consistency.

---

## 📄 License
This project is licensed under the MIT License.

---

*Built with ❤️ for better project management.*
