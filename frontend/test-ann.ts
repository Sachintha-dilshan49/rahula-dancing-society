import { authService } from './src/services/auth.service';

async function run() {
  const tokenUrl = 'http://localhost:5000/api/auth/login';
  const loginRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gmail.com', password: '123456' })
  });
  
  if (!loginRes.ok) {
    console.log("Login failed");
    return;
  }
  
  const { token } = await loginRes.json() as any;
  
  const res = await fetch('http://localhost:5000/api/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'second announcement',
      description: '2nd one',
      grade: null
    })
  });
  
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
}

run();
