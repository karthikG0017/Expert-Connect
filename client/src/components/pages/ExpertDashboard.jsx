import React from "react";
import { useState, useEffect } from "react";
import AxiosInstance from '../Auth/AxiosInstance'
import './ExpertDashboard.css'; // Add this import

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
      <div className="dashboard-container">
        <h1 className="dashboard-title">Expert Dashboard</h1>
        
        {bookings && bookings.length > 0 ? (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div className="booking-card" key={booking._id}>
                <div className="user-info">
                  <div className="user-avatar">
                    {booking.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="user-email">{booking.userId?.email}</div>
                </div>
                
                <div className="session-details">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{booking.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{booking.duration} minutes</span>
                  </div>
                </div>
                
                <div className="status-container">
                  <span className={`status-indicator ${booking.isConfirmed ? 'status-confirmed' : 'status-unconfirmed'}`}>
                    {booking.isConfirmed ? 'Confirmed' : 'Not Confirmed'}
                  </span>
                </div>
                
                {booking.isConfirmed && (
                  <a href={`/session/${booking._id}`} className="start-session">
                    Start Session
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            No bookings found. When users book sessions with you, they will appear here.
          </div>
        )}
      </div>
    );
};

export default ExpertDashboard