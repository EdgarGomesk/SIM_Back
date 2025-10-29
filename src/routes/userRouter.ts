import { Router } from 'express';
import { body } from 'express-validator';
import { createUser, login } from '../controllers/userController';
import { hashPassword } from '../middleware/hashPassword';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

/**
 * Validaciones + middlewares encadenados
 */

// ✅ Crear usuario (solo para ti o pruebas)
router.post(
  '/register',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('El nombre de usuario es obligatorio')
      .isLength({ min: 3, max: 20 }).withMessage('Debe tener entre 3 y 20 caracteres'),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 6 }).withMessage('Debe tener al menos 6 caracteres'),
    handleInputErrors, // Maneja errores
    hashPassword,   // Hashea la contraseña
  ],
  createUser
);

// ✅ Login de usuario
router.post(
  '/login',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
  ],
  login
);

export default router;
