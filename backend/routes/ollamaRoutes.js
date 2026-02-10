const express = require('express');
const router = express.Router();
const { queryOllama, checkOllamaStatus, chatWithOllama } = require('../utils/ollamaHelper');

// Test Ollama connection
router.get('/status', async (req, res) => {
  try {
    const isRunning = await checkOllamaStatus();
    res.json({
      success: true,
      running: isRunning,
      message: isRunning ? 'Ollama is running' : 'Ollama is not accessible'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking Ollama status',
      error: error.message
    });
  }
});

// Simple prompt endpoint
router.post('/prompt', async (req, res) => {
  try {
    const { prompt, temperature, top_p } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    const response = await queryOllama(prompt, { temperature, top_p });

    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating response',
      error: error.message
    });
  }
});

// Chat endpoint with conversation history
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }

    const response = await chatWithOllama(messages);

    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in chat',
      error: error.message
    });
  }
});

module.exports = router;
