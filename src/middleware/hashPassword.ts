import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Falta la contraseña' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    req.body.password = hashed;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al hashear la contraseña' });
  }
};
