import { Episode } from "@/app/utils/types";

export const getEpisodes = async (): Promise<Episode | null> => {
    try {
        const response = await fetch('/api/episodes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Get Episodes Error', error);
    }
    return null;
}