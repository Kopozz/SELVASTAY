import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

// GET /api/projects - Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects - Crear nuevo proyecto
router.post('/', async (req, res) => {
  try {
    const { name, description, status, start_date, end_date } = req.body;
    
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { name, description, status, start_date, end_date }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
