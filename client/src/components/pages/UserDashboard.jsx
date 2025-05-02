import React, { useState, useEffect } from "react";
import AxiosInstance from "../Auth/AxiosInstance";
import "./UserDashboard.css";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await AxiosInstance.get('/booking-api/user-bookings');
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

  // Get status details based on status value
  const getStatusDetails = (booking) => {
    switch(booking.status) {
      case 'approved':
        return {
          label: 'Approved',
          class: 'status-approved',
          icon: <FaCheck className="status-icon" />
        };
      case 'rejected':
        return {
          label: 'Rejected',
          class: 'status-rejected',
          icon: <FaTimes className="status-icon" />
        };
      case 'pending':
      default:
        return {
          label: 'Pending Approval',
          class: 'status-pending',
          icon: <FaClock className="status-icon" />
        };
    }
  };

  // Filter bookings by status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">My Appointments</h1>
      
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
      ) : filteredBookings.length > 0 ? (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => {
            const statusDetails = getStatusDetails(booking);
            const isPastAppointment = new Date(booking.date) < new Date();
            
            return (
              <div 
                key={booking._id} 
                className={`booking-card ${statusDetails.class} ${isPastAppointment ? 'past-appointment' : ''}`}
              >
                <div className="booking-header">
                  <h2 className="expert-name">{booking.expertName}</h2>
                  <div className={`booking-status ${statusDetails.class}`}>
                    {statusDetails.icon}
                    {statusDetails.label}
                  </div>
                </div>
                
                <div className="booking-body">
                  <div className="booking-detail">
                    <FaCalendarAlt className="detail-icon" />
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {isToday(booking.date) ? 'Today' : formatDate(booking.date)}
                    </span>
                  </div>
                  
                  <div className="booking-detail">
                    <FaClock className="detail-icon" />
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{booking.Time || "Not specified"}</span>
                  </div>
                  
                  {booking.expertId?.address && (
                    <div className="booking-detail">
                      <FaMapMarkerAlt className="detail-icon" />
                      <span className="detail-label">Location:</span>
                      <span className="detail-value location-value">
                        {booking.expertId.address.streetAddress}, <br />
                        {booking.expertId.address.city}, {booking.expertId.address.state}
                      </span>
                    </div>
                  )}
                  
                  {booking.status === 'rejected' && booking.responseMessage && (
                    <div className="booking-detail rejection-reason">
                      <FaInfoCircle className="detail-icon" />
                      <span className="detail-label">Reason:</span>
                      <span className="detail-value">{booking.responseMessage}</span>
                    </div>
                  )}
                </div>
                
                {booking.status === 'pending' && (
                  <div className="appointment-note">
                    <p><FaInfoCircle className="note-icon" /> Waiting for expert approval</p>
                  </div>
                )}
                
                {booking.status === 'approved' && !isPastAppointment && (
                  <div className="appointment-note approved-note">
                    <p><FaCheck className="note-icon" /> Appointment confirmed! Please arrive on time.</p>
                  </div>
                )}
                
                {isPastAppointment && booking.status === 'approved' && (
                  <div className="appointment-note past-note">
                    <p>This appointment has passed</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2 className="empty-state-heading">No appointments found</h2>
          <p className="empty-state-text">
            Your scheduled appointments with experts will appear here once you've made bookings.
          </p>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;