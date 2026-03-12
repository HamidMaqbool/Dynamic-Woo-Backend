
import { create } from 'zustand';

import dashboardDataJson from '../data/dashboard.json';
import settingsDataJson from '../data/settings.json';

export interface Variation {
    id: string;
    combination: string[];
    price: string;
    sku: string;
    inventory: number;
    image?: string;
    isDefault?: boolean;
}

export interface Product {
    id: string;
    image: string;
    identifier: string;
    parent_id: string;
    title: string;
    product_type: 'simple' | 'variation';
    status: 'publish' | 'draft' | 'deleted';
    created_at: string;
    variations?: {
        options: { name: string; values: string[] }[];
        variants: Variation[];
    };
    [key: string]: any;
}

interface CRMState {
    products: Product[];
    isLoading: boolean;
    sidebarData: any[];
    isSidebarLoading: boolean;
    dashboardData: any | null;
    settingsData: any | null;
    selectedProductIds: string[];
    currentPage: number;
    itemsPerPage: number;
    searchQuery: string;
    filters: {
        status: string;
        parentId: string;
    };
    theme: 'light' | 'dark' | 'red' | 'green';
    view: 'list' | 'add' | 'edit' | 'usage' | 'dashboard' | 'settings';
    editingProduct: Product | null;
    notification: { message: string, type: 'success' | 'error' } | null;
    
    // Auth
    isAuthenticated: boolean;
    user: { email: string; name: string } | null;
    
    // Actions
    fetchProducts: () => Promise<void>;
    fetchSidebar: () => Promise<void>;
    fetchDashboard: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    setProducts: (products: Product[]) => void;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => Promise<void>;
    bulkDeleteProducts: (ids: string[]) => Promise<void>;
    setSelectedProductIds: (ids: string[]) => void;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (count: number) => void;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: Partial<CRMState['filters']>) => void;
    setTheme: (theme: CRMState['theme']) => void;
    setView: (view: CRMState['view'], product?: Product | null) => void;
    setNotification: (notif: { message: string, type: 'success' | 'error' } | null) => void;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

// Initial mock data
const MOCK_PRODUCTS: Product[] = [
    {
        id: 'PRD-1000',
        image: 'https://picsum.photos/seed/p1/100/100',
        identifier: 'AURO-5000',
        parent_id: '-',
        title: 'Brake Pad Set - Front',
        product_type: 'variation',
        status: 'publish',
        created_at: '2023-10-01',
        company_name: 'AutoParts Corp',
        year: '2023',
        odo_reading: '0',
        stock_status: 'In Stock',
        price: '$45.00 - $65.00',
        email: 'sales@autoparts.com',
        model: 'X-Series',
        comments: 'Available in multiple materials',
        variations: {
            options: [
                { name: 'Material', values: ['Ceramic', 'Semi-Metallic'] },
                { name: 'Size', values: ['Standard', 'Heavy Duty'] }
            ],
            variants: [
                { id: 'v1', combination: ['Ceramic', 'Standard'], price: '45.00', sku: 'BP-CER-STD', inventory: 50, isDefault: true, image: 'https://picsum.photos/seed/v1/100/100' },
                { id: 'v2', combination: ['Ceramic', 'Heavy Duty'], price: '55.00', sku: 'BP-CER-HD', inventory: 30, image: 'https://picsum.photos/seed/v2/100/100' },
                { id: 'v3', combination: ['Semi-Metallic', 'Standard'], price: '50.00', sku: 'BP-SEM-STD', inventory: 40, image: 'https://picsum.photos/seed/v3/100/100' },
                { id: 'v4', combination: ['Semi-Metallic', 'Heavy Duty'], price: '65.00', sku: 'BP-SEM-HD', inventory: 20, image: 'https://picsum.photos/seed/v4/100/100' }
            ]
        }
    },
    ...Array.from({ length: 24 }).map((_, i) => ({
        id: `PRD-${1001 + i}`,
        image: `https://picsum.photos/seed/${i + 11}/100/100`,
        identifier: `AURO-${5001 + i}`,
        parent_id: i % 3 === 0 ? `PRD-999` : '-',
        title: `Car Part Component ${i + 2}`,
        product_type: 'simple' as 'simple' | 'variation',
        status: (i % 5 === 0 ? 'draft' : 'publish') as 'draft' | 'publish' | 'deleted',
        created_at: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        company_name: 'AutoParts Corp',
        year: '2023',
        odo_reading: '15000',
        stock_status: 'In Stock',
        price: '$120.00',
        email: 'sales@autoparts.com',
        model: 'X-Series',
        comments: 'Standard replacement part',
        gallery: [
            { id: '1', url: `https://picsum.photos/seed/${i}1/400/400` },
            { id: '2', url: `https://picsum.photos/seed/${i}2/400/400` }
        ]
    }))
];

import sidebarDataJson from '../data/sidebar.json';

export const useCRMStore = create<CRMState>((set, get) => ({
    products: [],
    isLoading: false,
    sidebarData: [],
    isSidebarLoading: false,
    dashboardData: null,
    settingsData: null,
    selectedProductIds: [],
    currentPage: 1,
    itemsPerPage: 10,
    searchQuery: '',
    filters: {
        status: 'all',
        parentId: 'all',
    },
    theme: (localStorage.getItem('crm-theme') as any) || 'light',
    view: 'dashboard',
    editingProduct: null,
    notification: null,
    isAuthenticated: false,
    user: null,

    fetchProducts: async () => {
        set({ isLoading: true });
        // Simulate AJAX delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({ products: MOCK_PRODUCTS, isLoading: false });
    },

    fetchSidebar: async () => {
        set({ isSidebarLoading: true });
        // Simulate AJAX delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ sidebarData: sidebarDataJson, isSidebarLoading: false });
    },

    fetchDashboard: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ dashboardData: dashboardDataJson });
    },

    fetchSettings: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ settingsData: settingsDataJson });
    },

    setProducts: (products) => set({ products }),
    addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
    updateProduct: (id, updatedFields) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    })),
    deleteProduct: async (id) => {
        set({ isLoading: true });
        // Dummy AJAX
        await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
        await new Promise(resolve => setTimeout(resolve, 800));
        set((state) => ({
            products: state.products.filter(p => p.id !== id),
            isLoading: false,
            notification: { message: 'Product deleted successfully', type: 'success' }
        }));
    },
    bulkDeleteProducts: async (ids) => {
        set({ isLoading: true });
        // Dummy AJAX
        await Promise.all(ids.map(id => fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' })));
        await new Promise(resolve => setTimeout(resolve, 1200));
        set((state) => ({
            products: state.products.filter(p => !ids.includes(p.id)),
            isLoading: false,
            selectedProductIds: [],
            notification: { message: `${ids.length} products deleted successfully`, type: 'success' }
        }));
    },
    setSelectedProductIds: (ids) => set({ selectedProductIds: ids }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }),
    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
    setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters },
        currentPage: 1 
    })),
    setTheme: (theme) => {
        localStorage.setItem('crm-theme', theme);
        set({ theme });
    },
    setView: (view, product = null) => set({ view, editingProduct: product }),
    setNotification: (notification) => set({ notification }),
    
    login: async (email, password) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (email && password) {
            set({ 
                isAuthenticated: true, 
                user: { email, name: email.split('@')[0] },
                isLoading: false 
            });
            return true;
        }
        set({ isLoading: false });
        return false;
    },
    logout: () => set({ isAuthenticated: false, user: null, view: 'dashboard' }),
}));
