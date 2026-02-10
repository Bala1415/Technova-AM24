const axios = require('axios');

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama3.1:8b';

/**
 * Query Ollama LLM with a prompt
 * @param {string} prompt - The prompt to send to Ollama
 * @param {object} options - Additional options (temperature, max_tokens, etc.)
 * @returns {Promise<string>} - The AI response
 */
async function queryOllama(prompt, options = {}) {
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: MODEL_NAME,
      prompt: prompt,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        ...options
      }
    }, {
      timeout: 30000 // 30 second timeout
    });

    return response.data.response || '';
  } catch (error) {
    console.error('Ollama API Error:', error.message);
    throw new Error(`Failed to get response from Ollama: ${error.message}`);
  }
}

/**
 * Check if Ollama is running and accessible
 * @returns {Promise<boolean>}
 */
async function checkOllamaStatus() {
  try {
    const response = await axios.get('http://localhost:11434/api/tags', {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    console.error('Ollama is not running or not accessible');
    return false;
  }
}

/**
 * Generate a chat response with context
 * @param {Array} messages - Array of {role: 'user'|'assistant', content: string}
 * @returns {Promise<string>}
 */
async function chatWithOllama(messages) {
  // Convert messages to a single prompt
  const prompt = messages.map(msg => {
    if (msg.role === 'user') {
      return `User: ${msg.content}`;
    } else {
      return `Assistant: ${msg.content}`;
    }
  }).join('\n') + '\nAssistant:';

  return await queryOllama(prompt);
}

module.exports = {
  queryOllama,
  checkOllamaStatus,
  chatWithOllama,
  OLLAMA_API_URL,
  MODEL_NAME
};
