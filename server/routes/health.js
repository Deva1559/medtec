const express = require('express');
const mongoose = require('mongoose');

const healthCheckRouter = express.Router();

healthCheckRouter.get('/', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const uptime = process.uptime();
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptime: Math.floor(uptime),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

module.exports = healthCheckRouter;
