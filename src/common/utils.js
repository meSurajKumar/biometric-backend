const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": "biometric_realm",
  "auth-server-url": "http://localhost:8080",
  "ssl-required": "external",
  "resource": "biometric-client-app",
  "public-client": true,
  "confidential-port": 0
});

module.exports = {
  keycloak,
  memoryStore
};
