import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import AxiosInstance from "../Auth/AxiosInstance";
import "react-datepicker/dist/react-datepicker.css";
import "./ExpertPage.css";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaRupeeSign, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ExpertPage() {
  const { expertId } = useParams();
  const { user } = useAuth();
  const [expert, setExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const allSlots = [
    "9 AM - 10 AM",
    "10 AM - 11 AM",
    "11 AM - 12 PM",
    "12 PM - 1 PM",
    "1 PM - 2 PM",
    "2 PM - 3 PM",
    "3 PM - 4 PM",
    "4 PM - 5 PM",
    "5 PM - 6 PM",
  ];

  // Fetch expert data
  useEffect(() => {
    const fetchExpert = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:4000/expert-api/expert/${expertId}`
        );
        setExpert(res.data.payload);
      } catch (err) {
        console.error("Error fetching expert details:", err);
        toast.error("Failed to load expert details");
      } finally {
        setLoading(false);
      }
    };
    
    if (expertId) {
      fetchExpert();
    }
  }, [expertId]);

// Handle date selection
const handleDateChange = async (date) => {
  // Create a date object that preserves the selected date regardless of timezone
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Format date as YYYY-MM-DD while preserving the local date
  const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
  
  setSelectedDate(formattedDate);
  setSelectedOption(""); // Reset selected time slot
  
  try {
    const res = await axios.get(
      `http://localhost:4000/booking-api/timings/${expertId}/${formattedDate}`
    );
    
    // Extract already booked time slots
    const bookedTimes = res.data.payload.map((booking) => booking.Time);
    
    // Filter available slots
    const filtered = allSlots.filter((slot) => !bookedTimes.includes(slot));
    setAvailableSlots(filtered);
  } catch (err) {
    console.error("Error fetching available slots:", err);
    toast.error("Failed to load available time slots");
  }
};

  // Handle time slot selection
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Handle booking submission
  const handleBook = async () => {
    // Validate user is logged in
    if (!user) {
      toast.error("Please login to book an appointment");
      return;
    }
    
    // Validate form inputs
    if (!expertId || !selectedDate || !selectedOption) {
      toast.error("Please select both date and time slot");
      return;
    }
    
    setBookingLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      const bookingData = {
        expertId: expertId,
        date: selectedDate,
        Time: selectedOption,
      };
      
      const res = await AxiosInstance.post(
        "/booking-api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Success message with address information
      toast.success("Booking request sent! The expert will need to approve your appointment.");
      
      // Display detailed information in an alert
      setTimeout(() => {
        alert(
          `Appointment Request Details:\n\n` +
          `Expert: ${expert?.userId.name}\n` +
          `Date: ${new Date(selectedDate).toLocaleDateString()}\n` +
          `Time: ${selectedOption}\n` +
          `Location: ${expert?.address.streetAddress}, ${expert?.address.city}, ${expert?.address.state}\n\n` +
          `Your request is pending approval from the expert. Check your dashboard for updates.`
        );
      }, 500);
      
      // Reset form
      setSelectedDate("");
      setSelectedOption("");
      setAvailableSlots([]);
      
    } catch (err) {
      if (err.response?.data?.message === "Slot already booked") {
        toast.error("This time slot has already been booked");
      } else {
        toast.error("Failed to book appointment");
        console.error("Booking error:", err);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Format date to display in a friendly format
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-container">Loading expert details...</div>;
  }

  if (!expert) {
    return <div className="error-container">Expert not found</div>;
  }

  return (
    <div className="expert-page-container">
      <div className="expert-profile">
        <div className="expert-header">
          <h1 className="expert-title">
            {expert.domain} Expert
          </h1>
          <h2 className="expert-name">{expert.userId.name}</h2>
        </div>
        
        <div className="expert-content">
          <div className="expert-main-info">
            <p className="expert-bio">{expert.bio}</p>
            
            <div className="expert-tags">
              {expert.tags?.map((tag, index) => (
                <span key={index} className="expert-tag">{tag}</span>
              ))}
            </div>
            
            <div className="expert-details">
              <div className="expert-detail-item">
                <span className="detail-label">
                  <FaRupeeSign className="detail-icon" /> Price:
                </span>
                <span className="price-tag">₹{expert.price} per hour</span>
              </div>
              
              <div className="expert-detail-item">
                <span className="detail-label">
                  <FaStar className="detail-icon" /> Rating:
                </span>
                <div className="rating-display">
                  <span className="rating-value">{expert.rating || "New"}</span>
                </div>
              </div>
              
              <div className="expert-detail-item">
                <span className="detail-label">Contact:</span>
                <span className="contact-info">{expert.userId.email}</span>
              </div>
            </div>
          </div>
          
          <div className="location-section">
            <h3 className="section-title">
              <FaMapMarkerAlt className="section-icon" /> Consultation Location
            </h3>
            <div className="location-card">
              <p className="location-address">
                {expert.address.streetAddress}, <br />
                {expert.address.city}, {expert.address.state}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="booking-section">
        <h3 className="booking-header">
          <FaCalendarAlt className="booking-icon" /> Book an appointment
        </h3>
        
        <div className="booking-form">
          <div className="booking-step">
            <h4 className="step-title">
              <span className="step-number">1</span> Select Date
            </h4>
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={handleDateChange}
              className="datepicker-custom"
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Click to select a date"
            />
          </div>
          <br/>
          
          {selectedDate && (
            <div className="booking-step">
              <h4 className="step-title">
                <span className="step-number">2</span> Select Time
              </h4>
              
              {availableSlots && availableSlots.length > 0 ? (
                <div className="time-slots-container">
                  <select
                    id="time-slot"
                    className="time-slot-select"
                    value={selectedOption}
                    onChange={handleChange}
                  >
                    <option value="">Select a time slot</option>
                    {availableSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="no-slots-message">
                  <FaClock className="message-icon" /> No available slots on {formatDate(selectedDate)}
                </div>
              )}
            </div>
          )}
          <br/>
          
          {selectedDate && selectedOption && (
            <div className="booking-summary">
              <h4 className="summary-title">Appointment Summary</h4>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="summary-label">Expert:</span>
                  <span className="summary-value">{expert.userId.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Date:</span>
                  <span className="summary-value">{formatDate(selectedDate)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Time:</span>
                  <span className="summary-value">{selectedOption}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Location:</span>
                  <span className="summary-value address-value">
                    {expert.address.streetAddress}, {expert.address.city}, {expert.address.state}
                  </span>
                </div>
              </div>
            </div>
          )}
          <br/>
          
          <button 
            className="book-button" 
            onClick={handleBook}
            disabled={!selectedDate || !selectedOption || bookingLoading}
          >
            {bookingLoading ? "Processing..." : "Request Appointment"}
          </button>
          
          <div className="booking-note">
            <p><strong>Note:</strong> Your appointment request will need approval from the expert. You'll be notified once it's approved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpertPage;