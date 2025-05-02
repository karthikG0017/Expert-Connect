import React, { useState, useEffect } from "react";
import AxiosInstance from '../Auth/AxiosInstance';
import "./UserDashboard.css"; // Import the CSS file

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

    // Format date for better display
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Your Bookings</h1>
        
        {bookings && bookings.length > 0 ? (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h2 className="expert-name">{booking.expertName}</h2>
                </div>
                <div className="booking-body">
                  <div className="booking-detail">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {booking.date ? formatDate(booking.date) : "Not specified"}
                    </span>
                  </div>
                  
                  <div className="booking-detail">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{booking.Time || "Not specified"}</span>
                  </div>
                  
                  <div className="booking-detail">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${booking.isConfirmed ? "status-confirmed" : "status-pending"}`}>
                      {booking.isConfirmed ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  
                  {booking.meetLink && (
                    <div className="session-link-container">
                      <a
                        href={booking.meetLink}
                        className="session-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Session
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="empty-state-heading">No bookings found</h2>
            <p className="empty-state-text">
              Your scheduled sessions with experts will appear here once you've made bookings.
            </p>
          </div>
        )}
      </div>
    );
};

export default UserDashboard;