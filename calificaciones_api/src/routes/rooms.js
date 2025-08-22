import { Router } from 'express';
import pool from '../db.js';

const router = Router();



router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name FROM rooms');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las salas' });
    }
});

router.get('/:roomId/shorts', async (req, res) => {
   const { roomId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.title, s.director, s.description, r.rating
       FROM shorts s
       LEFT JOIN ratings r ON s.id = r.short_id
       WHERE s.room_id = ?`,
      [roomId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los shorts de la sala' });
  }
});


router.post('/rating', async (req, res) => {
     const { shortId, rating } = req.body;

  if (!shortId || rating == null) {
    return res.status(400).json({ error: 'shortId y rating son requeridos' });
  }

  try {
    // Inserta la calificación o actualiza si ya existe
    await pool.query(
      `INSERT INTO ratings (short_id, rating)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [shortId, rating]
    );

    res.json({ message: 'Calificación guardada correctamente', shortId, rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar la calificación' });
  }
});

router.get('/total', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) AS total_ratings FROM ratings');
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener total de calificaciones' });
    }
});

// Calificaciones por sala
router.get('/by-room', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.id AS room_id, r.name AS room_name, COUNT(rt.id) AS total_ratings
            FROM rooms r
            LEFT JOIN shorts s ON s.room_id = r.id
            LEFT JOIN ratings rt ON rt.short_id = s.id
            GROUP BY r.id, r.name
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener calificaciones por sala' });
    }
});




export default router;
