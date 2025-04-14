import React, { useState, useEffect } from "react";
import AxiosInstance from '../Auth/AxiosInstance';

function UserDashboard() {
    const [bookings, setUserBookings] = useState([]);

    useEffect(() => {
      const fetchBookings = async () => {
        try {
          const res = await AxiosInstance.get('/booking-api/user-bookings');
          setUserBookings(res.data.payload);
          console.log(res.data.payload);
        } catch (error) {
          console.error("Error fetching bookings", error);
        }
      };
      fetchBookings();
    }, []);

    return (
      <div className="p-6">
        {bookings && bookings.length > 0 ? (
          <>
            <h1 className="text-xl font-bold mb-4">Your Bookings</h1>
            {bookings.map((booking) => (
              <div key={booking._id} className="p-4 border rounded mb-2">
                <p><strong>Expert:</strong> {booking.expertName}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.Time}</p>
                <p><strong>Status:</strong> {booking.isConfirmed ? "Confirmed" : "Pending"}</p>
                <a
                  href={booking.meetLink}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Session
                </a>
              </div>
            ))}
          </>
        ) : (
          <h2>No bookings found</h2>
        )}
      </div>
    );
};

export default UserDashboard;
