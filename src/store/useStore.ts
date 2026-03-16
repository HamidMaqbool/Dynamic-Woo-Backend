
import { create } from 'zustand';

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
    schema: any | null;
    routes: any[] | null;
    selectedProductIds: string[];
    currentPage: number;
    itemsPerPage: number;
    totalProducts: number;
    totalPages: number;
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
    fetchSchema: () => Promise<void>;
    fetchRoutes: () => Promise<void>;
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

export const useCRMStore = create<CRMState>((set, get) => ({
    products: [],
    isLoading: false,
    sidebarData: [],
    isSidebarLoading: false,
    dashboardData: null,
    settingsData: null,
    schema: null,
    routes: null,
    selectedProductIds: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalProducts: 0,
    totalPages: 0,
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
        const { currentPage, itemsPerPage, searchQuery, filters } = get();
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                search: searchQuery,
                status: filters.status,
                parentId: filters.parentId
            });
            const response = await fetch(`/api/products?${params.toString()}`);
            const data = await response.json();
            set({ 
                products: data.products, 
                totalProducts: data.total,
                totalPages: data.totalPages,
                isLoading: false 
            });
        } catch (error) {
            console.error("Failed to fetch products", error);
            set({ isLoading: false });
        }
    },

    fetchSidebar: async () => {
        set({ isSidebarLoading: true });
        try {
            const response = await fetch('/api/sidebar');
            const data = await response.json();
            set({ sidebarData: data, isSidebarLoading: false });
        } catch (error) {
            console.error("Failed to fetch sidebar", error);
            set({ isSidebarLoading: false });
        }
    },

    fetchDashboard: async () => {
        try {
            const response = await fetch('/api/dashboard');
            const data = await response.json();
            set({ dashboardData: data });
        } catch (error) {
            console.error("Failed to fetch dashboard", error);
        }
    },

    fetchSettings: async () => {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            set({ settingsData: data });
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    },

    fetchSchema: async () => {
        try {
            const response = await fetch('/api/schema');
            const data = await response.json();
            set({ schema: data });
        } catch (error) {
            console.error("Failed to fetch schema", error);
        }
    },

    fetchRoutes: async () => {
        try {
            const response = await fetch('/api/routes');
            const data = await response.json();
            set({ routes: data });
        } catch (error) {
            console.error("Failed to fetch routes", error);
        }
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
        // Refresh products to maintain server-side consistency
        get().fetchProducts();
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
        // Refresh products to maintain server-side consistency
        get().fetchProducts();
    },
    setSelectedProductIds: (ids) => set({ selectedProductIds: ids }),
    setCurrentPage: (page) => {
        set({ currentPage: page });
        get().fetchProducts();
    },
    setItemsPerPage: (count) => {
        set({ itemsPerPage: count, currentPage: 1 });
        get().fetchProducts();
    },
    setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
        get().fetchProducts();
    },
    setFilters: (filters) => {
        set((state) => ({ 
            filters: { ...state.filters, ...filters },
            currentPage: 1 
        }));
        get().fetchProducts();
    },
    setTheme: (theme) => {
        localStorage.setItem('crm-theme', theme);
        set({ theme });
    },
    setView: (view, product = null) => set({ view, editingProduct: product }),
    setNotification: (notification) => set({ notification }),
    
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                set({ 
                    isAuthenticated: true, 
                    user: data.user,
                    isLoading: false 
                });
                return true;
            } else {
                set({ 
                    isLoading: false,
                    notification: { message: data.message || 'Login failed', type: 'error' }
                });
                return false;
            }
        } catch (error) {
            console.error("Login error", error);
            set({ 
                isLoading: false,
                notification: { message: 'An error occurred during login', type: 'error' }
            });
            return false;
        }
    },
    logout: () => set({ isAuthenticated: false, user: null, view: 'dashboard' }),
}));
