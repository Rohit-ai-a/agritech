import React, { useState } from 'react';
import api from '../api';

const InspectionModal = ({ tradeId, onClose, onSuccess }) => {
    const [result, setResult] = useState('PASSED');
    const [grade, setGrade] = useState('A');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/trust/complete-inspection', {
                tradeId,
                result,
                grade,
                certificateUrl: 'http://mock-cert.com/' + tradeId // Mock for now
            });
            alert('Inspection submitted!');
            onSuccess();
            onClose();
        } catch (err) {
            alert('Failed to submit inspection');
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Complete Inspection</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Result</label>
                        <select className="w-full border p-2 rounded" value={result} onChange={e => setResult(e.target.value)}>
                            <option value="PASSED">PASSED</option>
                            <option value="FAILED">FAILED</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Grade</label>
                        <select className="w-full border p-2 rounded" value={grade} onChange={e => setGrade(e.target.value)}>
                            <option value="A">Grade A (Premium)</option>
                            <option value="B">Grade B (Standard)</option>
                            <option value="C">Grade C (Fair)</option>
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InspectionModal;
