# Dog Selector

Dog Selector is a small internal tool built for the **Pawfect Match** team to manage dog profiles and review adoption inquiries.

The application allows the team to browse dogs, update ratings and notes, manage records, and handle contact messages submitted by visitors interested in adopting.

The project is implemented using **Django REST Framework and React**, with a PostgreSQL database and Docker-based development environment.

---

# Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL

### Frontend
- React
- TypeScript
- Bootstrap 5

### Infrastructure
- Docker
- Docker Compose

---

# Features

## Dogs Management

The main page displays a data table of dogs with the following functionality:

- Search by **breed** or **description**
- Column sorting
- Pagination
- Inline rating editing (star rating)
- Edit dog information using a **Bootstrap Offcanvas panel**
- Delete individual dogs with confirmation modal
- Bulk delete selected dogs
- Toast notifications for user feedback

---

## Contact Page

Visitors can send inquiries using a contact form.

- Submissions are **stored in the database**
- Messages are accessible via **Django Admin**
- No frontend listing of submissions is required

---

## Django Admin

All models are registered and manageable through Django Admin:

- Dogs
- Breeds
- Descriptions
- Contact submissions

---

# Project Structure


dog-selector/
│
├── backend/ # Django REST API
│ ├── dogs/
│ ├── contact/
│ ├── config/
│ ├── manage.py
│ └── Dockerfile
│
├── frontend/ # React application
│ ├── src/
│ ├── public/
│ └── Dockerfile
│
├── docker-compose.yml
└── README.md


---

# Getting Started

The easiest way to run the project is using **Docker Compose**.

## 1. Clone the repository

git clone https://github.com/EnerikK/DogSelector.git
cd dogSelector

---

## Environment variables

Create the environment file from the example:

Windows:

copy .env.example .env

Mac / Linux:

cp .env.example .env

## 2. Start the application

Build and start all services:
docker compose up --build

This will start:

- PostgreSQL database
- Django backend
- React frontend

---

# Seed Data

To populate the database with sample data for testing:

docker compose exec backend python manage.py seed

This command creates sample breeds, descriptions, and dogs so that pagination, search, and sorting features can be demonstrated immediately.

---

## 3. Run database migrations

docker compose exec backend python manage.py migrate

---

## 4. Create an admin user

docker compose exec backend python manage.py createsuperuser

Follow the prompts to create your admin credentials.

---

# Accessing the Application

Frontend:


http://localhost:5173

Backend API:

http://localhost:8000/api/v1/

Django Admin:

http://localhost:8000/admin

---

# Running Tests

Backend tests can be executed with:

docker compose exec backend pytest

Tests cover:

- Dog models
- Dog serializers
- Dog API endpoints
- Contact model
- Contact serializer
- Contact API endpoint
- Contact Email Validation

---

# Database

The application uses **PostgreSQL**.
Default connection details:

Database: dogselector
User: dogselector
Password: dogselector
Host: localhost
Port: 5432

You can connect to the database using tools like **DBeaver**.

---

# Stopping the Application

To stop all services:

docker compose down

To remove volumes as well:

docker compose down -v

---

# Design Notes

The frontend UI follows the provided **Figma design** and uses Bootstrap components such as:

- Offcanvas
- Modals
- Toasts
- Responsive grid layout

---

# Author

Enerik Kotsi
Developer assignment — Dog Selector  
Implemented using **Django REST Framework + React**
