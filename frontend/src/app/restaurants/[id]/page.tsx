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

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, loading } = useQuery(GET_MENU_ITEMS, {
    variables: { restaurantId: id },
  });

  const [createOrder, { loading: orderLoading }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      router.push('/orders');
    },
  });

  const handleAddToCart = async (itemId: string) => {
    // Simple direct ordering for demonstration as per prompt "create order"
    // Usually we would use a local cart state first
    try {
      await createOrder({
        variables: {
          input: {
            items: [{ menuItemId: itemId, quantity: 1 }]
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/restaurants" className="inline-flex items-center text-gray-600 hover:text-orange-600 font-medium">
          <ArrowLeft size={20} className="mr-2" />
          Back to Restaurants
        </Link>
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
            <h1 className="text-4xl font-extrabold text-white mb-2">Selected Restaurant</h1>
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
          <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
            <button className="px-4 py-1.5 rounded-md bg-white shadow-sm text-sm font-bold">Recommended</button>
            <button className="px-4 py-1.5 rounded-md text-gray-500 text-sm font-medium">Starters</button>
            <button className="px-4 py-1.5 rounded-md text-gray-500 text-sm font-medium">Mains</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.getMenuItems.map((item: any) => (
            <div key={item.id} className="group flex justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all">
              <div className="flex-1 pr-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description || 'Fresh ingredients prepared daily.'}</p>
                <div className="text-xl font-black text-orange-600">
                  {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
                   <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100" alt="Dish" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={() => handleAddToCart(item.id)}
                  disabled={orderLoading}
                  className="mt-4 bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white p-2 rounded-full shadow-md transition-all active:scale-95"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart (Simplified) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
        <Link href="/cart" className="bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 hover:bg-orange-600 transition-all active:scale-95">
          <ShoppingBag size={20} />
          <span className="font-bold">View Your Order</span>
          <span className="bg-white/20 w-px h-4 mx-2"></span>
          <span className="font-mono">$0.00</span>
        </Link>
      </div>
    </div>
    </ProtectedRoute>
  );
}
