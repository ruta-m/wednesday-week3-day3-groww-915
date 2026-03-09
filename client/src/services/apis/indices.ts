import axios from 'axios';
import { BASE_URL, getAuthHeaders } from './config';

export const getIndicesConfig = async () => {
    const token = localStorage.getItem('bearer_token');
    if (!token) throw new Error("No bearer token found");

    try {
        const response = await axios.get(
            `${BASE_URL}/v1/middleware-bff/profile/indices-ordering`, 
            { headers: getAuthHeaders(token) }
        );
        // Returns the object containing the "indices" array
        return response.data;
    } catch (error: any) {
        console.error("Indices API Error:", error.message);
        throw error;
    }
};