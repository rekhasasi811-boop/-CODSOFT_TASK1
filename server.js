const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database(path.join(__dirname, "students.db"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,
    age INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
  db.get("SELECT COUNT(*) AS count FROM students", (err, row) => {
    if (!err && row.count === 0) {
      const insert = db.prepare("INSERT INTO students (name,email,course,age) VALUES (?,?,?,?)");
      insert.run("Priya", "priya@example.com", "Full Stack Development", 21);
      insert.run("Arun", "arun@example.com", "Web Development", 22);
      insert.finalize();
    }
  });
});

app.get("/api/students", (req, res) => {
  db.all("SELECT * FROM students ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Could not load students" });
    res.json(rows);
  });
});

app.post("/api/students", (req, res) => {
  const { name, email, course, age } = req.body;
  if (!name || !email || !course) {
    return res.status(400).json({ message: "Name, email and course are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }
  db.run(
    "INSERT INTO students (name,email,course,age) VALUES (?,?,?,?)",
    [name.trim(), email.trim(), course.trim(), age ? Number(age) : null],
    function (err) {
      if (err) return res.status(500).json({ message: "Could not save student" });
      db.get("SELECT * FROM students WHERE id = ?", [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ message: "Student saved, but could not load record" });
        res.status(201).json(row);
      });
    }
  );
});

app.put("/api/students/:id", (req, res) => {
  const { name, email, course, age } = req.body;
  if (!name || !email || !course) {
    return res.status(400).json({ message: "Name, email and course are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }
  db.run(
    "UPDATE students SET name=?, email=?, course=?, age=? WHERE id=?",
    [name.trim(), email.trim(), course.trim(), age ? Number(age) : null, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ message: "Could not update student" });
      if (!this.changes) return res.status(404).json({ message: "Student not found" });
      db.get("SELECT * FROM students WHERE id=?", [req.params.id], (e, row) => res.json(row));
    }
  );
});

app.delete("/api/students/:id", (req, res) => {
  db.run("DELETE FROM students WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: "Could not delete student" });
    if (!this.changes) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  });
});

app.get("/api/health", (req, res) => res.json({ status: "Student Management System is running" }));

app.listen(PORT, () => console.log(`Student Management System running on port ${PORT}`));
