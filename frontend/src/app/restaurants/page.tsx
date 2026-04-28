'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/auth-context';
import { Utensils, MapPin, Search, LogOut, ShoppingCart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { ProtectedRoute } from '@/components/protected-route';

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    getRestaurants {
      id
      name
      description
      country
    }
  }
`;

import { useCart } from '@/context/cart-context';
import { CartSheet } from '@/components/cart-sheet';
import { useState } from 'react';

export default function RestaurantsPage() {
  const { user, logout } = useAuth();
  const { data, loading, error } = useQuery(GET_RESTAURANTS);
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-orange-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/restaurants" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Utensils size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">FoodFlow</h1>
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3 bg-gray-800/80 px-4 py-2 rounded-full border border-gray-700/50 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-bold text-gray-100">{user?.name}</p>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{user?.role} • {user?.country}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center bg-gray-800/80 px-2 py-1.5 rounded-full border border-gray-700/50 shadow-sm space-x-1">
              <Link 
                href="/orders" 
                className="p-2 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded-full transition-colors relative"
                title="My Orders"
              >
                <ShoppingBag size={20} strokeWidth={2.5} />
              </Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded-full transition-colors"
                title="Cart"
              >
                <ShoppingCart size={20} strokeWidth={2.5} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm border-2 border-gray-800">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <div className="w-px h-5 bg-gray-700 mx-1"></div>
              
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000" 
            alt="Delicious food background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">
            Delicious food in <span className="text-orange-500">{user?.country}</span>
          </h2>
          <p className="text-gray-200 text-xl md:text-2xl font-medium max-w-2xl mx-auto drop-shadow-md">
            Order from the best local restaurants near you
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-2xl font-bold text-gray-900">Available Restaurants</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search restaurants..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none w-full md:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.getRestaurants.map((restaurant: any) => (
            <Link 
              key={restaurant.id} 
              href={`/restaurants/${restaurant.id}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400`} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center shadow-sm">
                  <MapPin size={12} className="mr-1 text-orange-600" />
                  {restaurant.country}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{restaurant.name}</h4>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{restaurant.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-sm font-medium text-orange-600">
                  View Menu 
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Cart Sheet */}
      <CartSheet 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => {}} 
      />
    </div>
    </ProtectedRoute>
  );
}
