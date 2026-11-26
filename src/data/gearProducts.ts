import { GearProduct, RecoveryOrder } from '../types';

export const INITIAL_GEAR_PRODUCTS: GearProduct[] = [
  {
    id: 'gear-lumbar-air',
    sku: 'SW-LMB-01',
    name: 'AeroSpine Dual-Chamber Lumbar Cushion',
    category: 'lumbar',
    description: 'High-density viscoelastic core with breathable mesh channels engineered to maintain a 105° lumbar lordosis curve on long drives.',
    price: 48.0,
    stock: 11,
    lowStockThreshold: 4,
    badge: 'Best Seller',
    benefits: ['Reduces L4-L5 disc load', 'Perforated airflow backing', 'Universal seat strap'],
    vehicleFit: 'Car, SUV, Truck',
    imageEmoji: '🪑'
  },
  {
    id: 'gear-cervical-cradle',
    sku: 'SW-CRV-02',
    name: 'Zero-Shear Cervical Neck Cradle',
    category: 'cervical',
    description: 'Magnetic headrest-mounted bolster supporting suboccipital decompression and eliminating forward-head chin strain.',
    price: 34.0,
    stock: 3,
    lowStockThreshold: 4,
    badge: 'Low Stock',
    benefits: ['Stops text-neck tilt', 'Cooling gel contact layer', 'Snap-release buckle'],
    vehicleFit: 'Car, Commuter Van',
    imageEmoji: '🧣'
  },
  {
    id: 'gear-wrist-gloves',
    sku: 'SW-WRS-03',
    name: 'Carpal Neutralizer Riding & Steering Grips',
    category: 'wrists',
    description: 'Gel-padded ulnar palm bridge reduces 40-70Hz handlebar vibration and median nerve compression on long rides.',
    price: 29.5,
    stock: 7,
    lowStockThreshold: 3,
    badge: 'Rider Choice',
    benefits: ['Dampens road buzz', 'Keeps wrist straight', 'Touchscreen fingertips'],
    vehicleFit: 'Motorcycle, Bicycle, Car',
    imageEmoji: '🧤'
  },
  {
    id: 'gear-sciatic-ball',
    sku: 'SW-RCV-04',
    name: 'Dual-Density Piriformis Myofascial Orb',
    category: 'recovery',
    description: 'Silicone-grip trigger-point mobility sphere calibrated for rest-stop glute, piriformis, and scapular release.',
    price: 18.0,
    stock: 2,
    lowStockThreshold: 3,
    badge: 'Restock Soon',
    benefits: ['Melts sciatic knots', 'Glovebox compact size', 'Non-slip silicone shell'],
    vehicleFit: 'All Drivers',
    imageEmoji: '🟣'
  },
  {
    id: 'gear-hydro-flask',
    sku: 'SW-HYD-05',
    name: 'Spinal Disc Electrolyte Pitstop Flask (750ml)',
    category: 'hydration',
    description: 'One-hand flip-top insulated steel flask with 90-mile hydration markers to keep intervertebral discs plump.',
    price: 26.0,
    stock: 14,
    lowStockThreshold: 4,
    badge: 'Cupholder Fit',
    benefits: ['Fits standard cupholders', 'Mile-marker sip guide', '24h cold insulation'],
    vehicleFit: 'All Cockpits',
    imageEmoji: '🧴'
  },
  {
    id: 'gear-shoulder-wrap',
    sku: 'SW-THM-06',
    name: 'USB-C Heated Upper Trap & Scapular Wrap',
    category: 'cervical',
    description: 'Portable 12V / USB-C thermal wrap with 3 heat zones for rapid rest-stop perfusion of stiff upper trapezius fibers.',
    price: 56.0,
    stock: 0,
    lowStockThreshold: 3,
    badge: 'Sold Out',
    benefits: ['3 thermal relief levels', 'Plugs into cabin USB-C', 'Auto 15-min shutoff'],
    vehicleFit: 'Car, Truck, RV',
    imageEmoji: '🔥'
  }
];

/**
 * Generate a 6-month baseline order history relative to the current date
 * so the 6-month Order Frequency chart immediately reflects realistic engagement
 * and updates live whenever new orders are placed.
 */
export function buildInitialOrders(): RecoveryOrder[] {
  const now = new Date();
  const makeDate = (monthsAgo: number, day: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    const iso = d.toISOString().split('T')[0];
    return {
      iso,
      monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    };
  };

  const d5 = makeDate(5, 12);
  const d4a = makeDate(4, 6);
  const d4b = makeDate(4, 21);
  const d3 = makeDate(3, 15);
  const d2a = makeDate(2, 4);
  const d2b = makeDate(2, 18);
  const d2c = makeDate(2, 26);
  const d1a = makeDate(1, 9);
  const d1b = makeDate(1, 22);
  const d0 = makeDate(0, Math.min(now.getDate(), 10));

  return [
    {
      id: 'ord-base-1',
      orderDate: d5.iso,
      monthKey: d5.monthKey,
      items: [{ productId: 'gear-sciatic-ball', name: 'Dual-Density Piriformis Myofascial Orb', quantity: 1, unitPrice: 18 }],
      total: 18,
      status: 'Delivered'
    },
    {
      id: 'ord-base-2',
      orderDate: d4a.iso,
      monthKey: d4a.monthKey,
      items: [{ productId: 'gear-lumbar-air', name: 'AeroSpine Dual-Chamber Lumbar Cushion', quantity: 1, unitPrice: 48 }],
      total: 48,
      status: 'Delivered'
    },
    {
      id: 'ord-base-3',
      orderDate: d4b.iso,
      monthKey: d4b.monthKey,
      items: [{ productId: 'gear-hydro-flask', name: 'Spinal Disc Electrolyte Pitstop Flask (750ml)', quantity: 1, unitPrice: 26 }],
      total: 26,
      status: 'Delivered'
    },
    {
      id: 'ord-base-4',
      orderDate: d3.iso,
      monthKey: d3.monthKey,
      items: [{ productId: 'gear-wrist-gloves', name: 'Carpal Neutralizer Riding & Steering Grips', quantity: 1, unitPrice: 29.5 }],
      total: 29.5,
      status: 'Delivered'
    },
    {
      id: 'ord-base-5',
      orderDate: d2a.iso,
      monthKey: d2a.monthKey,
      items: [{ productId: 'gear-cervical-cradle', name: 'Zero-Shear Cervical Neck Cradle', quantity: 1, unitPrice: 34 }],
      total: 34,
      status: 'Delivered'
    },
    {
      id: 'ord-base-6',
      orderDate: d2b.iso,
      monthKey: d2b.monthKey,
      items: [{ productId: 'gear-sciatic-ball', name: 'Dual-Density Piriformis Myofascial Orb', quantity: 2, unitPrice: 18 }],
      total: 36,
      status: 'Delivered'
    },
    {
      id: 'ord-base-7',
      orderDate: d2c.iso,
      monthKey: d2c.monthKey,
      items: [{ productId: 'gear-hydro-flask', name: 'Spinal Disc Electrolyte Pitstop Flask (750ml)', quantity: 1, unitPrice: 26 }],
      total: 26,
      status: 'Delivered'
    },
    {
      id: 'ord-base-8',
      orderDate: d1a.iso,
      monthKey: d1a.monthKey,
      items: [{ productId: 'gear-lumbar-air', name: 'AeroSpine Dual-Chamber Lumbar Cushion', quantity: 1, unitPrice: 48 }],
      total: 48,
      status: 'Delivered'
    },
    {
      id: 'ord-base-9',
      orderDate: d1b.iso,
      monthKey: d1b.monthKey,
      items: [{ productId: 'gear-wrist-gloves', name: 'Carpal Neutralizer Riding & Steering Grips', quantity: 1, unitPrice: 29.5 }],
      total: 29.5,
      status: 'Delivered'
    },
    {
      id: 'ord-base-10',
      orderDate: d0.iso,
      monthKey: d0.monthKey,
      items: [{ productId: 'gear-cervical-cradle', name: 'Zero-Shear Cervical Neck Cradle', quantity: 1, unitPrice: 34 }],
      total: 34,
      status: 'Shipped'
    }
  ];
}
