import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db';
import userRouter from './routes/userRouter';
import municipioRouter from './routes/municipioRouter';

// ✅ Inicializa dotenv
dotenv.config();

async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.blue.bold('Conexión exitosa a la BD'));
  } catch (error) {
    console.log(colors.red.bold('Fallo la conexión a la BD'));
  }
}
connectDB();

const app = express();

// ✅ CORS dinámico por variable de entorno
const allowedOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());

// ✅ Rutas
app.use('/api/auth', userRouter);
app.use('/api/municipios', municipioRouter);

export default app;
