const form = document.getElementById("studentForm");
const rows = document.getElementById("studentRows");
const message = document.getElementById("message");

async function loadStudents() {
  try {
    const response = await fetch("/api/students");
    const students = await response.json();
    rows.innerHTML = "";
    document.getElementById("totalCount").textContent = students.length;
    document.getElementById("courseCount").textContent = new Set(students.map(s => s.course)).size;
    document.getElementById("emptyState").textContent = students.length ? "" : "No students yet. Add the first student above.";
    students.forEach(student => {
      const tr = document.createElement("tr");
      [student.name, student.email, student.course, student.age || "—"].forEach(value => {
        const td = document.createElement("td"); td.textContent = value; tr.appendChild(td);
      });
      const action = document.createElement("td");
      const edit = document.createElement("button"); edit.className = "row-button secondary"; edit.textContent = "Edit";
      edit.onclick = () => editStudent(student);
      const del = document.createElement("button"); del.className = "row-button delete"; del.textContent = "Delete";
      del.onclick = () => deleteStudent(student.id);
      action.append(edit, del); tr.appendChild(action); rows.appendChild(tr);
    });
  } catch (error) {
    document.getElementById("emptyState").textContent = "Could not connect to the server. Please refresh.";
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const id = document.getElementById("studentId").value;
  const student = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    course: document.getElementById("course").value.trim(),
    age: document.getElementById("age").value
  };
  try {
    const response = await fetch(id ? `/api/students/${id}` : "/api/students", {
      method: id ? "PUT" : "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(student)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Something went wrong");
    message.textContent = id ? "Student updated successfully." : "Student added successfully.";
    message.style.color = "green";
    resetForm(); loadStudents();
  } catch (error) {
    message.textContent = error.message; message.style.color = "#c33";
  }
});

function editStudent(student) {
  document.getElementById("studentId").value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("course").value = student.course;
  document.getElementById("age").value = student.age || "";
  document.getElementById("formTitle").textContent = "Edit student";
  document.getElementById("saveButton").textContent = "Update student";
  document.getElementById("cancelButton").hidden = false;
  window.scrollTo({top:0,behavior:"smooth"});
}

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  const response = await fetch(`/api/students/${id}`, {method:"DELETE"});
  const result = await response.json();
  message.textContent = result.message;
  message.style.color = response.ok ? "green" : "#c33";
  loadStudents();
}

function resetForm() {
  form.reset(); document.getElementById("studentId").value = "";
  document.getElementById("formTitle").textContent = "Add student";
  document.getElementById("saveButton").textContent = "Save student";
  document.getElementById("cancelButton").hidden = true;
}
document.getElementById("cancelButton").addEventListener("click", resetForm);
document.getElementById("refreshButton").addEventListener("click", loadStudents);
loadStudents();
