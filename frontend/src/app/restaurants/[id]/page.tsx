'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useRouter } from 'next/navigation';
import { Utensils, Plus, ShoppingBag, ArrowLeft, Star, Clock } from 'lucide-react';
import Link from 'next/link';

import { ProtectedRoute } from '@/components/protected-route';

const GET_MENU_ITEMS = gql`
  query GetMenuItems($restaurantId: ID!) {
    getMenuItems(restaurantId: $restaurantId) {
      id
      name
      price
      description
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      total
      status
    }
  }
`;

import { useCart } from '@/context/cart-context';
import { CartSheet } from '@/components/cart-sheet';
import { useState } from 'react';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, loading } = useQuery(GET_MENU_ITEMS, {
    variables: { restaurantId: id },
  });

  const { addToCart, totalPrice, totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [createOrder, { loading: orderLoading }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      router.push('/orders');
    },
  });

  const handleCheckout = async () => {
    // Implement checkout using all items in cart
    const { items } = useCart.getState(); // We'll need a better way if we don't have access to state directly
    // Wait, useCart returns state.
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const restaurantName = data?.getMenuItems[0]?.restaurant?.name || 'Selected Restaurant';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/restaurants" className="inline-flex items-center text-gray-600 hover:text-orange-600 font-medium">
            <ArrowLeft size={20} className="mr-2" />
            Back to Restaurants
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <ShoppingBag size={28} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200" 
              alt="Food"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h1 className="text-4xl font-extrabold text-white mb-2">{restaurantName}</h1>
              <div className="flex items-center text-white/90 space-x-4 text-sm">
                <span className="flex items-center"><Star size={16} className="text-yellow-400 mr-1" /> 4.8 (500+ ratings)</span>
                <span className="flex items-center"><Clock size={16} className="mr-1" /> 25-35 min</span>
                <span className="bg-orange-600 px-2 py-0.5 rounded text-xs font-bold uppercase">Popular</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <main className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Full Menu</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.getMenuItems.map((item: any) => (
              <div key={item.id} className="group flex justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description || 'Fresh ingredients prepared daily.'}</p>
                  <div className="text-xl font-black text-orange-600">
                    ₹{item.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
                     <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100" alt="Dish" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, restaurantId: id as string })}
                    className="mt-4 bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white p-2 rounded-full shadow-md transition-all active:scale-95"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Cart Sheet */}
        <CartSheet 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          onCheckout={async () => {
            // This will be handled by a dedicated checkout function
          }}
        />

        {/* Floating Cart Button */}
        {totalItems > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 hover:bg-orange-600 transition-all active:scale-95"
            >
              <ShoppingBag size={20} />
              <span className="font-bold">View Cart ({totalItems})</span>
              <span className="bg-white/20 w-px h-4 mx-2"></span>
              <span className="font-mono font-bold">₹{totalPrice.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
