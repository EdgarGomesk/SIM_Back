import { Router } from 'express';
import { body } from 'express-validator';
import { createUser, login } from '../controllers/userController';
import { hashPassword } from '../middleware/hashPassword';
import { handleInputErrors } from '../middleware/validation';
import { getMunicipios } from '../controllers/municipioController';

const router = Router();

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
    handleInputErrors, 
    hashPassword,   
  ],
  createUser
);


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
