import axios from 'axios';
import { API_URL } from '../Utils';

const mAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'X-CSRF-TOKEN': '5cMbMzQRqtMT3wsyp07G9e98g8dzI66h6KRLspEv',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers':
      'X-Requested-With, content-type, Authorization',
  },
});

export default mAxios;
