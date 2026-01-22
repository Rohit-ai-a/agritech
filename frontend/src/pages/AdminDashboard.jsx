import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input'; // Assuming you have an Input component or use standard input
import { Users, Briefcase, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminStatCard = ({ title, value, icon: Icon, color }) => (
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

const AdminDashboard = () => {
    const { user } = useAuth();
    const [adminTrades, setAdminTrades] = useState([]);
    const [inspectors, setInspectors] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [metrics, setMetrics] = useState({ totalUsers: 0, totalTrades: 0, totalListings: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchAdminData();
    }, [user.role, navigate]);

    const fetchAdminData = async () => {
        try {
            const tradesRes = await api.get('/admin/trades/pending-assignment');
            const inspRes = await api.get('/admin/inspectors');
            const metricsRes = await api.get('/admin/metrics');
            const usersRes = await api.get('/admin/users');

            setAdminTrades(tradesRes.data);
            setInspectors(inspRes.data);
            setMetrics(metricsRes.data);
            setAllUsers(usersRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssign = async (tradeId) => {
        const inspectorId = assignments[tradeId];
        if (!inspectorId) return alert('Please select an inspector first');

        setProcessingId(tradeId);
        try {
            await api.post(`/trust/assign-inspector?tradeId=${tradeId}&inspectorId=${inspectorId}`);
            alert('Assigned successfully');
            fetchAdminData();
            setAssignments(prev => {
                const next = { ...prev };
                delete next[tradeId];
                return next;
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Assignment failed');
        } finally {
            setProcessingId(null);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this user?`)) return;
        try {
            await api.patch(`/admin/users/${userId}/status?active=${!currentStatus}`);
            fetchAdminData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleForceClose = async (tradeId, resolveToBuyer) => {
        if (!window.confirm(`Force close this dispute and resolve it to ${resolveToBuyer ? 'BUYER' : 'FARMER'}?`)) return;
        try {
            await api.post(`/admin/trades/${tradeId}/force-close?resolveToBuyer=${resolveToBuyer}`);
            alert('Dispute resolved');
            fetchAdminData();
        } catch (err) {
            alert('Action failed');
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">Admin Controls</h1>
                        <p className="text-secondary-500 mt-1">System Overview & Management</p>
                    </div>
                    <Button variant="outline" onClick={fetchAdminData}>
                        <Clock size={16} className="mr-2" /> Refresh Data
                    </Button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <AdminStatCard title="Pending Tasks" value={adminTrades.length} icon={Clock} color="indigo" />
                    <AdminStatCard title="Active Users" value={metrics.totalUsers} icon={Users} color="green" />
                    <AdminStatCard title="Total Trades" value={metrics.totalTrades} icon={Briefcase} color="blue" />
                    <AdminStatCard title="Listings" value={metrics.totalListings} icon={TrendingUp} color="purple" />
                </div>

                {/* Disputed Trades */}
                {adminTrades.some(t => t.status === 'DISPUTED') && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-l-4 border-l-orange-500">
                            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                                <AlertTriangle className="text-orange-500" />
                                <h3 className="text-lg font-bold text-secondary-900">Disputed Trades</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-secondary-500 uppercase text-xs font-bold">
                                        <tr>
                                            <th className="p-4">Trade ID</th>
                                            <th className="p-4">Participants</th>
                                            <th className="p-4">Resolve To</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {adminTrades.filter(t => t.status === 'DISPUTED').map(trade => (
                                            <tr key={trade.id}>
                                                <td className="p-4">
                                                    <div className="font-bold text-secondary-900">{trade.cropName}</div>
                                                    <div className="text-xs text-secondary-500 font-mono">{trade.id}</div>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <span className="font-semibold">F:</span> {trade.farmerName}<br />
                                                    <span className="font-semibold">B:</span> {trade.buyerName}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="success" onClick={() => handleForceClose(trade.id, true)}>Winner: Buyer</Button>
                                                        <Button size="sm" variant="warning" onClick={() => handleForceClose(trade.id, false)}>Winner: Farmer</Button>
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

                {/* Pending Assignments */}
                <Card>
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-secondary-900">Pending Assignments</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-secondary-500 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-4">Trade Info</th>
                                    <th className="p-4">Price & Status</th>
                                    <th className="p-4">Participants</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {adminTrades.map(trade => {
                                    // Filter inspectors based on farmer's state, fallback to all if none found
                                    const localInspectors = inspectors.filter(i => i.state === trade.farmerState);
                                    const eligibleInspectors = localInspectors.length > 0 ? localInspectors : inspectors;

                                    return (
                                        <tr key={trade.id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="font-bold text-secondary-900">{trade.cropName}</div>
                                                <div className="text-xs text-secondary-500 font-mono">ID: {trade.id}</div>
                                                <div className="text-xs text-secondary-400 mt-1">State: {trade.farmerState || 'N/A'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-mono font-medium">₹{trade.finalPrice}</div>
                                                <Badge variant="warning" className="mt-1">{trade.status}</Badge>
                                            </td>
                                            <td className="p-4 text-sm text-secondary-600">
                                                F: {trade.farmerName}<br />B: {trade.buyerName}
                                            </td>
                                            <td className="p-4">
                                                {trade.status === 'INSPECTION_REQUESTED' ? (
                                                    <Badge variant="info">Request Sent</Badge>
                                                ) : (
                                                    <div className="flex gap-2 items-center">
                                                        <select
                                                            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none transition w-40"
                                                            value={assignments[trade.id] || ''}
                                                            onChange={(e) => setAssignments(prev => ({ ...prev, [trade.id]: e.target.value }))}
                                                        >
                                                            <option value="">Select Inspector...</option>
                                                            {eligibleInspectors.length > 0 ? (
                                                                eligibleInspectors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)
                                                            ) : (
                                                                <option disabled>No inspectors in {trade.farmerState}</option>
                                                            )}
                                                        </select>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAssign(trade.id)}
                                                            disabled={!assignments[trade.id] || processingId === trade.id}
                                                        >
                                                            {processingId === trade.id ? 'Assigning...' : 'Request'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* User Management */}
                <Card>
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-lg font-bold text-secondary-900">User Management</h3>
                        <div className="w-full md:w-64">
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-secondary-500 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">KYC</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allUsers
                                    .filter(u =>
                                        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        u.email.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="font-medium text-secondary-900">{u.name}</div>
                                                <div className="text-xs text-secondary-500">{u.email}</div>
                                            </td>
                                            <td className="p-4"><Badge variant="neutral">{u.role}</Badge></td>
                                            <td className="p-4">
                                                <Badge variant={u.kycStatus ? 'primary' : 'warning'}>
                                                    {u.kycStatus ? 'VERIFIED' : 'PENDING'}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={u.active ? 'success' : 'error'}>
                                                    {u.active ? 'ACTIVE' : 'SUSPENDED'}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {u.role !== 'ADMIN' && (
                                                    <Button
                                                        size="sm"
                                                        variant={u.active ? 'destructive' : 'success'}
                                                        onClick={() => toggleUserStatus(u.id, u.active)}
                                                    >
                                                        {u.active ? 'Suspend' : 'Activate'}
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
