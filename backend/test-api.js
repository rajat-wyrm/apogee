/**
 * API Test Script
 * Run this to test all endpoints
 */

const http = require('http');

const API_URL = 'http://localhost:5000/api';

async function testEndpoint(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          console.log(`✅ ${method} ${path}: ${res.statusCode}`);
          resolve(parsed);
        } catch (e) {
          console.log(`❌ ${method} ${path}: Failed to parse response`);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${method} ${path}: ${error.message}`);
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n🔍 TESTING APOGEE API\n' + '='.repeat(50));

  // Test health endpoint
  await testEndpoint('GET', '/health');

  // Test auth endpoints
  console.log('\n📝 Testing Auth Endpoints:');
  
  // Register test user
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };
  
  const registerResult = await testEndpoint('POST', '/auth/register', testUser);
  
  // Login
  const loginResult = await testEndpoint('POST', '/auth/login', {
    email: 'test@example.com',
    password: 'password123'
  });

  console.log('\n🎉 API Tests Complete!\n');
}

runTests().catch(console.error);