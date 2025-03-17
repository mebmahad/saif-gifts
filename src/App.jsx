import Header from './components/Header';
import SidebarFilter from './components/SidebarFilter';
import ProductCard from './components/ProductCard';

// Temporary dummy data
const products = [
  { id: 1, name: "Teddy Bear", price: 999, description: "Soft and cuddly teddy bear" },
  { id: 2, name: "Photo Frame", price: 499, description: "Elegant wooden photo frame" },
  // Add more dummy products here...
];

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <SidebarFilter />
        <main className="flex-1 p-8">
          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}