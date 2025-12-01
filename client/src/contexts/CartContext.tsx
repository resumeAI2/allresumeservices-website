import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trpc } from '../lib/trpc';

interface CartItem {
  id: number;
  serviceId: number;
  quantity: number;
  service: {
    id: number;
    name: string;
    description: string | null;
    type: string;
    category: string | null;
    tier: string | null;
    price: string;
    originalPrice: string | null;
    features: string | null;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  addToCart: (serviceId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string>('');
  
  // Generate or retrieve session ID for guest users
  useEffect(() => {
    let sid = localStorage.getItem('cart_session_id');
    if (!sid) {
      sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cart_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  const { data: cartItems = [], refetch, isLoading } = trpc.services.getCartItems.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const { data: cartCount = 0, refetch: refetchCount } = trpc.services.getCartItemCount.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const addToCartMutation = trpc.services.addToCart.useMutation({
    onSuccess: () => {
      refetch();
      refetchCount();
    },
  });

  const updateQuantityMutation = trpc.services.updateCartItemQuantity.useMutation({
    onSuccess: () => {
      refetch();
      refetchCount();
    },
  });

  const removeItemMutation = trpc.services.removeFromCart.useMutation({
    onSuccess: () => {
      refetch();
      refetchCount();
    },
  });

  const addToCart = async (serviceId: number, quantity: number = 1) => {
    await addToCartMutation.mutateAsync({
      serviceId,
      quantity,
      sessionId,
    });
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
    } else {
      await updateQuantityMutation.mutateAsync({ itemId, quantity });
    }
  };

  const removeItem = async (itemId: number) => {
    await removeItemMutation.mutateAsync(itemId);
  };

  const refreshCart = async () => {
    await refetch();
    await refetchCount();
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.service.price);
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
