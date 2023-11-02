import { ResponseError } from '@/app/utils/errors';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character`);
        const data = await response.json();

        if (!data) {
            return NextResponse.json({ message: "No Data available" }, { status: 404 });
        }
        return NextResponse.json({ message: "Query Successful!", data }, { status: 200 });

    } catch (error: ResponseError) {
        console.error('Error:', error);
        return NextResponse.json({ message: `Unexpected error occured! ${error.message}` }, { status: 500 });
    }
};

export async function POST(req: Request): Promise<NextResponse> {
    try {        
        const {chars} = await req.json();

        if (!chars) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 422 });
        }
        
        const response = await fetch(`https://rickandmortyapi.com/api/character/${chars}`);
        const resJSON = await response.json();
        const data = { results: resJSON };

        if (!data) {
            return NextResponse.json({ message: "No Data available" }, { status: 404 });
        }
        return NextResponse.json({ message: "Query Successful!", data }, { status: 200 });
        
    } catch (error: ResponseError) {
        console.error('Error:', error);
        return NextResponse.json({ message: `Unexpected error occured! ${error.message}` }, { status: 500 });
    }
};
