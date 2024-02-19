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
    } catch (error) {
        if(error instanceof ResponseError){
            return NextResponse.json({ message: `${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ message: `Unexpected error occured! ${error}`}, { status: 500 });
    }
}

