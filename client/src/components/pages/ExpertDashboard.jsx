import React, { useState, useEffect } from "react";
import AxiosInstance from "../Auth/AxiosInstance";
import "./ExpertDashboard.css";
import { FaCheck, FaTimes, FaCalendarAlt, FaClock, FaUserAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ExpertDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await AxiosInstance.get('/booking-api/expert-bookings');
        setBookings(res.data.payload);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load your appointments");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
    
    // Set up automatic refresh every minute
    const refreshInterval = setInterval(fetchBookings, 60000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Handle booking status update (approve/reject)
  const handleStatusUpdate = async (bookingId, status, responseMessage = '') => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    
    try {
      await AxiosInstance.post('/booking-api/update-status', {
        bookingId,
        status,
        responseMessage
      });
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
        ? { ...booking, status, responseMessage } 
        : booking
      ));
      
      toast.success(`Appointment ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  // Format date for better display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Check if date is today
  const isToday = (dateString) => {
    const today = new Date();
    const bookingDate = new Date(dateString);
    return today.toDateString() === bookingDate.toDateString();
  }

  // Check if date is in the future
  const isFuture = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(dateString);
    return bookingDate > today;
  }

  // Filter bookings by status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  // Group bookings by date
  const groupedBookings = {};
  filteredBookings.forEach(booking => {
    const dateKey = new Date(booking.date).toDateString();
    if (!groupedBookings[dateKey]) {
      groupedBookings[dateKey] = [];
    }
    groupedBookings[dateKey].push(booking);
  });

  // Sort dates (today first, then future dates, then past dates)
  const sortedDates = Object.keys(groupedBookings).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    
    if (isToday(dateA) && !isToday(dateB)) return -1;
    if (!isToday(dateA) && isToday(dateB)) return 1;
    
    if (isFuture(dateA) && !isFuture(dateB)) return -1;
    if (!isFuture(dateA) && isFuture(dateB)) return 1;
    
    return dateA - dateB;
  });

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Appointment Dashboard</h1>
      
      <div className="dashboard-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Appointments
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button 
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading your appointments...</div>
      ) : (
        <>
          {sortedDates.length > 0 ? (
            <div className="date-sections">
              {sortedDates.map(dateKey => (
                <div key={dateKey} className="date-section">
                  <h2 className={`date-header ${isToday(dateKey) ? 'today' : ''}`}>
                    <FaCalendarAlt className="date-icon" />
                    {isToday(dateKey) ? 'Today' : formatDate(dateKey)}
                  </h2>
                  
                  <div className="bookings-grid">
                    {groupedBookings[dateKey].map(booking => (
                      <div 
                        key={booking._id} 
                        className={`booking-card ${booking.status}-card`}
                      >
                        <div className="booking-header">
                          <div className={`booking-status ${booking.status}`}>
                            <span className="status-dot"></span>
                            {booking.status === 'pending' ? 'Pending Approval' : 
                             booking.status === 'approved' ? 'Approved' : 'Rejected'}
                          </div>
                          
                          <h3 className="client-name">
                            <FaUserAlt className="icon" />
                            {booking.userId.name}
                          </h3>
                          
                          <p className="client-email">
                            <FaEnvelope className="icon" />
                            {booking.userId.email}
                          </p>
                        </div>
                        
                        <div className="booking-details">
                          <div className="detail-item">
                            <FaClock className="icon" />
                            <span className="detail-label">Time:</span>
                            <span className="detail-value">{booking.Time}</span>
                          </div>
                          
                          <div className="detail-item">
                            <FaMapMarkerAlt className="icon" />
                            <span className="detail-label">Type:</span>
                            <span className="detail-value">Offline (In-person)</span>
                          </div>
                          
                          {booking.status === 'rejected' && booking.responseMessage && (
                            <div className="detail-item">
                              <span className="detail-label">Reason:</span>
                              <span className="detail-value rejection-reason">
                                {booking.responseMessage}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {booking.status === 'pending' && (
                          <div className="action-buttons">
                            <button 
                              className="approve-button"
                              onClick={() => handleStatusUpdate(booking._id, 'approved')}
                              disabled={actionLoading[booking._id]}
                            >
                              <FaCheck className="icon" />
                              Approve
                            </button>
                            
                            <button 
                              className="reject-button"
                              onClick={() => {
                                const message = prompt("Reason for rejection (optional):");
                                handleStatusUpdate(booking._id, 'rejected', message || '');
                              }}
                              disabled={actionLoading[booking._id]}
                            >
                              <FaTimes className="icon" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bookings">
              <h2>No appointments found</h2>
              <p>When clients book sessions with you, they will appear here.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ExpertDashboard;