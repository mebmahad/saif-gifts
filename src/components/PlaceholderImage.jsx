import React from 'react';

export default function PlaceholderImage({ size = "medium" }) {
    const sizes = {
        small: "w-16 h-16",
        medium: "w-32 h-32",
        large: "w-48 h-48"
    };

    return (
        <div className={`${sizes[size]} bg-gray-200 rounded flex items-center justify-center`}>
            <svg className="w-1/2 h-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
    );
}