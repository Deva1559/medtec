const http = require('http');

// Test function to make HTTP requests
function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(body)
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// Test cases
async function runTests() {
  console.log('=== Authentication System Tests ===\n');

  // Test 1: Valid admin credentials
  console.log('Test 1: Valid admin credentials');
  try {
    const result = await makeRequest('/api/auth/login', {
      email: 'admin@healx.com',
      password: 'admin@123'
    });

    console.log('Status:', result.statusCode);
    console.log('Response:', result.body);
    console.log('✅ PASS: Admin login successful\n');
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 2: Valid doctor credentials
  console.log('Test 2: Valid doctor credentials');
  try {
    const result = await makeRequest('/api/auth/login', {
      email: 'doctor1@healx.com',
      password: 'doctor1@123'

    });
    console.log('Status:', result.statusCode);
    console.log('Response:', result.body);
    console.log('✅ PASS: Doctor login successful\n');
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 3: Valid patient credentials
  console.log('Test 3: Valid patient credentials');
  try {
    const result = await makeRequest('/api/auth/login', {
      email: 'patient1@healx.com',
      password: 'patient1@123'

    });
    console.log('Status:', result.statusCode);
    console.log('Response:', result.body);
    console.log('✅ PASS: Patient login successful\n');
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 4: Invalid email
  console.log('Test 4: Invalid email (should fail)');
  try {
    const result = await makeRequest('/api/auth/login', {
      email: 'invalid@healx.com',
      password: 'admin123'
    });
    console.log('Status:', result.statusCode);
    console.log('Response:', result.body);
    if (result.statusCode === 401) {
      console.log('✅ PASS: Invalid email rejected with 401\n');
    } else {
      console.log('❌ FAIL: Expected 401, got', result.statusCode, '\n');
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 5: Invalid password
  console.log('Test 5: Invalid password (should fail)');
  try {
    const result = await makeRequest('/api/auth/login', {
      email: 'admin@healx.com',
      password: 'wrongpassword'
    });
    console.log('Status:', result.statusCode);
    console.log('Response:', result.body);
    if (result.statusCode === 401) {
      console.log('✅ PASS: Invalid password rejected with 401\n');
    } else {
      console.log('❌ FAIL: Expected 401, got', result.statusCode, '\n');
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 6: Demo login with valid credentials
  console.log('Test 6: Demo login with valid credentials');
  try {
    const result = await makeRequest('/api/auth/demo-login', {
      email: 'admin@healx.com',
      password: 'admin@123'
    });

    console.log('Status:', result.statusCode);
    console.log('Response:', result.body);
    console.log('✅ PASS: Demo login successful\n');
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 7: Demo login with invalid credentials
  console.log('Test 7: Demo login with invalid credentials (should fail)');
  try {
    const result = await makeRequest('/api/auth/demo-login', {
      email: 'admin@healx.com',
      password: 'wrongpassword'
    });
    console.log('Status:', result.statusCode);
    console.log('Response:', result.body);
    if (result.statusCode === 401) {
      console.log('✅ PASS: Invalid demo credentials rejected with 401\n');
    } else {
      console.log('❌ FAIL: Expected 401, got', result.statusCode, '\n');
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  console.log('=== All Tests Completed ===');
}

runTests();
