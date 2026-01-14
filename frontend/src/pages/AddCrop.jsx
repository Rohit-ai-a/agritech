import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AddCrop = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Cereals',
        quantity: '',
        pricePerUnit: '',
        locationState: '',
        imageUrl: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/crops', formData);
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to add crop');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-96">
                <h2 className="text-xl font-bold mb-4 text-green-700">Post New Crop</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-1">Crop Name</label>
                        <input className="w-full border p-2 rounded" required
                            onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1">Category</label>
                        <select className="w-full border p-2 rounded"
                            onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option>Cereals</option>
                            <option>Pulses</option>
                            <option>Vegetables</option>
                            <option>Fruits</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1">Quantity (kg)</label>
                        <input type="number" className="w-full border p-2 rounded" required
                            onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1">Price per Unit (₹)</label>
                        <input type="number" className="w-full border p-2 rounded" required
                            onChange={e => setFormData({ ...formData, pricePerUnit: e.target.value })} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm mb-1">Location (State)</label>
                        <input type="text" className="w-full border p-2 rounded" required
                            onChange={e => setFormData({ ...formData, locationState: e.target.value })} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm mb-1">Crop Image</label>
                        <input type="file" accept="image/*" className="w-full border p-2 rounded"
                            onChange={e => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }} />
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddCrop;
