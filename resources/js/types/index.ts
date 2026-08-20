import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
}

export interface Product {
    id: number;
    category_id: number;
    title: string;
    description: string;
    price: number | string;
    category?: Category;
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: Product;
}

export interface OrderItem {
    id: number;
    product_id: number | null;
    title: string;
    description: string;
    price: number | string;
    quantity: number;
}

export interface Order {
    id: number;
    user_id: number | null;
    total: number | string;
    status: string;
    payment_status: string;
    payment_method: string | null;
    created_at: string;
    user?: User | null;
    items?: OrderItem[];
}

export interface SharedData {
    name: string;
    auth: Auth;
    cartCount: number;
    categories: Category[];
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    is_admin?: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
