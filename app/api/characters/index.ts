import { Character } from "@/app/utils/types";

export const getAllCharacters = async (): Promise<Character | null> => {
    try {

        const response = await fetch('/api/characters', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Get All Episodes Error', error);
    }
    return null;
}

export const getCharacters = async (charReq: { chars: string[] }): Promise<Character | null> => {
    try {
        console.log('getCharacters', charReq);
        
        const response = await fetch('/api/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(charReq)
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Get Episodes Error', error);
    }
    return null;
}