# EduManage – Student Management System (CodSoft Task 1)

A beginner-friendly full-stack demonstration app for managing student records.

## Features
- Dashboard with total student and course counts
- Add, view, edit and delete student records
- Required-field and email validation
- SQLite database persistence
- Responsive layout for mobile and desktop
- Sample student records on first run

## Technology
- Node.js and Express
- SQLite
- HTML, CSS and JavaScript

## Run locally
1. Install Node.js.
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

## API endpoints
- `GET /api/health` – check server
- `GET /api/students` – list students
- `POST /api/students` – create student
- `PUT /api/students/:id` – update student
- `DELETE /api/students/:id` – delete student

### Example create request
```json
{
  "name": "Priya",
  "email": "priya@example.com",
  "course": "Full Stack Development",
  "age": 21
}
```

## Project scope
This is a working student-record management prototype based on the Task 1 overview. The PDF describes a broader education platform including teachers, attendance, examinations, fees and academic records. Those modules are not implemented in this starter version.

## Submission note
Upload the project files to a GitHub repository named `CODSOFT_TASK1`. Test the deployed app before sharing a public proof link.
