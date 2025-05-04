import { Router } from 'express';
import { keycloak } from '../startup/middleware.js';
import authController from '../constrollers/auth.contollers/auth.controller.js';
import verifyToken from '../middlewares/auth.js';

const router = Router();

router.get('/user/:id', [verifyToken], authController.getUserData);
router.post('/login', authController.userLogin);
router.get('/dashboard', [keycloak.protect()], authController.dashboardMethod);
router.post('/submit', keycloak.protect(), authController.submitData);

export default router;
