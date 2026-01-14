import React from 'react';
import TradeTimeline from './TradeTimeline';

const TradeDetailsModal = ({ tradeId, onClose }) => {
    if (!tradeId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-800">Trade Timeline</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
                </div>

                <p className="text-xs text-gray-500 mb-4">Tracking history for Trade #{tradeId.substring(0, 8)}</p>

                <TradeTimeline tradeId={tradeId} />

                <div className="mt-6 text-center">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeDetailsModal;
