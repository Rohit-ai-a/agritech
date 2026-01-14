import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import InspectionModal from '../components/InspectionModal';
import LogisticsModal from '../components/LogisticsModal';
import TradeDetailsModal from '../components/TradeDetailsModal';
import RatingModal from '../components/RatingModal';
import { Sprout, Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="p-6 relative overflow-hidden">
        <div className={`absolute right-0 top-0 p-4 opacity-10 text-${color}-500`}>
            <Icon size={64} />
        </div>
        <div className="relative z-10">
            <h3 className="text-secondary-500 text-sm font-bold uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold mt-2 text-secondary-900">{value}</p>
        </div>
        <div className={`absolute bottom-0 left-0 h-1 w-full bg-${color}-500`} />
    </Card>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [crops, setCrops] = useState([]);
    const [myTrades, setMyTrades] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [selectedTradeId, setSelectedTradeId] = useState(null);
    const [showInspectionModal, setShowInspectionModal] = useState(false);
    const [showLogisticsModal, setShowLogisticsModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [reputation, setReputation] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role === 'ADMIN') {
            navigate('/admin');
            return;
        }
        fetchData();
    }, [user.role, navigate]);

    const fetchData = async () => {
        try {
            if (user.role === 'FARMER') {
                const res = await api.get('/crops/my-listings');
                setCrops(res.data);
            } else if (user.role === 'BUYER') {
                const res = await api.get('/crops');
                setCrops(res.data);
            }

            if (user.role === 'INSPECTOR') {
                const inspRes = await api.get('/trust/my-inspections');
                setInspections(inspRes.data);
            } else {
                const tradesRes = await api.get('/trades/my-trades');
                setMyTrades(tradesRes.data);
            }

            if (user.role !== 'ADMIN') {
                const repRes = await api.get(`/ratings/user/${user.id}/average`);
                setReputation(repRes.data || 0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyKYC = async () => {
        try {
            alert('KYC verification initiated. Please check your email for further instructions.');
        } catch (err) {
            alert('KYC verification failed to initiate.');
        }
    };

    const handleBuyNow = async (cropId, price) => {
        if (!window.confirm(`Buy this crop for ₹${price}?`)) return;
        try {
            await api.post('/trades', {
                cropId: cropId,
                offerPrice: price
            });
            alert('Trade request sent successfully!');
            fetchData();
        } catch (err) {
            alert('Failed to buy crop');
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
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
                        <p className="text-secondary-500 mt-1">Manage your {user.role.toLowerCase()} activities</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            {!user.kycStatus && (
                                <Badge variant="warning" className="cursor-pointer" onClick={handleVerifyKYC}>
                                    Unverified Identity
                                </Badge>
                            )}
                            {user.kycStatus && <Badge variant="success">Verified Identity</Badge>}
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold uppercase text-secondary-400">Reputation</span>
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-500 font-bold text-lg">★</span>
                                <span className="text-secondary-900 font-bold">{reputation.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Farmer View */}
                {user.role === 'FARMER' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Active Listings"
                                value={crops.filter(c => c.status === 'AVAILABLE').length}
                                icon={Sprout}
                                color="green"
                            />
                            <StatCard
                                title="Total Trades"
                                value={myTrades.length}
                                icon={Briefcase}
                                color="blue"
                            />
                            <StatCard
                                title="Revenue (Est)"
                                value={`₹${myTrades.reduce((acc, t) => acc + (t.status === 'COMPLETED' ? t.finalPrice : 0), 0)}`}
                                icon={TrendingUp}
                                color="purple"
                            />
                        </div>

                        {/* Listings */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-secondary-800">My Listings</h2>
                                <Button onClick={() => navigate('/add-crop')}>+ Post New Crop</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {crops.map(crop => (
                                    <Card key={crop.id} className="group">
                                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                                            {crop.imageUrl ? (
                                                <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Sprout size={48} />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <Badge variant={getStatusVariant(crop.status)}>{crop.status}</Badge>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg text-secondary-900">{crop.name}</h3>
                                            <p className="text-secondary-600 mt-1">{crop.quantity} kg @ ₹{crop.pricePerUnit}/unit</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Buyer View */}
                {user.role === 'BUYER' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <h2 className="text-xl font-bold text-secondary-800">Marketplace</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {crops.map(crop => (
                                <Card key={crop.id} className="flex flex-col h-full group">
                                    <div className="h-48 overflow-hidden bg-gray-100 relative">
                                        {crop.imageUrl ? (
                                            <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Sprout size={48} />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                            <p className="text-white font-medium">{crop.farmerName}</p>
                                            <p className="text-white/80 text-xs">{crop.locationState}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-secondary-900">{crop.name}</h3>
                                            <Badge variant="primary">₹{crop.pricePerUnit}</Badge>
                                        </div>
                                        <p className="text-secondary-600 text-sm mb-4">{crop.quantity} kg available</p>

                                        <div className="mt-auto flex gap-2">
                                            <Button
                                                className="flex-1"
                                                onClick={() => handleBuyNow(crop.id, crop.pricePerUnit)}
                                            >
                                                Buy Now
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => navigate(`/trade/${crop.id}`)}
                                            >
                                                Negotiate
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Inspector View (Simplified Refactor) */}
                {user.role === 'INSPECTOR' && (
                    <Card className="overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-secondary-800">Assigned Inspections</h2>
                        </div>
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
                                    {inspections.map(insp => (
                                        <tr key={insp.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-mono text-xs">{insp.tradeId}</td>
                                            <td className="p-4">{insp.inspectorName}</td>
                                            <td className="p-4"><Badge variant={insp.result === 'PENDING' ? 'warning' : 'success'}>{insp.result}</Badge></td>
                                            <td className="p-4">
                                                {insp.result === 'PENDING' ? (
                                                    <Button size="sm" onClick={() => { setSelectedTradeId(insp.tradeId); setShowInspectionModal(true); }}>Inspect</Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedTradeId(insp.tradeId); setShowLogisticsModal(true); }}>Logistics</Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Recent Trades Table */}
                {(user.role === 'FARMER' || user.role === 'BUYER') && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h2 className="text-xl font-bold text-secondary-800 mb-4">Recent Trades</h2>
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
                                        {myTrades.map(trade => (
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
                                        ))}
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

export default Dashboard;
