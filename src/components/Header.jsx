export default function Header() {
    return (
      <header className="bg-gift-primary text-white p-4 flex justify-between items-center shadow-lg">
        {/* Logo/Brand */}
        <h1 className="text-2xl font-bold">Saif Gifts 🎁</h1>
  
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <input
            type="text"
            placeholder="Search gifts..."
            className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gift-secondary"
          />
        </div>
  
        {/* Login/Signup Buttons */}
        <div className="flex gap-4">
          <button className="bg-gift-secondary px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Login
          </button>
          <button className="bg-white text-gift-primary px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Sign Up
          </button>
        </div>
      </header>
    );
  }