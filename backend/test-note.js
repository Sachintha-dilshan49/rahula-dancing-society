import fetch from 'node-fetch';

async function run() {
  // 1. Login
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gmail.com', password: '123456' })
  });
  const { token } = await loginRes.json() as any;

  // 2. Get students
  const studentsRes = await fetch('http://localhost:5000/api/students', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const students = await studentsRes.json() as any[];
  console.log('First student:', students[0]?.id, students[0]?.name);

  if (!students[0]) { console.log('No students found!'); return; }

  // 3. Try send note
  const noteRes = await fetch('http://localhost:5000/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      title: 'Test Note',
      content: '<p>Test content</p>',
      studentId: students[0].id
    })
  });

  console.log('Status:', noteRes.status);
  const body = await noteRes.text();
  console.log('Body:', body);
}

run().catch(console.error);
