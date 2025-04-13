import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import AxiosInstance from "../Auth/AxiosInstance";
import { useParams } from "react-router-dom";


function UserDashboard() {
    const {user, setUser} = useAuth();
    const [experts, setExperts] = useState([]);
    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchExperts = async () => {
          try {
           const  res = await AxiosInstance.get('/expert-api/expert');
            console.log(res.data);
            setExperts(res.data.payload)
          } catch (err) {
            console.error('Error:', err);
          }
        };
        fetchExperts();
      }, []);

      const handleViewDetails = (expertId) => {
        navigate(`/expert-details/${expertId}`);
      };

    return (
        <div className="container mt-4">
      <h2 className="mb-4">Experts</h2>
      <div className="row">
        {experts?.map((exp) => (
          <div className="col-md-4 mb-4" key={exp.userId.email}>
          <div className="card shadow-sm">
          <div className="card-body">
          <h5 className="card-title">{exp.userId?.name}</h5>
          <strong>{exp.domain}</strong>
          <p className="card-text">{exp.bio}</p>
          <strong>Price: ₹{exp.price}</strong>
    <button className="btn btn-primary mt-2" onClick={()=>handleViewDetails(exp._id)}>View Details</button>
  </div>
</div>
          </div>
        ))}
      </div>
    </div>
    );
};

export default UserDashboard