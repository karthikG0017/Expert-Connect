import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ExpertPage.css'

function ExpertPage() {
    const expertId=useParams()
    const [expert, setExpert] = useState();
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedOption, setSelectedOption] = useState('');
    useEffect(()=>{
        const fetchExpert=async ()=>{
            try{
            const res=await axios.get(`http://localhost:4000/expert-api/expert/${expertId.expertId}`)
            console.log(res.data.payload)
            setExpert(res.data.payload)
            }
            catch (err){
                console.error('Error:', err);
            }
        }
        fetchExpert()
    },[expertId])
    const handleDateChange = (date) => {
      const formattedDate = date.toISOString().split('T')[0]; 
      setSelectedDate(formattedDate);
    };
    const handleChange = (e) => {
      setSelectedOption(e.target.value);
    };

  return (
    <div>
        <h1>{expert?.domain}-{expert?.userId.name}</h1>
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
     <select
        id="dropdown"
        className="form-select"
        value={selectedOption}
        onChange={handleChange}
      >
        <option value="">Select the slot</option>
        <option value="9-10">9 AM - 10AM</option>
        <option value="10-11">10 AM - 11AM</option>
        <option value="11-12">11 AM - 12 PM</option>
        <option value="1-2">1 PM - 2 PM</option>
        <option value="2-3">2 PM - 3 PM</option>
        <option value="3-4">3 PM - 4 PM</option>
        <option value="4-5">4 PM - 5 PM</option>
        <option value="5-6">5 PM - 6 PM</option>
      </select>
    </div>
    </div>

  )
}

export default ExpertPage