import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.json({ message: '¡Hola desde Express!' });
});

export default router;
