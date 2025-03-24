import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">About Us</h3>
                        <p className="text-gray-300">
                            We specialize in creating memorable moments through thoughtfully curated gifts for all occasions.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="/" className="hover:text-white">Home</a></li>
                            <li><a href="/products" className="hover:text-white">Products</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>Email: info@saifgifts.com</li>
                            <li>Phone: +1 234 567 890</li>
                            <li>Address: 123 Gift Street, City</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} Saif Gifts. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}