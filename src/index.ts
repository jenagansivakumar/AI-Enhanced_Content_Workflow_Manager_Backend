import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import contentRoutes from './routes/contentRoutes';
import { connectDatabase } from './config/database';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';



const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

connectDatabase();

app.use('/api/content', contentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
