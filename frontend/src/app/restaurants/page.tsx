'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/auth-context';
import { Utensils, MapPin, Search, LogOut, ShoppingCart } from 'lucide-react';
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
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-orange-600 p-2 rounded-lg text-white">
              <Utensils size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FoodFlow</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{user?.role} • {user?.country}</p>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              onClick={logout}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">Delicious food in {user?.country}</h2>
          <p className="text-orange-100 text-lg">Order from the best local restaurants near you</p>
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
