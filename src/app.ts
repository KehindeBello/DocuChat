import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import { config } from './lib/config'
import './events';
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello, Welcome to DocuChat!');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  })
})