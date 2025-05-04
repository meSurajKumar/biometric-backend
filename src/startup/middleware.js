import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import session from 'express-session';
import Keycloak from 'keycloak-connect';
const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
    "realm": "biometric_realm",
    "auth-server-url": "http://localhost:8080",
    "ssl-required": "external",
    "resource": "biometric-client-app",
    "public-client": true,
    "confidential-port": 0
  });

const secretKey = process.env.SECRET_KEY || 'default-secret-key';


const middleware = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      secret: secretKey,
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );
  app.use(keycloak.middleware());
};

export { middleware, keycloak };
