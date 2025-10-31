// src/controllers/municipioController.ts
import { Request, Response } from 'express';
import Municipio from '../models/municipio';
import bcrypt from 'bcrypt';

// Crear municipio
export const createMunicipio = async (req: Request, res: Response) => {
  try {
    const { nombre, password } = req.body;

    const exists = await Municipio.findOne({ where: { nombre } });
    if (exists) {
      return res.status(400).json({ message: 'El municipio ya existe' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const municipio = await Municipio.create({ nombre, password: hashed });

    res.status(201).json({
      message: 'Municipio creado exitosamente',
      municipio: { id: municipio.id, nombre: municipio.nombre },
    });
  } catch (error) {
    console.error('❌ Error al crear municipio:', error);
    res.status(500).json({ message: 'Error al crear municipio' });
  }
};

// Obtener lista de municipios (solo nombres)
export const getMunicipios = async (req: Request, res: Response) => {
  try {
    const municipios = await Municipio.findAll({ attributes: ['id', 'nombre'] });
    res.json(municipios);
  } catch (error) {
    console.error('❌ Error al obtener municipios:', error);
    res.status(500).json({ message: 'Error al obtener municipios' });
  }
};

// Verificar contraseña
export const verificarPassword = async (req: Request, res: Response) => {
  const { nombre, password } = req.body;

  try {
    const municipio = await Municipio.findOne({ where: { nombre } });

    if (!municipio) {
      return res.status(404).json({
        ok: false,
        message: '❌ Municipio no encontrado',
      });
    }

    const valid = await bcrypt.compare(password, municipio.password);
    if (!valid) {
      return res.status(401).json({
        ok: false,
        message: '⚠️ Contraseña incorrecta',
      });
    }

    return res.status(200).json({
      ok: true,
      message: '✅ Contraseña correcta',
    });
  } catch (error) {
    console.error('❌ Error interno al verificar contraseña:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
    });
  }
};
