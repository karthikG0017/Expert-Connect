import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import AxiosInstance from "../Auth/AxiosInstance";
import "react-datepicker/dist/react-datepicker.css";
import "./ExpertPage.css";

function ExpertPage() {
  const expertId = useParams();
  const { user, setUser } = useAuth();
  const [expert, setExpert] = useState();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const allSlots = [
    "9 AM - 10AM",
    "10 AM - 11AM",
    "11 AM - 12PM",
    "12 PM - 1PM",
    "1 PM - 2PM",
    "2 PM - 3PM",
    "3 PM - 4PM",
    "4 PM - 5PM",
    "5 PM - 6PM",
  ];

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/expert-api/expert/${expertId.expertId}`
        );
        setExpert(res.data.payload);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchExpert();
  }, [expertId]);
  const handleDateChange = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    try {
      const res = await axios.get(
        `http://localhost:4000/booking-api/timings/${expertId.expertId}/${formattedDate}`
      );
      const bookedTimes = res.data.payload.map((b) => b.Time);
      const filtered = allSlots.filter((slot) => !bookedTimes.includes(slot));
      setAvailableSlots(filtered);
    } catch (err) {
      console.error("Error fetching available slots", err);
    }
  };
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleBook = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!expertId || !selectedDate || !selectedOption) {
        alert("Please fill in all booking details");
        return;
      }

      const bookingData = {
        expertId: expertId.expertId,
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
      console.log("Booking successful:", res.data);
      alert(`Booking succesful! Session Link: ${res.data.payload.meetLink}`);
    } catch (err) {
      if (err.response.data.message === "Slot already booked") {
        alert("Slot already booked");
      } else {
        alert(`Sorry, something error occured!`);
        console.log("Error:", err);
      }
    }
  };
  return (
    <div>
      <h1>
        {expert?.domain}-{expert?.userId.name}
      </h1>
      <p>{expert?.bio}</p>
      <strong>Price-₹{expert?.price}</strong>
      <p>Rating-{expert?.rating}</p>
      <p>For further details-{expert?.userId.email}</p>
      <h3>Book an appointment:</h3>
      <div className="my-3 d-flex booking-ap">
        <h5>Select Date:</h5>
        <DatePicker
          selected={selectedDate ? new Date(selectedDate) : null}
          onChange={handleDateChange}
          className="form-control"
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
        />
        <br/>
        {
          availableSlots && availableSlots.length > 0 ? (
            <>

              <select
                id="dropdown"
                className="form-select"
                value={selectedOption}
                onChange={handleChange}
              >
                <option value="">Select the slot</option>
                {availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </>
          ) : (
            selectedDate && <h2>No available slots on this day!</h2>
          )
        }
      </div>
      <button className="btn btn-primary" onClick={handleBook}>
        Book
      </button>
    </div>
  );
}

export default ExpertPage;
