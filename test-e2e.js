const email = 'test' + Date.now() + '@example.com';
const password = 'Password123!';

async function run() {
  console.log('1. Registering user...');
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email, password })
  });
  console.log(await regRes.json());

  console.log('\n2. Testing 404 Email Not Found...');
  const notFoundRes = await fetch('http://localhost:5000/api/auth/forgot-password', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'fake@fake.com' })
  });
  console.log(notFoundRes.status, await notFoundRes.json());

  console.log('\n3. Requesting OTP...');
  const otpRes = await fetch('http://localhost:5000/api/auth/forgot-password', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  console.log(await otpRes.json());
}
run();
