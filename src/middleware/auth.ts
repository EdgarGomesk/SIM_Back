import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

// Middleware para verificar el token en rutas protegidas
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Guardamos los datos del usuario dentro del request
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
