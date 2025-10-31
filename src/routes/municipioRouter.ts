import { Router } from 'express';
import { body } from 'express-validator';
import { createMunicipio, getMunicipios, verificarPassword } from '../controllers/municipioController';
import { handleInputErrors } from '../middleware/validation';
import { verifyMunicipioPassword } from '../middleware/municipioAuth';

const router = Router();

// Crear municipio
router.post(
  '/register',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
  ],
  createMunicipio
);

// Obtener todos los municipios
router.get('/', getMunicipios);

// Verificar contraseña
router.post(
  '/verificar',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    verifyMunicipioPassword
  ],
  verificarPassword
);

export default router;
