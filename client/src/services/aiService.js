import api from './api';

export async function sendMessage(messages) {
  const response = await api.post('/ai/chat', { messages });
  return response.data.reply;
}
