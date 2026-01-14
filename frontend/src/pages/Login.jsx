import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Sprout } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            setError('Invalid credentials. Please checking your email and password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left: Branding / Image */}
            <div className="hidden lg:flex w-1/2 bg-primary-800 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90" />
                <img
                    src="https://images.unsplash.com/photo-1625246333195-098e4f738936?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Agriculture"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="relative z-10 text-white p-12 max-w-lg">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-8">
                        <Sprout size={32} />
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-bold mb-6 font-display"
                    >
                        Cultivating Trust in AgriTrade.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-primary-100"
                    >
                        The professional marketplace for connecting farmers, buyers, and inspectors with complete transparency.
                    </motion.p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-secondary-900">Welcome back</h2>
                        <p className="mt-2 text-secondary-500">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="text"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                        />

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                required
                            />
                            <div className="flex justify-end">
                                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">New to AgriTrade?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to="/register">
                            <Button variant="outline" className="w-full">
                                Create an account
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
