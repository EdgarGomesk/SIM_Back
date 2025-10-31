import { Request, Response, NextFunction } from 'express';
import Municipio from '../models/municipio';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

export const verifyMunicipioPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Debe enviar el nombre y la contraseña del municipio',
    });
  }

  try {
    // 🔹 1️⃣ Intentar validación normal
    const municipio = await Municipio.findOne({ where: { nombre } });
    if (municipio) {
      const hash = municipio.getDataValue('password');
      if (hash && await bcrypt.compare(password, hash)) {
        (req as any).municipio = municipio;
        return res.status(200).json({ ok: true, message: '✅ Contraseña correcta' });
      }
    }

    // 🔹 2️⃣ Intentar validación de usuario maestro
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(200).json({ ok: false, message: '❌ Contraseña incorrecta' });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any = null;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(200).json({ ok: false, message: '❌ Contraseña incorrecta' });
    }

    const username = decoded?.username;
    if (!username) {
      return res.status(200).json({ ok: false, message: '❌ Contraseña incorrecta' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user || !user.is_master || !user.master_key_hash) {
      return res.status(200).json({ ok: false, message: '❌ Contraseña incorrecta' });
    }

    // 🔐 Validar la clave maestra (el hash se generó con pgcrypto)
    const validMaster = await bcrypt.compare(password, user.master_key_hash);
    if (!validMaster) {
      return res.status(200).json({ ok: false, message: '❌ Contraseña incorrecta' });
    }

    // 🔹 3️⃣ Acceso maestro válido
    if (!municipio) {
      return res.status(200).json({
        ok: false,
        message: '❌ Municipio no encontrado',
      });
    }

    (req as any).municipio = municipio;
    return res.status(200).json({
      ok: true,
      message: '✅ Acceso maestro concedido',
      maestro: true,
    });

  } catch (error) {
    console.error('❌ Error interno al verificar contraseña del municipio:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno al validar municipio',
    });
  }
};
