import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800  py-8  mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} Saif Gifts. All rights reserved.</p>
        </footer>
    );
}