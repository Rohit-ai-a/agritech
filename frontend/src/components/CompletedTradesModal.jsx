import React from 'react';
import { X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from './ui/Badge';

const CompletedTradesModal = ({ trades, role, onClose }) => {
    // Filter only completed trades
    const completedTrades = trades.filter(trade => trade.status === 'COMPLETED');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[80vh] flex flex-col"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-secondary-900">Completed Trades</h3>
                                <p className="text-secondary-500 text-sm">{completedTrades.length} successful transactions</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                        {completedTrades.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 font-medium text-gray-500 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Crop</th>
                                        <th className="p-4">{role === 'FARMER' ? 'Buyer' : 'Farmer'}</th>
                                        <th className="p-4 text-right">Final Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {completedTrades.map((trade) => (
                                        <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-gray-500">
                                                {trade.createdAt ? new Date(trade.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="p-4 font-medium text-secondary-900">{trade.cropName}</td>
                                            <td className="p-4 text-secondary-600">
                                                {role === 'FARMER' ? trade.buyerName : trade.farmerName}
                                            </td>
                                            <td className="p-4 text-right font-mono font-medium">₹{trade.finalPrice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-4">
                                <BriefcaseCheck size={48} className="text-gray-200" />
                                <p>No completed trades yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CompletedTradesModal;
