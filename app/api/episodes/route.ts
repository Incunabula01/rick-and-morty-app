import { ResponseError } from "@/app/utils/errors";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse>  {
    try {
        const response = await fetch('https://rickandmortyapi.com/api/episode');
        const data = await response.json();
        if (!data) {
            return NextResponse.json({ message: "No Data available" }, { status: 404 });
        }
        return NextResponse.json({ message: "Query Successful!", data }, { status: 200 });
    } catch (error: ResponseError) {
        console.error('Error:', error);
        return NextResponse.json({ message: `Unexpected error occured! ${error.message}` }, { status: 500 });
    }
}

