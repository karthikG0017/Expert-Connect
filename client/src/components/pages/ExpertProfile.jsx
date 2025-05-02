import React, { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import AxiosInstance from "../Auth/AxiosInstance";
import "./ExpertProfile.css"; // Add this import

function ExpertProfile() {
  const { user } = useAuth();
  const [expertDetails, setExpertDetails] = useState([]);
  const [message, setMessage] = useState('');
  const [bio, setBio] = useState('');
  const [price, setPrice] = useState('');
  const [domain, setDomain] = useState('');
  const [tags, setTags] = useState('');

  // Prefill form when data is fetched
  useEffect(() => {
    if (expertDetails?.length > 0) {
      setBio(expertDetails[0]?.bio || '');
      setPrice(expertDetails[0]?.price || '');
      setDomain(expertDetails[0]?.domain || '');
      setTags((expertDetails[0]?.tags || []).join(', '));
    }
  }, [expertDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      bio,
      price: parseFloat(price),
      domain,
      tags: tags.split(',').map(tag => tag.trim())
    };

    try {
      // Use the AxiosInstance for the POST request
      const url = `/expert-api/experts`; // Relative URL for your API
      const res = await AxiosInstance.post(url, {
        userId: user.id,
        ...formData
      });

      console.log("✅ Submitted successfully:", res.data);
      alert("Details submitted successfully!");
    } catch (err) {
      console.error("❌ Submission error:", err.response?.data || err.message);
      alert("Error submitting details.");
    }
  };

  useEffect(() => {
    const fetchExpertDetails = async () => {
      try {
        if (user && user.id) {
          const res = await AxiosInstance.get(`/expert-api/exp/${user.id}`);
          setExpertDetails(res.data.payload);  // payload is expected to be an array
          setMessage(res.data.message);
        }
      } catch (err) {
        console.error("❌ Error fetching expert details:", err.response?.data || err.message);
      }
    };

    fetchExpertDetails();
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Expert Profile</h1>
        <p className="profile-subtitle">Complete your profile to start accepting bookings</p>
      </div>
      
      {/* {message && (
        <div className={`message ${message.includes('success') ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}
       */}
       <h2 className="text-xl font-bold mb-4">
        {message === 'Expert Not Found' ? 'Enter Expert Details' : 'Edit Expert Details'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell clients about your expertise and experience..."
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="price">Hourly Rate (₹)</label>
          <input
            type="number"
            id="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Your hourly rate in INR"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="domain">Domain</label>
          <select
            id="domain"
            className="form-control"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          >
            <option value="">Select your domain</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Data Science">Data Science</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="DevOps">DevOps</option>
            <option value="Blockchain">Blockchain</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            className="form-control"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., React, Node.js, UI Design"
          />
        </div>
        
        <button type="submit" className="submit-button">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default ExpertProfile;