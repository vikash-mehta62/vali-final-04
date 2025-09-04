import { Product, BulkDiscount } from '@/types';

// Added this function that was missing
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const mockPriceListItems: Product[] = [
  {
    id: '1',
    name: 'Organic Apples',
    category: 'Fruits',
    quantity: 100,
    unit: 'kg',
    price: 2.99,
    description: 'Fresh organic apples from local farms',
    organic: true,
    origin: 'Local Farm',
    bulkDiscounts: [
      { minQuantity: 5, discountPercent: 5 },
      { minQuantity: 10, discountPercent: 10 }
    ],
    estimatedProfit: 25,
    popularityRank: 2,
    featuredOffer: true,
    lastUpdated: '2023-10-30',
    threshold: 20
  },
  {
    id: '2',
    name: 'Bananas',
    category: 'Fruits',
    quantity: 150,
    unit: 'kg',
    price: 1.49,
    description: 'Sweet yellow bananas',
    origin: 'Ecuador',
    bulkDiscounts: [
      { minQuantity: 5, discountPercent: 3 },
      { minQuantity: 10, discountPercent: 7 }
    ],
    estimatedProfit: 20,
    lastUpdated: '2023-10-31',
    threshold: 30
  },
  {
    id: '3',
    name: 'Carrots',
    category: 'Vegetables',
    quantity: 75,
    unit: 'kg',
    price: 1.29,
    description: 'Fresh orange carrots',
    origin: 'Local Farm',
    organic: true,
    bulkDiscounts: [
      { minQuantity: 5, discountPercent: 5 },
      { minQuantity: 10, discountPercent: 10 }
    ],
    popularityRank: 5,
    lastUpdated: '2023-11-01',
    threshold: 15
  },
  {
    id: '4',
    name: 'Premium Beef Steak',
    category: 'Meat',
    quantity: 50,
    unit: 'kg',
    price: 12.99,
    description: 'High-quality premium beef steak',
    origin: 'Grass-fed',
    bulkDiscounts: [
      { minQuantity: 5, discountPercent: 7 },
      { minQuantity: 10, discountPercent: 15 }
    ],
    estimatedProfit: 30,
    popularityRank: 1,
    featuredOffer: true,
    lastUpdated: '2023-11-02',
    threshold: 10
  },
  {
    id: '5',
    name: 'Milk',
    category: 'Dairy',
    quantity: 100,
    unit: 'liter',
    price: 1.99,
    description: 'Fresh whole milk',
    origin: 'Local Dairy',
    bulkDiscounts: [
      { minQuantity: 5, discountPercent: 5 },
      { minQuantity: 10, discountPercent: 10 }
    ],
    lastUpdated: '2023-11-03',
    threshold: 25
  },
  {
    id: '6',
    name: 'Organic Eggs',
    category: 'Dairy',
    quantity: 200,
    unit: 'dozen',
    price: 3.99,
    description: 'Free-range organic eggs',
    organic: true,
    origin: 'Local Farm',
    bulkDiscounts: [
      { minQuantity: 5, discountPercent: 5 },
      { minQuantity: 10, discountPercent: 12 }
    ],
    estimatedProfit: 25,
    lastUpdated: '2023-11-04',
    threshold: 40
  }
];

export const calculatePotentialSavings = (product: Product, quantity: number): number => {
  if (!product.bulkDiscounts || product.bulkDiscounts.length === 0 || quantity === 0) {
    return 0;
  }
  
  const regularTotal = product.price * quantity;
  let discountedTotal = regularTotal;
  
  // Sort discounts in descending order by minQuantity
  const sortedDiscounts = [...product.bulkDiscounts].sort((a, b) => b.minQuantity - a.minQuantity);
  
  for (const discount of sortedDiscounts) {
    if (quantity >= discount.minQuantity) {
      discountedTotal = product.price * quantity * (1 - discount.discountPercent / 100);
      break;
    }
  }
  
  return regularTotal - discountedTotal;
};

export const getRecommendedQuantity = (product: Product): number => {
  if (!product.bulkDiscounts || product.bulkDiscounts.length === 0) {
    return 0;
  }
  
  // Find the most economical quantity from the bulk discounts
  let bestQuantity = 0;
  let bestValueRatio = 0;
  
  for (const discount of product.bulkDiscounts) {
    const effectivePrice = product.price * (1 - discount.discountPercent / 100);
    const valueRatio = discount.discountPercent / discount.minQuantity;
    
    if (valueRatio > bestValueRatio) {
      bestValueRatio = valueRatio;
      bestQuantity = discount.minQuantity;
    }
  }
  
  return bestQuantity;
};
