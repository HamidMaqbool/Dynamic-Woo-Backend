import React, { useState } from 'react';
import { useCRMStore } from '../store/useStore';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginPage: React.FC = () => {
    const { login, isLoading, notification } = useCRMStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            await login(email, password);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to your AuroParts CRM account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {notification?.type === 'error' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-rose-600 font-medium">{notification.message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-rose-300 ring-4 ring-rose-500/10' : 'border-slate-200'} rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none`}
                                placeholder="admin@auroparts.com"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-rose-500 font-medium ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.password ? 'border-rose-300 ring-4 ring-rose-500/10' : 'border-slate-200'} rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-xs text-rose-500 font-medium ml-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                        </label>
                        <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Sign In</>
                        )}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500">
                            Don't have an account? <a href="#" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Contact Admin</a>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
