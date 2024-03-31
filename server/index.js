import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import databaseConnection from './db.js';

// Routes
import productRoutes from './routes/productRoutes.js';

databaseConnection();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);

const PORT = 5001;

app.get('/', (req, res) => {
    res.send("API is running...");
})

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
})
