import React from 'react';
import { X, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from './ui/Badge';

const ActiveListingsModal = ({ crops, onClose }) => {
    // Filter only available crops just in case, though parent should likely pass filtered list or we filter here
    const availableCrops = crops.filter(crop => crop.status === 'AVAILABLE');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[80vh] flex flex-col"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Sprout size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-secondary-900">Active Listings</h3>
                                <p className="text-secondary-500 text-sm">{availableCrops.length} crops currently on the market</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                        {availableCrops.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 font-medium text-gray-500 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="p-4">Crop Name</th>
                                        <th className="p-4">Quantity</th>
                                        <th className="p-4">Price/Unit</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {availableCrops.map((crop) => (
                                        <tr key={crop.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium text-secondary-900">{crop.name}</td>
                                            <td className="p-4 text-secondary-600">{crop.quantity} kg</td>
                                            <td className="p-4 font-mono font-medium">₹{crop.pricePerUnit}</td>
                                            <td className="p-4"><Badge variant="success">AVAILABLE</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-4">
                                <Sprout size={48} className="text-gray-200" />
                                <p>You have no active listings at the moment.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ActiveListingsModal;
