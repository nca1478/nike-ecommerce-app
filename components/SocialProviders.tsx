'use client';

import { Chrome, Apple } from 'lucide-react';

export default function SocialProviders() {
    return (
        <div className="w-full space-y-3">
            <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-light-300 bg-light-100 px-4 py-3 text-body-medium font-medium text-dark-900 transition-all duration-200 hover:bg-light-200 hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 active:scale-[0.98] cursor-pointer"
            >
                <Chrome className="h-5 w-5" />
                Continue with Google
            </button>

            <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-light-300 bg-light-100 px-4 py-3 text-body-medium font-medium text-dark-900 transition-all duration-200 hover:bg-light-200 hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 active:scale-[0.98] cursor-pointer"
            >
                <Apple className="h-5 w-5" />
                Continue with Apple
            </button>
        </div>
    );
}
