import React, { useState } from 'react';
import api from '../api';

const RatingModal = ({ tradeId, onClose, onSuccess }) => {
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/ratings?tradeId=${tradeId}&score=${score}&comment=${comment}`);
            alert('Thank you for your feedback!');
            onSuccess();
            onClose();
        } catch (err) {
            alert('Failed to submit rating. You might have already rated this trade.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Rate your experience</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setScore(num)}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition ${score >= num ? 'bg-yellow-400 border-yellow-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                        <textarea
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                            placeholder="How was the quality/payment process?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
