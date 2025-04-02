import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';  // Add this import
import CartPage from './pages/CartPage';
import service from './appwrite/config';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import EditProductPage from './pages/EditProductPage';
import Header from './components/Header';
import Footer from './components/Footer';
import CheckoutPage from './pages/CheckoutPage';
import InvoicePage from './pages/InvoicePage';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import AddProductPage from './pages/AddProductPage';
import ProductDetails from './pages/ProductDetails';
import POSPage from './pages/POSPage';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute, AdminRoute } from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route exact path="/" component={Home} />
                <Route path="/cart" component={CartPage} />
                <Route path="/checkout" component={CheckoutPage} />
                <Route path="/invoice" component={InvoicePage} />
                <Route path="/profile" component={Profile} />
                <Route path="/orders" component={OrderHistory} />
                <Route path="/admin/edit-product/:id" render={() => <PrivateRoute><EditProductPage /></PrivateRoute>} />
                <Route path="/admin/add-product" render={() => <PrivateRoute><AddProductPage /></PrivateRoute>} />
                <Route path="/admin/pos" render={() => <PrivateRoute><POSPage /></PrivateRoute>} />
                <Route path="/admin" render={() => <PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/product/:productId" component={ProductDetails} />
              </Switch>
            </main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;