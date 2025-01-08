import express, { Application } from 'express';
import tasksRoutes from './routes/tasksRoutes';

const app: Application = express();
app.use(express.json());

// Rotas
app.use('', tasksRoutes);

export default app;