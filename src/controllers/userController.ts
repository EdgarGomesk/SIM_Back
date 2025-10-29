import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

/**
 * Crear usuario (usa middleware hashPassword o hashea aquí si prefieres)
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Verificar si ya existe
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear usuario (el hash ya viene aplicado por el middleware)
    const user = await User.create({ username, password });

    return res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user });
  } catch (error) {
    console.error("❌ Error al crear el usuario:", error);
    return res.status(500).json({ message: "Error al crear el usuario" });
  }
};

/**
 * Iniciar sesión (valida usuario y genera token JWT)
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validar campos vacíos desde el backend también (doble capa de seguridad)
    if (!username || !password)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.status(401).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.getDataValue("password"));
    if (!valid)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "6h" });

    res.json({ message: "Login exitoso", token, username });
  } catch (error) {
    console.error("❌ Error interno en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
