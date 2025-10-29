import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'; // 👈 aquí
import { db } from './config/db'
import userRouter from './routes/userRouter'

async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log( colors.blue.bold('conexión exitosa a la BD'))
    } catch (error) {
        //console.log(error)
        console.log( colors.red.bold('Fallo la conexión a la BD'))
    }
}
connectDB()
const app = express()

// 👇 Agrega esto antes de tus rutas
app.use(cors({
  origin: 'http://localhost:5173', // permite solo tu front local
  credentials: true,               // si manejas cookies (opcional)
}));

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/auth', userRouter)

export default app