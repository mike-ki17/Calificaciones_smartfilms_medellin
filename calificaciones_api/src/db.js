import mysql from 'mysql2/promise';
import process from 'process';

// Cargamos variables de entorno
if (process.loadEnvFile) {
    process.loadEnvFile(); // según tu petición, aunque normalmente se usa dotenv
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a la base de datos exitosa');
        connection.release(); // liberamos la conexión
    } catch (error) {
        console.log(process.env.DB_PASSWORD)
        console.error('❌ Error de conexión a la base de datos:', error.message);
        process.exit(1); // salir si no hay conexión
    }
}

testConnection();

export default pool;
