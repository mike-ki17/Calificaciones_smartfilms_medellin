import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /shorts -> traer todos los títulos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, title, director, room_id FROM shorts');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los shorts' });
    }
});


// PUT /shorts/:id -> actualizar un short por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, director, description, room_id } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE shorts SET title = ?, director = ?, description = ?, room_id = ? WHERE id = ?',
            [title, director, description, room_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Short no encontrado' });
        }

        res.json({ message: 'Short actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el short' });
    }
});

router.get('/scores', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                s.id AS short_id,
                s.title,
                s.director,
                s.description,
                s.room_id,
                AVG(r.rating) AS average_rating,
                COUNT(r.id) AS total_ratings
            FROM shorts s
            LEFT JOIN ratings r ON r.short_id = s.id
            GROUP BY s.id, s.title, s.director, s.description, s.room_id
            ORDER BY average_rating DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener puntuaciones de shorts' });
    }
});

// Total pendientes
router.get('/pending/total', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(*) AS total_pending
            FROM shorts s
            LEFT JOIN ratings r ON r.short_id = s.id
            WHERE r.id IS NULL
        `);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener shorts pendientes' });
    }
});


// Pendientes por sala
router.get('/pending/by-room', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                rm.id AS room_id,
                rm.name AS room_name,
                COUNT(s.id) AS pending_count
            FROM rooms rm
            LEFT JOIN shorts s ON s.room_id = rm.id
            LEFT JOIN ratings r ON r.short_id = s.id
            WHERE r.id IS NULL
            GROUP BY rm.id, rm.name
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener pendientes por sala' });
    }
});
export default router;
