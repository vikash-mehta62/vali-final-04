
import { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: '1',
    _id: '1',
    orderId: 'ORD-2023-001',
    date: '2023-10-15',
    items: [
      {
        product: '1',
        name: 'Organic Apples',
        quantity: 10,
        price: 2.99,
        discountedPrice: 2.69
      },
      {
        product: '3',
        name: 'Carrots',
        quantity: 5,
        price: 1.29,
        discountedPrice: 1.23
      }
    ],
    status: 'delivered',
    paymentStatus: 'paid',
    subtotal: 32.55,
    total: 32.55
  },
  {
    id: '2',
    _id: '2',
    orderId: 'ORD-2023-002',
    date: '2023-10-20',
    items: [
      {
        product: '4',
        name: 'Premium Beef Steak',
        quantity: 2,
        price: 12.99
      },
      {
        product: '5',
        name: 'Milk',
        quantity: 3,
        price: 1.99
      }
    ],
    status: 'processing',
    paymentStatus: 'paid',
    subtotal: 31.95,
    total: 31.95
  },
  {
    id: '3',
    _id: '3',
    orderId: 'ORD-2023-003',
    date: '2023-10-25',
    items: [
      {
        product: '2',
        name: 'Bananas',
        quantity: 15,
        price: 1.49,
        discountedPrice: 1.39
      },
      {
        product: '6',
        name: 'Organic Eggs',
        quantity: 5,
        price: 3.99,
        discountedPrice: 3.79
      }
    ],
    status: 'shipped',
    paymentStatus: 'paid',
    subtotal: 40.80,
    total: 40.80
  },
  {
    id: '4',
    _id: '4',
    orderId: 'ORD-2023-004',
    date: '2023-11-01',
    items: [
      {
        product: '1',
        name: 'Organic Apples',
        quantity: 3,
        price: 2.99
      },
      {
        product: '3',
        name: 'Carrots',
        quantity: 2,
        price: 1.29
      }
    ],
    status: 'pending',
    paymentStatus: 'pending',
    subtotal: 11.55,
    total: 11.55
  }
];
