// WebFoo Mart — Data Types & Seed Data

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  password: string;
  address: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
}

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  address: string;
  phone: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  inStock: boolean;
  reviews: Review[];
}

// Keys
export const STORAGE_KEYS = {
  customers: "wfm_customers",
  orders: "wfm_orders",
  stores: "wfm_stores",
  products: "wfm_products",
  session: "wfm_session",
  cart: "wfm_cart",
  adminAuth: "wfm_admin_auth",
} as const;

// Helper functions
export function getCustomers(): Customer[] {
  const data = localStorage.getItem(STORAGE_KEYS.customers);
  return data ? (JSON.parse(data) as Customer[]) : [];
}

export function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
}

export function getOrders(): Order[] {
  const data = localStorage.getItem(STORAGE_KEYS.orders);
  return data ? (JSON.parse(data) as Order[]) : [];
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

export function getStores(): Store[] {
  const data = localStorage.getItem(STORAGE_KEYS.stores);
  return data ? (JSON.parse(data) as Store[]) : [];
}

export function saveStores(stores: Store[]): void {
  localStorage.setItem(STORAGE_KEYS.stores, JSON.stringify(stores));
}

export function getProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEYS.products);
  return data ? (JSON.parse(data) as Product[]) : [];
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

// Seed Data
const SEED_STORES: Store[] = [
  {
    id: "s1",
    name: "General Store",
    imageUrl: "https://picsum.photos/seed/general/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s2",
    name: "Flower Shop",
    imageUrl: "https://picsum.photos/seed/flower/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s3",
    name: "Chocolate Store",
    imageUrl: "https://picsum.photos/seed/chocolate/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s4",
    name: "Grocery Store",
    imageUrl: "https://picsum.photos/seed/grocery/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s5",
    name: "Vegetable Store",
    imageUrl: "https://picsum.photos/seed/vegetable/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s6",
    name: "Bakery",
    imageUrl: "https://picsum.photos/seed/bakery/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s7",
    name: "Dairy Store",
    imageUrl: "https://picsum.photos/seed/dairy/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s8",
    name: "Electronics Store",
    imageUrl: "https://picsum.photos/seed/electronics/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s9",
    name: "Clothing Store",
    imageUrl: "https://picsum.photos/seed/clothing/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s10",
    name: "Pharmacy",
    imageUrl: "https://picsum.photos/seed/pharmacy/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s11",
    name: "Stationery Store",
    imageUrl: "https://picsum.photos/seed/stationery/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "s12",
    name: "Pet Store",
    imageUrl: "https://picsum.photos/seed/petstore/400/300",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

const SEED_PRODUCTS: Product[] = [
  // General Store (s1)
  {
    id: "p_s1_1",
    storeId: "s1",
    name: "Toothpaste",
    price: 55,
    description:
      "Fresh mint fluoride toothpaste for strong teeth and fresh breath. Trusted by families for daily oral care.",
    imageUrl: "https://picsum.photos/seed/toothpaste/300/300",
    inStock: true,
    reviews: [
      {
        author: "Priya K",
        rating: 5,
        comment: "Great product, good price!",
        date: "2026-02-10",
      },
    ],
  },
  {
    id: "p_s1_2",
    storeId: "s1",
    name: "Soap Bar",
    price: 35,
    description:
      "Moisturizing soap bar with aloe vera and glycerin. Gentle on skin, perfect for daily use.",
    imageUrl: "https://picsum.photos/seed/soapbar/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s1_3",
    storeId: "s1",
    name: "Shampoo",
    price: 120,
    description:
      "Anti-dandruff shampoo with neem and tea tree extracts. Leaves hair clean and refreshed.",
    imageUrl: "https://picsum.photos/seed/shampoo/300/300",
    inStock: true,
    reviews: [
      {
        author: "Rahul M",
        rating: 4,
        comment: "Works well for oily hair.",
        date: "2026-01-20",
      },
    ],
  },
  {
    id: "p_s1_4",
    storeId: "s1",
    name: "Hand Wash",
    price: 85,
    description:
      "Antibacterial hand wash with tulsi and neem. Kills 99.9% germs and keeps hands soft.",
    imageUrl: "https://picsum.photos/seed/handwash/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s1_5",
    storeId: "s1",
    name: "Candles",
    price: 150,
    description:
      "Aromatic soy wax candles in assorted scents. Perfect for relaxation and home decor.",
    imageUrl: "https://picsum.photos/seed/candles/300/300",
    inStock: true,
    reviews: [
      {
        author: "Sneha P",
        rating: 5,
        comment: "Beautiful fragrance, burns evenly.",
        date: "2026-02-05",
      },
    ],
  },

  // Flower Shop (s2)
  {
    id: "p_s2_1",
    storeId: "s2",
    name: "Rose Bouquet",
    price: 299,
    description:
      "Fresh red roses hand-tied in a beautiful bouquet. Perfect for gifting loved ones on special occasions.",
    imageUrl: "https://picsum.photos/seed/rosebouquet/300/300",
    inStock: true,
    reviews: [
      {
        author: "Anjali S",
        rating: 5,
        comment: "So fresh and beautiful!",
        date: "2026-02-14",
      },
    ],
  },
  {
    id: "p_s2_2",
    storeId: "s2",
    name: "Sunflower Bunch",
    price: 199,
    description:
      "Bright and cheerful sunflowers arranged in a rustic bunch. Brings sunshine to any room.",
    imageUrl: "https://picsum.photos/seed/sunflowerbunch/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s2_3",
    storeId: "s2",
    name: "Orchid Plant",
    price: 499,
    description:
      "Exotic orchid plant in a decorative pot. Long-lasting blooms add elegance to any space.",
    imageUrl: "https://picsum.photos/seed/orchidplant/300/300",
    inStock: true,
    reviews: [
      {
        author: "Vikram R",
        rating: 4,
        comment: "Beautiful plant, well-packaged.",
        date: "2026-01-28",
      },
    ],
  },
  {
    id: "p_s2_4",
    storeId: "s2",
    name: "Lily Arrangement",
    price: 349,
    description:
      "Elegant white lilies arranged in a classic style. Ideal for condolences or celebrations.",
    imageUrl: "https://picsum.photos/seed/lilyarrangement/300/300",
    inStock: false,
    reviews: [],
  },

  // Chocolate Store (s3)
  {
    id: "p_s3_1",
    storeId: "s3",
    name: "Dark Chocolate Bar",
    price: 180,
    description:
      "70% cacao dark chocolate bar. Rich, intense flavor with hints of coffee and fruit.",
    imageUrl: "https://picsum.photos/seed/darkchocolate/300/300",
    inStock: true,
    reviews: [
      {
        author: "Meera N",
        rating: 5,
        comment: "Best dark chocolate I've had!",
        date: "2026-02-08",
      },
    ],
  },
  {
    id: "p_s3_2",
    storeId: "s3",
    name: "Milk Chocolate Box",
    price: 350,
    description:
      "Assorted milk chocolates in a premium gift box. Perfect for sharing with family and friends.",
    imageUrl: "https://picsum.photos/seed/milkchocolate/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s3_3",
    storeId: "s3",
    name: "Truffle Collection",
    price: 599,
    description:
      "12 handcrafted truffles in exotic flavors: sea salt caramel, raspberry, pistachio, and more.",
    imageUrl: "https://picsum.photos/seed/truffles/300/300",
    inStock: true,
    reviews: [
      {
        author: "Arjun D",
        rating: 5,
        comment: "Absolute luxury, every piece is perfect.",
        date: "2026-02-01",
      },
    ],
  },
  {
    id: "p_s3_4",
    storeId: "s3",
    name: "White Chocolate",
    price: 220,
    description:
      "Creamy Belgian white chocolate with vanilla beans. Smooth and indulgent.",
    imageUrl: "https://picsum.photos/seed/whitechocolate/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s3_5",
    storeId: "s3",
    name: "Hazelnut Spread",
    price: 280,
    description:
      "Creamy hazelnut chocolate spread. Perfect on bread, pancakes, or straight from the jar.",
    imageUrl: "https://picsum.photos/seed/hazelnutspread/300/300",
    inStock: true,
    reviews: [],
  },

  // Grocery Store (s4)
  {
    id: "p_s4_1",
    storeId: "s4",
    name: "Basmati Rice 5kg",
    price: 450,
    description:
      "Premium aged basmati rice, long grain, aromatic. Ideal for biryanis and pulao.",
    imageUrl: "https://picsum.photos/seed/basmatirice/300/300",
    inStock: true,
    reviews: [
      {
        author: "Demo User",
        rating: 4,
        comment: "Good quality rice.",
        date: "2026-01-10",
      },
    ],
  },
  {
    id: "p_s4_2",
    storeId: "s4",
    name: "Wheat Flour 10kg",
    price: 380,
    description:
      "Whole wheat atta, finely milled for soft rotis. No preservatives, 100% natural.",
    imageUrl: "https://picsum.photos/seed/wheatflour/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s4_3",
    storeId: "s4",
    name: "Mustard Oil 1L",
    price: 175,
    description:
      "Pure cold-pressed mustard oil. Rich in omega-3 fatty acids, ideal for Indian cooking.",
    imageUrl: "https://picsum.photos/seed/mustardoil/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s4_4",
    storeId: "s4",
    name: "Toor Dal 1kg",
    price: 130,
    description:
      "Split pigeon peas, clean and sorted. High in protein, cooks quickly.",
    imageUrl: "https://picsum.photos/seed/toordal/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s4_5",
    storeId: "s4",
    name: "Sugar 1kg",
    price: 50,
    description:
      "Refined white sugar, fine granules. Essential pantry staple for all sweet preparations.",
    imageUrl: "https://picsum.photos/seed/sugar/300/300",
    inStock: true,
    reviews: [],
  },

  // Vegetable Store (s5)
  {
    id: "p_s5_1",
    storeId: "s5",
    name: "Tomatoes 1kg",
    price: 40,
    description:
      "Fresh farm tomatoes, ripe and juicy. Perfect for curries, salads, and chutneys.",
    imageUrl: "https://picsum.photos/seed/tomatoes/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s5_2",
    storeId: "s5",
    name: "Potatoes 1kg",
    price: 25,
    description:
      "Fresh washed potatoes from local farms. Versatile vegetable for everyday cooking.",
    imageUrl: "https://picsum.photos/seed/potatoes/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s5_3",
    storeId: "s5",
    name: "Onions 1kg",
    price: 30,
    description:
      "Farm-fresh red onions. Essential base ingredient for all Indian dishes.",
    imageUrl: "https://picsum.photos/seed/onions/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s5_4",
    storeId: "s5",
    name: "Spinach 500g",
    price: 20,
    description:
      "Fresh tender spinach leaves. Packed with iron and vitamins, great for palak dishes.",
    imageUrl: "https://picsum.photos/seed/spinach/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s5_5",
    storeId: "s5",
    name: "Carrots 1kg",
    price: 35,
    description: "Crunchy fresh carrots, ideal for curries, salads, and halwa.",
    imageUrl: "https://picsum.photos/seed/carrots/300/300",
    inStock: true,
    reviews: [],
  },

  // Bakery (s6)
  {
    id: "p_s6_1",
    storeId: "s6",
    name: "Sourdough Bread",
    price: 120,
    description:
      "Artisan sourdough loaf with crispy crust and chewy crumb. Made with natural starter, no preservatives.",
    imageUrl: "https://picsum.photos/seed/sourdoughbread/300/300",
    inStock: true,
    reviews: [
      {
        author: "Kavita S",
        rating: 5,
        comment: "Best sourdough in the city!",
        date: "2026-02-12",
      },
    ],
  },
  {
    id: "p_s6_2",
    storeId: "s6",
    name: "Croissant",
    price: 45,
    description:
      "Buttery, flaky French croissant baked fresh every morning. Perfect with coffee.",
    imageUrl: "https://picsum.photos/seed/croissant/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s6_3",
    storeId: "s6",
    name: "Blueberry Muffin",
    price: 65,
    description:
      "Moist blueberry muffin loaded with fresh berries. A wholesome breakfast treat.",
    imageUrl: "https://picsum.photos/seed/blueberrymuffin/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s6_4",
    storeId: "s6",
    name: "Cinnamon Roll",
    price: 55,
    description:
      "Soft, pillowy cinnamon roll drizzled with cream cheese frosting. Pure comfort food.",
    imageUrl: "https://picsum.photos/seed/cinnamonroll/300/300",
    inStock: false,
    reviews: [],
  },
  {
    id: "p_s6_5",
    storeId: "s6",
    name: "Banana Bread",
    price: 95,
    description:
      "Classic banana bread with walnuts and a hint of vanilla. Moist and fragrant.",
    imageUrl: "https://picsum.photos/seed/bananabread/300/300",
    inStock: true,
    reviews: [],
  },

  // Dairy Store (s7)
  {
    id: "p_s7_1",
    storeId: "s7",
    name: "Full Cream Milk 1L",
    price: 72,
    description:
      "Farm-fresh full cream milk. Rich in calcium and protein, delivered fresh daily.",
    imageUrl: "https://picsum.photos/seed/fullcreammilk/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s7_2",
    storeId: "s7",
    name: "Paneer 200g",
    price: 90,
    description:
      "Soft and crumbly fresh paneer made from whole milk. Perfect for curries and grills.",
    imageUrl: "https://picsum.photos/seed/paneer/300/300",
    inStock: true,
    reviews: [
      {
        author: "Geeta R",
        rating: 5,
        comment: "Very fresh and soft!",
        date: "2026-02-09",
      },
    ],
  },
  {
    id: "p_s7_3",
    storeId: "s7",
    name: "Cheddar Cheese",
    price: 250,
    description:
      "Mature cheddar cheese block, sharp and flavorful. Great for sandwiches and cooking.",
    imageUrl: "https://picsum.photos/seed/cheddarcheese/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s7_4",
    storeId: "s7",
    name: "Salted Butter",
    price: 55,
    description:
      "Creamy salted butter from grass-fed cows. Adds rich flavor to any dish.",
    imageUrl: "https://picsum.photos/seed/saltedbutter/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s7_5",
    storeId: "s7",
    name: "Greek Yogurt",
    price: 80,
    description:
      "Thick and creamy Greek yogurt, high in protein. Natural, no added sugar.",
    imageUrl: "https://picsum.photos/seed/greekyogurt/300/300",
    inStock: true,
    reviews: [],
  },

  // Electronics Store (s8)
  {
    id: "p_s8_1",
    storeId: "s8",
    name: "USB-C Cable",
    price: 299,
    description:
      "Braided USB-C to USB-C cable, 2m length. Supports 100W fast charging and data transfer.",
    imageUrl: "https://picsum.photos/seed/usbccable/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s8_2",
    storeId: "s8",
    name: "Wireless Mouse",
    price: 599,
    description:
      "Ergonomic wireless mouse with 2.4GHz connectivity, 1600 DPI, 12-month battery life.",
    imageUrl: "https://picsum.photos/seed/wirelessmouse/300/300",
    inStock: true,
    reviews: [
      {
        author: "Nikhil B",
        rating: 4,
        comment: "Smooth and reliable.",
        date: "2026-01-25",
      },
    ],
  },
  {
    id: "p_s8_3",
    storeId: "s8",
    name: "Bluetooth Speaker",
    price: 1499,
    description:
      "Portable 360° speaker with 12-hour battery. IPX5 waterproof, rich bass output.",
    imageUrl: "https://picsum.photos/seed/bluetoothspeaker/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s8_4",
    storeId: "s8",
    name: "Power Bank",
    price: 899,
    description:
      "20,000 mAh power bank with dual USB-A and USB-C ports. Compact and lightweight.",
    imageUrl: "https://picsum.photos/seed/powerbank/300/300",
    inStock: false,
    reviews: [],
  },
  {
    id: "p_s8_5",
    storeId: "s8",
    name: "Phone Stand",
    price: 199,
    description:
      "Adjustable aluminum phone stand for desk use. Compatible with all phones and tablets.",
    imageUrl: "https://picsum.photos/seed/phonestand/300/300",
    inStock: true,
    reviews: [],
  },

  // Clothing Store (s9)
  {
    id: "p_s9_1",
    storeId: "s9",
    name: "Cotton T-Shirt",
    price: 399,
    description:
      "100% cotton round-neck t-shirt. Breathable, comfortable, available in multiple colors.",
    imageUrl: "https://picsum.photos/seed/cottontshirt/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s9_2",
    storeId: "s9",
    name: "Denim Jeans",
    price: 1199,
    description:
      "Classic slim-fit denim jeans. Durable stretch fabric for all-day comfort.",
    imageUrl: "https://picsum.photos/seed/denimjeans/300/300",
    inStock: true,
    reviews: [
      {
        author: "Aditya K",
        rating: 4,
        comment: "Good fit, great quality denim.",
        date: "2026-02-03",
      },
    ],
  },
  {
    id: "p_s9_3",
    storeId: "s9",
    name: "Kurti",
    price: 599,
    description:
      "Elegant floral print kurti, perfect for casual and semi-formal occasions.",
    imageUrl: "https://picsum.photos/seed/kurti/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s9_4",
    storeId: "s9",
    name: "Hoodie",
    price: 899,
    description:
      "Fleece-lined hoodie for winter comfort. Kangaroo pocket, adjustable drawstring.",
    imageUrl: "https://picsum.photos/seed/hoodie/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s9_5",
    storeId: "s9",
    name: "Track Pants",
    price: 499,
    description:
      "Cotton blend track pants with elastic waistband. Ideal for workouts and casual wear.",
    imageUrl: "https://picsum.photos/seed/trackpants/300/300",
    inStock: true,
    reviews: [],
  },

  // Pharmacy (s10)
  {
    id: "p_s10_1",
    storeId: "s10",
    name: "Paracetamol Strip",
    price: 25,
    description:
      "10 tablets of 500mg paracetamol for fever and pain relief. Trusted brand.",
    imageUrl: "https://picsum.photos/seed/paracetamol/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s10_2",
    storeId: "s10",
    name: "Vitamin C Tablets",
    price: 180,
    description:
      "60 effervescent Vitamin C tablets, 500mg each. Boosts immunity and skin health.",
    imageUrl: "https://picsum.photos/seed/vitaminc/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s10_3",
    storeId: "s10",
    name: "Band-Aid Pack",
    price: 60,
    description:
      "20 adhesive bandages in various sizes. Sterile, waterproof, skin-colored.",
    imageUrl: "https://picsum.photos/seed/bandaid/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s10_4",
    storeId: "s10",
    name: "Antiseptic Cream",
    price: 85,
    description:
      "Broad-spectrum antiseptic cream for cuts, wounds, and minor burns.",
    imageUrl: "https://picsum.photos/seed/antisepticcream/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s10_5",
    storeId: "s10",
    name: "Digital Thermometer",
    price: 350,
    description:
      "Fast-read digital thermometer with LCD display. Fever alert buzzer included.",
    imageUrl: "https://picsum.photos/seed/thermometer/300/300",
    inStock: false,
    reviews: [],
  },

  // Stationery Store (s11)
  {
    id: "p_s11_1",
    storeId: "s11",
    name: "A4 Notebook",
    price: 65,
    description:
      "200-page ruled A4 notebook with hard cover. Perfect for students and professionals.",
    imageUrl: "https://picsum.photos/seed/a4notebook/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s11_2",
    storeId: "s11",
    name: "Ball Pen Set",
    price: 45,
    description: "Pack of 10 smooth-writing ball pens in blue, black, and red.",
    imageUrl: "https://picsum.photos/seed/ballpens/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s11_3",
    storeId: "s11",
    name: "Highlighters",
    price: 120,
    description:
      "Set of 6 fluorescent highlighters in assorted colors. Chisel tip for precise marking.",
    imageUrl: "https://picsum.photos/seed/highlighters/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s11_4",
    storeId: "s11",
    name: "Sticky Notes",
    price: 55,
    description:
      "3-pack of 3x3 inch sticky notes, 100 sheets each. Residue-free adhesive.",
    imageUrl: "https://picsum.photos/seed/stickynotes/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s11_5",
    storeId: "s11",
    name: "Stapler",
    price: 150,
    description:
      "Full-strip stapler with 1000 staples included. Easy jam release mechanism.",
    imageUrl: "https://picsum.photos/seed/stapler/300/300",
    inStock: true,
    reviews: [],
  },

  // Pet Store (s12)
  {
    id: "p_s12_1",
    storeId: "s12",
    name: "Dog Food 2kg",
    price: 699,
    description:
      "Complete and balanced dry dog food for adult dogs. Rich in chicken protein.",
    imageUrl: "https://picsum.photos/seed/dogfood/300/300",
    inStock: true,
    reviews: [
      {
        author: "Ravi T",
        rating: 5,
        comment: "My dog loves it!",
        date: "2026-02-07",
      },
    ],
  },
  {
    id: "p_s12_2",
    storeId: "s12",
    name: "Cat Food 1kg",
    price: 450,
    description:
      "Nutritious dry cat food with tuna and salmon flavors. Supports shiny coat.",
    imageUrl: "https://picsum.photos/seed/catfood/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s12_3",
    storeId: "s12",
    name: "Pet Shampoo",
    price: 280,
    description:
      "Gentle tearless pet shampoo with oatmeal and aloe vera. Suitable for all breeds.",
    imageUrl: "https://picsum.photos/seed/petshampoo/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s12_4",
    storeId: "s12",
    name: "Chew Toy",
    price: 199,
    description:
      "Durable rubber chew toy for medium dogs. Dental cleaning ridges, non-toxic material.",
    imageUrl: "https://picsum.photos/seed/chewtoy/300/300",
    inStock: true,
    reviews: [],
  },
  {
    id: "p_s12_5",
    storeId: "s12",
    name: "Cat Litter 5kg",
    price: 399,
    description:
      "Clumping clay cat litter with activated carbon odor control. Low dust formula.",
    imageUrl: "https://picsum.photos/seed/catlitter/300/300",
    inStock: true,
    reviews: [],
  },
];

const SEED_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Demo User",
    mobile: "9999999999",
    password: "demo123",
    address: "123 Demo Street, Mumbai",
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: "ORD001",
    customerId: "c1",
    customerName: "Demo User",
    items: [
      {
        productId: "p_s4_1",
        name: "Basmati Rice 5kg",
        price: 450,
        qty: 2,
        imageUrl: "https://picsum.photos/seed/basmatirice/300/300",
      },
    ],
    total: 900,
    address: "123 Demo Street, Mumbai",
    phone: "9999999999",
    status: "Delivered",
    createdAt: "2026-01-15T10:30:00Z",
  },
];

export function initializeSeedData(): void {
  if (!localStorage.getItem(STORAGE_KEYS.stores)) {
    saveStores(SEED_STORES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    saveProducts(SEED_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.customers)) {
    saveCustomers(SEED_CUSTOMERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.orders)) {
    saveOrders(SEED_ORDERS);
  }
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatPrice(price: number): string {
  if (Number.isInteger(price)) return `₹${price}`;
  return `₹${price.toFixed(2)}`;
}
