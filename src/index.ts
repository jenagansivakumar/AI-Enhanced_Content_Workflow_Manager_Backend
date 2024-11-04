import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import contentRoutes from './routes/contentRoutes';
import { connectDB } from './config/database';
import errorHandler from './middlewares/errorHandler';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

connectDB();

app.use('/api', contentRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
