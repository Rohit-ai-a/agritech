import React, { useEffect, useState } from 'react';
import api from '../api';

const LogisticsModal = ({ tradeId, userRole, onClose }) => {
    const [logistics, setLogistics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchLogistics = async () => {
        try {
            const res = await api.get(`/trust/logistics/${tradeId}`);
            setLogistics(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogistics();
    }, [tradeId]);

    const handleUpdate = async (newStatus, newLocation) => {
        try {
            await api.patch('/trust/logistics', {
                tradeId,
                status: newStatus,
                currentLocation: newLocation
            });
            fetchLogistics();
        } catch (err) {
            alert('Update failed');
        }
    };

    if (loading) return <div className="p-4 bg-white rounded">Loading...</div>;
    if (!logistics) return <div className="p-4 bg-white rounded">No logistics info available yet.</div>;

    const steps = ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
    const currentStepIndex = steps.indexOf(logistics.status);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[500px]">
                <h2 className="text-xl font-bold mb-4">Shipment Tracking</h2>
                <div className="mb-4">
                    <p><strong>Tracking ID:</strong> {logistics.trackingId}</p>
                    <p><strong>Location:</strong> {logistics.currentLocation}</p>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-6 relative">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                    {steps.map((step, idx) => (
                        <div key={step} className="flex flex-col items-center bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx <= currentStepIndex ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                                {idx + 1}
                            </div>
                            <span className="text-xs mt-1">{step}</span>
                        </div>
                    ))}
                </div>

                {/* Update Controls for Inspector/Admin */}
                {(userRole === 'INSPECTOR' || userRole === 'ADMIN') && logistics.status !== 'DELIVERED' && (
                    <div className="border-t pt-4">
                        <h3 className="font-bold mb-2">Update Status</h3>
                        <div className="flex gap-2">
                            {logistics.status === 'PICKED_UP' && (
                                <button onClick={() => handleUpdate('IN_TRANSIT', 'In Transit Hub')} className="bg-yellow-500 text-white px-3 py-1 rounded">
                                    Mark In Transit
                                </button>
                            )}
                            {logistics.status === 'IN_TRANSIT' && (
                                <button onClick={() => handleUpdate('DELIVERED', 'Customer Location')} className="bg-green-600 text-white px-3 py-1 rounded">
                                    Mark Delivered
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="text-gray-600 hover:text-black">Close</button>
                </div>
            </div>
        </div>
    );
};

export default LogisticsModal;
