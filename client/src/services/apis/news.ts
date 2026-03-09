import axios from 'axios';
import { BASE_URL, getAuthHeaders } from './config';

export const getMarketNews = async () => {
    const token = localStorage.getItem('bearer_token') ?? "";
    try {
        const response = await axios.get(`${BASE_URL}/v1/api/stocks/news?top=10&skip=0`, { 
            headers: { ...getAuthHeaders(token), 'source': 'web' } 
        });
        return response.data; 
    } catch (error) {
        throw error;
    }
};