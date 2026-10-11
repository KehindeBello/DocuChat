import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import { config } from './lib/config'
import './events';
import router from './routes/index'
import swaggerUi from 'swagger-ui-express'; 
import { swaggerSpec } from './lib/swagger'; 
import { errorHandler } from './middlewares/errorHandler';


export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/', router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 
app.get('/api-docs.json', (req, res) => { 
  res.json(swaggerSpec) 
});

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

app.use((req, res) => { 
  res.status(404).json({
    success: false, 
    error: { code: 'NOT_FOUND', message: `Route ${req.path} not found` }, 
  }); 
}); 

app.use(errorHandler);
