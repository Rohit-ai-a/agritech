import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import InspectionModal from '../components/InspectionModal';
import LogisticsModal from '../components/LogisticsModal';
import TradeDetailsModal from '../components/TradeDetailsModal';
import RatingModal from '../components/RatingModal';
import { motion } from 'framer-motion';

const TradeListPage = () => {
    const { user } = useAuth();
    const [myTrades, setMyTrades] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [selectedTradeId, setSelectedTradeId] = useState(null);
    const [showInspectionModal, setShowInspectionModal] = useState(false);
    const [showLogisticsModal, setShowLogisticsModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [user.role]);

    const fetchData = async () => {
        try {
            if (user.role === 'INSPECTOR') {
                const inspRes = await api.get('/trust/my-inspections');
                setInspections(inspRes.data);
            } else {
                const tradesRes = await api.get('/trades/my-trades');
                setMyTrades(tradesRes.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            case 'DISPUTED': return 'warning';
            case 'AVAILABLE': return 'success';
            case 'SOLD': return 'neutral';
            default: return 'info';
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">
                            {user.role === 'INSPECTOR' ? 'Inspections' : 'My Trades'}
                        </h1>
                        <p className="text-secondary-500 mt-1">
                            Manage your {user.role === 'INSPECTOR' ? 'assigned inspections' : 'ongoing and past trades'}
                        </p>
                    </div>
                </div>

                {/* Inspector View */}
                {user.role === 'INSPECTOR' && (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-secondary-500 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="p-4">Trade ID</th>
                                        <th className="p-4">Inspector</th>
                                        <th className="p-4">Result</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {inspections.length > 0 ? (
                                        inspections.map(insp => (
                                            <tr key={insp.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-mono text-xs">{insp.tradeId}</td>
                                                <td className="p-4">{insp.inspectorName}</td>
                                                <td className="p-4">
                                                    {insp.assignmentStatus === 'REQUESTED' ? (
                                                        <Badge variant="info">Request Received</Badge>
                                                    ) : (
                                                        <Badge variant={insp.result === 'PENDING' ? 'warning' : 'success'}>{insp.result}</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {insp.assignmentStatus === 'REQUESTED' ? (
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="success" onClick={async () => { 
                                                                await api.post(`/trust/inspection/${insp.id}/respond?accept=true`); 
                                                                fetchData(); 
                                                            }}>Accept</Button>
                                                            <Button size="sm" variant="destructive" onClick={async () => { 
                                                                await api.post(`/trust/inspection/${insp.id}/respond?accept=false`); 
                                                                fetchData(); 
                                                            }}>Decline</Button>
                                                        </div>
                                                    ) : insp.result === 'PENDING' ? (
                                                        <Button size="sm" onClick={() => { setSelectedTradeId(insp.tradeId); setShowInspectionModal(true); }}>Inspect</Button>
                                                    ) : (
                                                        <Button variant="outline" size="sm" onClick={() => { setSelectedTradeId(insp.tradeId); setShowLogisticsModal(true); }}>Logistics</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-400">No inspections assigned.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Farmer/Buyer View */}
                {(user.role === 'FARMER' || user.role === 'BUYER') && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-secondary-500 uppercase text-xs font-bold">
                                        <tr>
                                            <th className="p-4">Crop</th>
                                            <th className="p-4">Party</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {myTrades.length > 0 ? (
                                            myTrades.map(trade => (
                                                <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-4 font-medium">{trade.cropName}</td>
                                                    <td className="p-4 text-sm text-secondary-600">{user.role === 'FARMER' ? trade.buyerName : trade.farmerName}</td>
                                                    <td className="p-4 font-mono">₹{trade.finalPrice}</td>
                                                    <td className="p-4"><Badge variant={getStatusVariant(trade.status)}>{trade.status}</Badge></td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2">
                                                            {user.role === 'FARMER' && trade.status === 'REQUESTED' && (
                                                                <>
                                                                    <Button size="sm" variant="success" onClick={async () => { await api.patch(`/trades/${trade.id}/status?status=AGREED`); fetchData(); }}>Accept</Button>
                                                                    <Button size="sm" variant="destructive" onClick={async () => { await api.patch(`/trades/${trade.id}/status?status=CANCELLED`); fetchData(); }}>Decline</Button>
                                                                </>
                                                            )}
                                                            {['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(trade.status) && (
                                                                <Button size="sm" variant="outline" onClick={() => { setSelectedTradeId(trade.id); setShowLogisticsModal(true); }}>Track</Button>
                                                            )}
                                                            <Button size="sm" variant="ghost" onClick={() => { setSelectedTradeId(trade.id); setShowDetailsModal(true); }}>Timeline</Button>
                                                            {trade.status === 'COMPLETED' && (
                                                                <Button size="sm" variant="secondary" onClick={() => { setSelectedTradeId(trade.id); setShowRatingModal(true); }}>Rate</Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-gray-400">No trades found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Modals */}
                {showInspectionModal && <InspectionModal tradeId={selectedTradeId} onClose={() => setShowInspectionModal(false)} onSuccess={fetchData} />}
                {showLogisticsModal && <LogisticsModal tradeId={selectedTradeId} userRole={user.role} onClose={() => setShowLogisticsModal(false)} />}
                {showDetailsModal && <TradeDetailsModal tradeId={selectedTradeId} onClose={() => setShowDetailsModal(false)} />}
                {showRatingModal && <RatingModal tradeId={selectedTradeId} onClose={() => setShowRatingModal(false)} onSuccess={fetchData} />}
            </div>
        </Layout>
    );
};

export default TradeListPage;
