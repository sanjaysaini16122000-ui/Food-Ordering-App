'use client';

import React from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      total
      status
    }
  }
`;

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();

  const [createOrder, { loading: isCheckingOut }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      clearCart();
      onClose();
      router.push('/orders');
    },
  });

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    try {
      await createOrder({
        variables: {
          input: {
            items: items.map(item => ({
              menuItemId: item.id,
              quantity: item.quantity
            }))
          }
        }
      });
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Checkout failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between bg-orange-600 text-white">
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} />
              <h2 className="text-xl font-bold">Your Cart ({totalItems})</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-orange-700 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <ShoppingBag size={64} className="text-gray-200" />
                <p className="text-lg">Your cart is empty</p>
                <button 
                  onClick={onClose}
                  className="text-orange-600 font-medium hover:underline"
                >
                  Start adding some treats!
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t bg-gray-50 space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-gray-900 font-bold">₹{totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">Taxes and delivery fees calculated at checkout.</p>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Proceed to Checkout
                    <ShoppingBag size={20} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
