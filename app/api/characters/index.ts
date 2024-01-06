import { Character } from "@/app/utils/types";
import { ResponseError } from '@/app/utils/errors';

export const getAllCharacters = async (): Promise<Character | null> => {
    try { 
        const response = await fetch('/api/characters', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;

    } catch (error: ResponseError) {
        console.error('Get All Characters Error', error.message);
    }
    return null;
}

type GetCharactersProps = {
    pageNum?: string;
    chars?: string[];
}

export const getCharacters = async ({chars, pageNum}: GetCharactersProps): Promise<Character | null> => {
    try {
        const reqBody = chars ? { chars: chars } : { pageNum: pageNum };
        
        const response = await fetch('/api/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody)
        });
        const data = await response.json();
        return data;

    } catch (error: ResponseError) {
        console.error('Get Characters Error', error.message);
    }
    return null;
}