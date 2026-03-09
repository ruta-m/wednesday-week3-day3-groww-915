import axios from 'axios';
import { BASE_URL, getAuthHeaders } from './config';

export const getWatchlistScrips = async () => {
    // Handling the potential null token as a string
    const token = localStorage.getItem('bearer_token') ?? "";
    if (!token) throw new Error("No bearer token found");

    try {
        // We use GET or POST based on your successful hit
        // Added 'source' to headers to fix the "source key missing" error
        const response = await axios.get(
            `${BASE_URL}/v1/api/watchlist/scrips/list`, 
            { 
                headers: {
                    ...getAuthHeaders(token),
                    'source': 'web' 
                } 
            }
        );
        
        // This returns the object containing userDefinedWatchlists and predefinedWatchlists
        return response.data;
    } catch (error: any) {
        console.error("Watchlist API Error:", error.response?.status || error.message);
        throw error;
    }
};