import { PageProps } from '@/.next/types/app/page';
import React from 'react';

export default function Loading(props: PageProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-rmGreen bg-opacity-50 z-50 rounded-[2rem]" >
            <img
                src="https://rickandmortyapi.com/api/character/avatar/66.jpeg"
                alt="Rick and Morty Loader"
                className="w-40 animate-spin rounded-full"
            />
        </div>
    );
}
