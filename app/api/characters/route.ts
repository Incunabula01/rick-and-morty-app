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
    } catch (error) {
        if(error instanceof ResponseError){
            return NextResponse.json({ message: `${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ message: `Unexpected error occured! ${error}`}, { status: 500 });
    }
};

export async function POST(req: Request): Promise<NextResponse> {
    try {
        
        const {pageNum, chars} = await req.json();
        
        const queryString = pageNum ? `https://rickandmortyapi.com/api/character/?page=${pageNum}` : `https://rickandmortyapi.com/api/character/${chars}`;
        
        const response = await fetch(queryString);
        const data = await response.json();

        if (!data) {
            return NextResponse.json({ message: "No Data available" }, { status: 404 });
        }
        return NextResponse.json({ message: "Query Successful!", data }, { status: 200 });
        
     } catch (error) {
        if(error instanceof ResponseError){
            return NextResponse.json({ message: `${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ message: `Unexpected error occured! ${error}`}, { status: 500 });
    }
};
