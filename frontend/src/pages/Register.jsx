import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Sprout } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'FARMER',
        state: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            alert('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left: Branding / Image */}
            <div className="hidden lg:flex w-1/3 bg-primary-800 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90" />
                <img
                    src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Farmland"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="relative z-10 text-white p-12">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-6">
                        <Sprout size={24} />
                    </div>
                    <h2 className="text-4xl font-bold mb-4 font-display">Join the Network</h2>
                    <p className="text-primary-100">Connect with thousands of verified farmers and buyers today.</p>
                </div>
            </div>

            {/* Right: Register Form */}
            <div className="w-full lg:w-2/3 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-secondary-900">Create an Account</h2>
                        <p className="text-secondary-500">Start trading securely in minutes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <div className="w-full">
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5 ml-1">Role</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="FARMER">Farmer</option>
                                    <option value="BUYER">Buyer/Middleman</option>
                                    <option value="INSPECTOR">Inspector</option>
                                </select>
                            </div>
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Input
                            label="State / Region"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="e.g. Punjab"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <p className="mt-6 text-sm text-center text-secondary-600">
                        Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
