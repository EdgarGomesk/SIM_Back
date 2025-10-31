import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'; 
import { db } from './config/db'
import userRouter from './routes/userRouter'
import municipioRouter from './routes/municipioRouter';

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


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,               
}));

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/auth', userRouter)
app.use('/api/municipios', municipioRouter); 

export default app