import { Request, Response, NextFunction } from 'express';
import { QueryTypes } from 'sequelize';
import Municipio from '../models/municipio';

export const verifyMunicipioPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Debe enviar el nombre y la contraseña del municipio',
    });
  }

  try {
    // Normaliza el nombre y compara la contraseña
    const [result]: any = await Municipio.sequelize!.query(
      `SELECT * FROM municipios 
       WHERE LOWER(nombre) = LOWER(:nombre) 
       AND password = crypt(:password, password)`,
      {
        replacements: { nombre, password },
        type: QueryTypes.SELECT,
      }
    );

    if (!result) {
      // 👇 Aquí está el cambio: respuesta controlada y directa
      return res.json({
        ok: false,
        message: '❌ Contraseña incorrecta',
      });
    }

    // Si pasa, guardamos el municipio para futuras operaciones
    (req as any).municipio = result;

    return res.json({
      ok: true,
      message: '✅ Contraseña correcta',
    });
  } catch (error) {
    console.error('❌ Error interno al verificar contraseña del municipio:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno al validar municipio',
    });
  }
};
