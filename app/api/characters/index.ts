import { CharData, Character } from "@/app/utils/types";


export const getAllCharacters = async (): Promise<CharData | null> => {
    try { 
        const response = await fetch('/api/characters', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Get All Characters Error', error);
    }
    return null;
}


export const getCharData = async ({pageNum}: {pageNum: string}): Promise<CharData  | null> => {
    try {
        const response = await fetch('/api/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pageNum: pageNum })
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Get Characters Error', error);
    }
    return null;
}

export const getCharacters = async ({chars}: {chars: string[]}): Promise<Character | null> => {
    try {
        
        const response = await fetch('/api/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chars: chars })
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Get Characters Error', error);
    }
    return null;
}