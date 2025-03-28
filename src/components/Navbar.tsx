import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { ShoppingCart, Menu, X, Package, Wrench } from 'lucide-react';
import { Logo } from './Logo';
import Button from './Button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items } = useCart();
  const { orders } = useOrders();
  const location = useLocation();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const pendingOrders = orders.filter(order => 
    order.status === 'pending' || 
    order.status === 'processing' || 
    order.status === 'payment_verification'
  ).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black shadow-lg py-2' : 'bg-black/90 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <Logo className="h-10 w-auto transition-transform duration-300 group-hover:scale-110" variant="dark" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-[#FFD700] transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/tools" className="text-white hover:text-[#FFD700] transition-colors flex items-center relative group">
            <Wrench className="w-4 h-4 mr-1" />
            Tools
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/orders" className="text-white hover:text-[#FFD700] transition-colors flex items-center relative group">
            <Package className="w-4 h-4 mr-1" />
            Orders
            {pendingOrders > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/basket" className="relative">
            <Button 
              variant="primary" 
              size="sm" 
              className="flex items-center gap-2"
              ariaLabel="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {totalItems > 0 && (
                <span className="bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link to="/basket" className="relative mr-4">
            <Button 
              variant="primary" 
              size="sm" 
              className="flex items-center gap-2 !py-1.5 !px-3"
              ariaLabel="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 animate-fadeIn">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-[#FFD700] transition-colors py-2 flex items-center">
                Home
                <span className="ml-auto text-gray-400">→</span>
              </Link>
              <Link to="/tools" className="text-white hover:text-[#FFD700] transition-colors py-2 flex items-center">
                <Wrench className="w-4 h-4 mr-2" />
                Tools
                <span className="ml-auto text-gray-400">→</span>
              </Link>
              <Link to="/orders" className="text-white hover:text-[#FFD700] transition-colors py-2 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Orders
                {pendingOrders > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
                <span className="ml-auto text-gray-400">→</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
