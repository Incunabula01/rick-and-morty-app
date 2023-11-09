import { PageProps } from '@/.next/types/app/page';
import React from 'react';

export default function Loading(props: PageProps) {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center bg-rmGreen bg-opacity-50 z-50" >
                <div className="animate-spin rounded-full h-16 w-16 border-t-5 border-rmPink" > </div>
            </div>
        </div>  
    );
}
