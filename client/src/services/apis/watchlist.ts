import axios from 'axios';
import { BASE_URL, getAuthHeaders } from './config';

/**
 * API 7 — Get all watchlists for the user
 * URL: https://preprodapisix.omnenest.com/v1/api/watchlist/list
 */
export async function getWatchlistList(token: string) {
    if (!token) {
        throw new Error("No bearer token provided for watchlist fetch");
    }

    try {
        const response = await axios.get(
            `${BASE_URL}/v1/api/watchlist/list`, 
            {
                headers: getAuthHeaders(token)
            }
        );
        
        // Returns the array directly or from a data wrapper depending on your backend
        return response.data?.data || response.data || [];
    } catch (error: any) {
        console.error("Watchlist List API Error:", error.response?.data || error.message);
        throw error;
    }
}