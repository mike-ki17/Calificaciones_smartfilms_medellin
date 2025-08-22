import express from 'express';
import indexRoutes from './src/routes/index.js';
import shortsRoutes from './src/routes/shorts.js';
import roomsRoutes from './src/routes/rooms.js';
import process from 'process';
import cors from 'cors';

import './src/db.js';
// Cargar variables de entorno si es necesario
if (process.loadEnvFile) process.loadEnvFile();

const app = express();
app.use(cors());
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/', indexRoutes);
app.use('/shorts', shortsRoutes);
app.use('/rooms', roomsRoutes);
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
