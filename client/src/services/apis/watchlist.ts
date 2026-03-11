import axios from 'axios';
import { BASE_URL, getAuthHeaders } from './config';

export const getWatchlistScrips = async () => {
    const token = localStorage.getItem('bearer_token') ?? "";
    if (!token) throw new Error("No bearer token found");

    try {
        const response = await axios.get(
            `${BASE_URL}/v1/api/watchlist/scrips/list`, 
            { 
                headers: {
                    ...getAuthHeaders(token),
                    'source': 'web' 
                } 
            }
        );
        
        // LOG THIS: See if the lists are inside response.data or response.data.data
        console.log("Watchlist Raw Response:", response.data);

        // Return the inner data object if it exists, otherwise the whole thing
        return response.data?.data || response.data;
    } catch (error: any) {
        console.error("Watchlist API Error:", error.response?.status || error.message);
        throw error;
    }
};