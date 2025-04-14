import React from "react";
import { useState, useEffect } from "react";
import AxiosInstance from '../Auth/AxiosInstance'

function ExpertDashboard() {

    const [bookings, setUserBookings] = useState([]);

    useEffect(() => {
      const fetchBookings = async () => {
        const res = await AxiosInstance.get('/booking-api/expert-bookings');
        setUserBookings(res.data.payload);
        console.log(res.data.payload);
      };
      fetchBookings();
    }, []);

    return (
        <div>
            {bookings && bookings.length > 0 ? ( <>
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4">Your Upcoming Sessions</h1>
                    {bookings.map((booking) => (
                        <div key={booking._id} className="p-4 border rounded mb-2">
                            <p><strong>User:</strong> {booking.userId?.email}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.Time}</p>
                            <p><strong>Status:</strong> {booking.isConfirmed ? "Confirmed" : "Not yet confirmed"}</p>
                            <a href={booking.meetLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                                Start Session
                            </a>
                        </div>
                    ))}
                </div>
            </> ) : (
                <h2>No appointments found</h2>
            )}
        </div>
    );
};

export default ExpertDashboard