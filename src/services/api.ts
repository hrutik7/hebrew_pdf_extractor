import axios from 'axios';
import { ExtractedContent } from '../types/Table';

const API_BASE_URL = 'http://localhost:5000';

export const extractTablesFromPDF = async (file: File): Promise<ExtractedContent> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/extract-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};