import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft, HandCoins } from 'lucide-react';
import { motion } from 'framer-motion';

const TradePage = () => {
    const { cropId } = useParams();
    const navigate = useNavigate();
    const [offerPrice, setOfferPrice] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInitiate = async () => {
        if (!offerPrice) return;
        setIsLoading(true);
        try {
            await api.post('/trades', {
                cropId: cropId,
                offerPrice: parseFloat(offerPrice)
            });
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to initiate trade');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto pt-10">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent hover:text-primary-600"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} className="mr-2" /> Back to Marketplace
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <HandCoins size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-secondary-900">Make an Offer</h2>
                                <p className="text-secondary-500 text-sm">Negotiate the best price for this crop.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-sm text-secondary-500 mb-1">Listing ID</p>
                                <p className="font-mono text-secondary-900 font-medium">{cropId}</p>
                            </div>

                            <Input
                                label="Your Offer Price (₹)"
                                type="number"
                                placeholder="e.g. 5000"
                                value={offerPrice}
                                onChange={e => setOfferPrice(e.target.value)}
                                min="0"
                            />

                            <div className="pt-4">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleInitiate}
                                    disabled={isLoading || !offerPrice}
                                >
                                    {isLoading ? 'Sending Offer...' : 'Send Offer'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </Layout>
    );
};

export default TradePage;
