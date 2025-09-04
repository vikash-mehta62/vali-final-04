
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  bulkDiscount?: any;
  shippinCost?: number;
  discountPercentage?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  applyBulkDiscount: (amount: number) => number;
  paletteCount: number;
  getDiscountTier: () => { tier: number; percentage: number };
  calculateOriginalTotal: () => number;
  totalSavings: number;
  savingsPercentage: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  totalItems: 0,
  applyBulkDiscount: () => 0,
  paletteCount: 0,
  getDiscountTier: () => ({ tier: 0, percentage: 0 }),
  calculateOriginalTotal: () => 0,
  totalSavings: 0,
  savingsPercentage: 0
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [paletteCount, setPaletteCount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsPercentage, setSavingsPercentage] = useState(0);

  // Calculate subtotal and total items whenever cart changes
  useEffect(() => {
    const calculatedSubtotal = cart.reduce((total, item) => {
      // Apply individual item discount if available
      let itemPrice = item.price;
      if (item.discountPercentage) {
        itemPrice = item.price * (1 - item.discountPercentage / 100);
      }
      return total + (itemPrice * item.quantity);
    }, 0);
    
    const calculatedTotalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Roughly calculate how many palettes (1 palette = 20 items)
    const calculatedPaletteCount = Math.floor(calculatedTotalItems / 20) + (calculatedTotalItems % 20 > 0 ? 1 : 0);
    
    setSubtotal(calculatedSubtotal);
    setTotalItems(calculatedTotalItems);
    setPaletteCount(calculatedPaletteCount);
    
    // Calculate total savings
    const originalTotal = calculateOriginalTotal();
    const calculatedTotalSavings = originalTotal - calculatedSubtotal;
    setTotalSavings(calculatedTotalSavings);
    
    if (originalTotal > 0) {
      setSavingsPercentage((calculatedTotalSavings / originalTotal) * 100);
    } else {
      setSavingsPercentage(0);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity } 
            : cartItem
        );
      } else {
        // Add new item
        return [...prevCart, item];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
  
    console.log(cart);
  
    let discountPercentage: number | undefined = undefined;
  
    // Pehle cart me item dhoondo
    const cartItem = cart.find(item => item.id === id);
  
    if (cartItem?.bulkDiscount?.length) {
      // Sort discounts in descending order by minQuantity
      const sortedDiscounts = [...cartItem.bulkDiscount].sort((a, b) => b.minQuantity - a.minQuantity);
  
      // Find the first applicable discount
      for (const discount of sortedDiscounts) {
        if (quantity >= discount.minQuantity) {
          discountPercentage = discount.discountPercent;
          break;
        }
      }
    }
  
    // Update cart by modifying the item's quantity and discountPercentage
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity, discountPercentage } : item
      )
    );
  };
  

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get discount tier based on total items
  const getDiscountTier = () => {
    // Tier 0: No discount (0-19 items)
    // Tier 1: 10% discount (20-39 items / 1 palette)
    // Tier 2: 15% discount (40-59 items / 2 palettes)
    // Tier 3: 25% discount (60+ items / 3+ palettes)
    
    if (totalItems >= 60) return { tier: 3, percentage: 25 };
    if (totalItems >= 40) return { tier: 2, percentage: 15 };
    if (totalItems >= 20) return { tier: 1, percentage: 10 };
    return { tier: 0, percentage: 0 };
  };

  // Apply bulk discount based on tier
  const applyBulkDiscount = (amount: number) => {
    const { percentage } = getDiscountTier();
    if (percentage === 0) return amount;
    
    return amount * (1 - percentage / 100);
  };

  // Calculate original total without any discounts
  const calculateOriginalTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
    applyBulkDiscount,
    paletteCount,
    getDiscountTier,
    calculateOriginalTotal,
    totalSavings,
    savingsPercentage
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
