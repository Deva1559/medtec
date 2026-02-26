const jwt = require('jwt-simple');

const secret = 'demo-secret';

// Create a token
const payload = { userId: 'admin1', isDemo: true };
const token = jwt.encode(payload, secret);
console.log('Generated token:', token);

// Decode the token
try {
  const decoded = jwt.decode(token, secret);
  console.log('Decoded token:', decoded);
  console.log('Token is valid!');
} catch (err) {
  console.error('Token validation failed:', err.message);
}

// Test with the token from the API
const apiToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhZG1pbjEiLCJpc0RlbW8iOnRydWV9.JGxIkdcfxMgtBZ1RqRRP-c5dv4ydx3p8ewlDcGNqe34U';
try {
  const decoded = jwt.decode(apiToken, secret);
  console.log('API token decoded:', decoded);
} catch (err) {
  console.error('API token validation failed:', err.message);
}
