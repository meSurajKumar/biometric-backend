import { Router } from 'express';
import { keycloak } from '../startup/middleware.js';
import authController from '../constrollers/auth.contollers/auth.controller.js';
import verifyToken from '../middlewares/auth.js';

const router = Router();

router.get('/user/:id', [verifyToken], authController.getUserData);
router.post('/login', authController.userLogin);
// router.get('/dashboard', [keycloak.protect()], authController.dashboardMethod);
router.post('/submit', [verifyToken],authController.submitData);


router.post('/logout', authController.logoutUser);
router.put('/update', [verifyToken],authController.updateScore);

export default router;
