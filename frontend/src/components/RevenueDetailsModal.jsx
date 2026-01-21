import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const RevenueDetailsModal = ({ trades, role, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTrades, setFilteredTrades] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        // Initial load: show all completed trades
        filterTrades();
    }, [trades]);

    const filterTrades = () => {
        let filtered = trades.filter(t => t.status === 'COMPLETED');

        if (startDate) {
            filtered = filtered.filter(t => new Date(t.createdAt) >= new Date(startDate));
        }

        if (endDate) {
            // Add 1 day to include the end date fully
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            filtered = filtered.filter(t => new Date(t.createdAt) < end);
        }

        setFilteredTrades(filtered);
        const total = filtered.reduce((sum, t) => sum + (parseFloat(t.finalPrice) || 0), 0);
        setTotalAmount(total);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-xl font-bold text-secondary-900">
                            {role === 'FARMER' ? 'Revenue Report' : 'Spending Report'}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 item-end">
                            <Input
                                type="date"
                                label="Start Date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <Input
                                type="date"
                                label="End Date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <div className="flex items-end pb-1">
                                <Button onClick={filterTrades} className="w-full">
                                    Calculate
                                </Button>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className={`p-6 rounded-xl ${role === 'FARMER' ? 'bg-green-50 border border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === 'FARMER' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {role === 'FARMER' ? 'Total Revenue' : 'Total Spent'}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        ₹{totalAmount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Transactions List */}
                        <div className="mt-6">
                            <h4 className="font-semibold text-gray-700 mb-3">Transactions ({filteredTrades.length})</h4>
                            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 font-medium text-gray-500">
                                        <tr>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Crop</th>
                                            <th className="p-3">Party</th>
                                            <th className="p-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredTrades.length > 0 ? (
                                            filteredTrades.map((trade) => (
                                                <tr key={trade.id} className="hover:bg-gray-50">
                                                    <td className="p-3 text-gray-600">
                                                        {new Date(trade.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3 font-medium text-gray-900">{trade.cropName}</td>
                                                    <td className="p-3 text-gray-600">
                                                        {role === 'FARMER' ? trade.buyerName : trade.farmerName}
                                                    </td>
                                                    <td className="p-3 text-right font-mono font-medium">
                                                        ₹{trade.finalPrice}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="p-6 text-center text-gray-400">
                                                    No transactions found for this period.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RevenueDetailsModal;
