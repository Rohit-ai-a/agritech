import React, { useEffect, useState } from 'react';
import api from '../api';

const TradeTimeline = ({ tradeId }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get(`/trades/${tradeId}/events`);
                setEvents(res.data);
            } catch (err) {
                console.error("Failed to load events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [tradeId]);

    if (loading) return <div className="text-xs text-gray-500">Loading timeline...</div>;
    if (events.length === 0) return null;

    return (
        <div className="border-l-2 border-gray-200 ml-3 pl-4 space-y-6 py-4">
            {events.map((event, index) => (
                <div key={event.id} className="relative">
                    <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">{event.eventType}</p>
                        <p className="text-xs text-gray-600">{event.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TradeTimeline;
