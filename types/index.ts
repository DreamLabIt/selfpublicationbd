export type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  agreed: boolean;
};
export interface LoginFormInputs extends LoginPayload {
    remember?: boolean;
}
export type FetchOptions = {
  endpoint: string;
  revalidate?: number;
  tags?: string[];
  headers?: HeadersInit;
};

// Hero Slider
export interface HeroSliderItem {
  id: number;
  image: string;
  order: number;
}

// User
export type UserRole = "admin" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

// Authentication
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Navbar
export interface NavItem {
  to: string;
  key: string;
}

// Category
export interface Category {
  id: number;
  name: string;
  name_en?: string;
  slug: string;
}

// Book
export type BookCategory = "printed" | "ebook" | string;

export interface Book {
  id: string;
  title: string;
  title_en?: string;
  author?: string;
  category: BookCategory;
  subject?: string;
  price: number;
  discount_price?: number;
  stock?: number;
  cover_image?: string;
  gallery_images?: string[];
  description?: string;
  specification?: string;
  sample_pdf_url?: string;
  sample_pdf_text?: string;
}

// Cart
export interface CartItem {
  id: string | number;
  book_id: string;
  title: string;
  price: number;
  quantity: number;
  cover_image?: string;
}

export interface CartContextType {
  items: CartItem[];
  add: (book: Book, qty?: number) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

// Blog
export interface Blog {
  id: string | number;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  author: string;
  views: number;
}

export interface Blog {
  id: string | number;
  title: string;
  cover_image: string;
  [key: string]: unknown;
}

export interface BlogItem {
  id: number;
  slug?: string;
  title: string;
  excerpt: string;
  cover_image: string;
  category: string;
  author: string;
  views: number;
}

export interface BlogCardProps {
  blog: Blog;
}

export interface ClientProps {
  initialLibraries: LibraryStore[];
  bangladeshData: Record<string, string[]>;
}
export interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface PageProp {
  params: Promise<{
    category: string;
  }>;
}

export interface BookListProps {
  category: string;
  searchParams?: { q?: string };
}

export interface Book {
  id: string;
  title: string;
  title_en?: string;
  category: string;
  price: number;
  discount_price?: number;
  stock?: number;
  cover_image?: string;
  [key: string]: unknown;
}

export interface BookCardProps {
  book: Book;
  ebookStatus?: string | null;
}
export interface PageProps {
  params: Promise<{ id: string }>;
}


export interface BookDetailsProps {
  initialBook: unknown;
  initialRelated: unknown[];
}

export interface EbookSubscription {
  book_id: number | string;
  status: string;
  [key: string]: unknown;
}

export interface GalleryProps {
  cover?: string;
  images?: string[];
}

export interface ImgWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  iconClass?: string;
}

export interface ShareButtonsProps {
  url?: string;
  title?: string;
  compact?: boolean;
}

// Job Circular
export interface JobCircular {
  id: number;
  title: string;
  organization: string;
  category?: string;
  location?: string;
  salary?: string;
  vacancy?: number | string;
  deadline: string;
}

// Winner
export interface Winner {
  id: string;
  name: string;
  image: string;
  designation: string;
  department: string;
  social_url: string;
  [key: string]: unknown;
}

export interface WinnerItem {
  id: string | number;
  name: string;
  image: string;
  designation: string;
  department: string;
  social_url: string;
}

export interface Winner {
  id: string;
  name: string;
  image: string;
  designation: string;
  department: string;
  social_url: string;
}

export interface WinnerCardProps {
  winner: Winner;
}
export interface LibraryStore {
  id: string | number;
  name: string;
  division: string;
  zilla: string;
  address: string;
  phone: string;
}

export interface FilterState {
  q: string;
  division: string;
  zilla: string;
}