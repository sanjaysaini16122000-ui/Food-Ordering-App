'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth-context';
import { ShoppingBag, ChevronRight, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { ProtectedRoute } from '@/components/protected-route';

const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      id
      total
      status
      createdAt
      orderItems {
        id
        quantity
        price
      }
    }
  }
`;

const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($orderId: ID!) {
    checkoutOrder(orderId: $orderId) {
      id
      status
    }
  }
`;

export default function OrdersPage() {
  const { user } = useAuth();
  const { data, loading, refetch } = useQuery(GET_ORDERS);
  const [checkoutOrder, { loading: checkoutLoading }] = useMutation(CHECKOUT_ORDER, {
    onCompleted: () => refetch(),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="text-green-500" size={18} />;
      case 'CANCELLED': return <XCircle className="text-red-500" size={18} />;
      default: return <Clock className="text-orange-500" size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm px-4 py-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link href="/restaurants" className="mr-4 text-gray-400 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-6">
          {data?.getOrders.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No orders yet</h3>
              <Link href="/restaurants" className="text-orange-600 font-bold mt-2 inline-block">Start ordering →</Link>
            </div>
          )}

          {data?.getOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Order ID: {order.id.slice(0, 8)}</p>
                    <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {order.orderItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold mr-3">{item.quantity}x</span>
                        <span className="text-gray-700 font-medium">Selected Item</span>
                      </div>
                      <span className="font-mono font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Total Amount</p>
                    <p className="text-3xl font-black text-gray-900">${order.total.toFixed(2)}</p>
                  </div>

                  {/* Role-based action: Only Manager/Admin can checkout */}
                  {order.status === 'PENDING' && (user?.role === 'ADMIN' || user?.role === 'MANAGER') ? (
                    <button 
                      onClick={() => checkoutOrder({ variables: { orderId: order.id } })}
                      disabled={checkoutLoading}
                      className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      Checkout Order
                    </button>
                  ) : order.status === 'PENDING' && user?.role === 'MEMBER' ? (
                    <p className="text-xs text-gray-400 italic">Waiting for Manager approval</p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
