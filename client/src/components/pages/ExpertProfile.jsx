import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AxiosInstance from "../Auth/AxiosInstance";
import "./ExpertProfile.css";
import { toast } from 'react-toastify';

function ExpertProfile() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [price, setPrice] = useState("");
  const [domain, setDomain] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [expertDetails, setExpertDetails] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  
  // Address state
  const [address, setAddress] = useState({
    streetAddress: '',
    city: '',
    state: ''
  });
  const [cities, setCities] = useState([]);

  // Indian States
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi"
  ];

  // Cities mapping by state
  const citiesByState = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "Delhi": ["New Delhi", "Delhi NCR"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Noida", "Ghaziabad"],
    // More states and cities can be added as needed
  };

  // Handle state change
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setAddress(prev => ({...prev, state: selectedState, city: ''}));
    setCities(citiesByState[selectedState] || []);
    setFormErrors(prev => ({...prev, state: ''}));
  };

  // Fetch expert details on component mount
  useEffect(() => {
    const fetchExpertDetails = async () => {
      setLoading(true);
      try {
        const res = await AxiosInstance.get("/expert-api/expert-profile");
        setExpertDetails(res.data.payload);
      } catch (error) {
        console.error("Error fetching expert details:", error);
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchExpertDetails();
    }
  }, [user]);

  // Prefill form when data is fetched
  useEffect(() => {
    if (expertDetails?.length > 0) {
      setBio(expertDetails[0]?.bio || '');
      setPrice(expertDetails[0]?.price || '');
      setDomain(expertDetails[0]?.domain || '');
      setTags((expertDetails[0]?.tags || []).join(', '));
      
      if (expertDetails[0]?.address) {
        setAddress(expertDetails[0].address);
        if (expertDetails[0].address.state) {
          setCities(citiesByState[expertDetails[0].address.state] || []);
        }
      }
    }
  }, [expertDetails]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!bio.trim()) errors.bio = "Bio is required";
    if (!domain.trim()) errors.domain = "Domain is required";
    if (!price || price <= 0) errors.price = "Valid price is required";
    
    // Address validation
    if (!address.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }
    if (!address.state) {
      errors.state = "State is required";
    }
    if (!address.city) {
      errors.city = "City is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);

    const formData = {
      bio,
      price: parseFloat(price),
      domain,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      address
    };

    try {
      const res = await AxiosInstance.post("/expert-api/expert", formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expert-profile-container">
      <h2 className="profile-title">Expert Profile</h2>
      
      <form className="expert-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="domain">Domain <span className="required">*</span></label>
          <input
            type="text"
            id="domain"
            className={`form-control ${formErrors.domain ? 'error-input' : ''}`}
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setFormErrors(prev => ({...prev, domain: ''}));
            }}
            placeholder="Your area of expertise (e.g., Nutrition, Fitness, Finance)"
            required
          />
          {formErrors.domain && <div className="error-message">{formErrors.domain}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="bio">Bio <span className="required">*</span></label>
          <textarea
            id="bio"
            className={`form-control form-textarea ${formErrors.bio ? 'error-input' : ''}`}
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              setFormErrors(prev => ({...prev, bio: ''}));
            }}
            placeholder="Tell clients about your experience and expertise"
            required
          ></textarea>
          {formErrors.bio && <div className="error-message">{formErrors.bio}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="price">Price per hour (₹) <span className="required">*</span></label>
          <input
            type="number"
            id="price"
            className={`form-control ${formErrors.price ? 'error-input' : ''}`}
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setFormErrors(prev => ({...prev, price: ''}));
            }}
            placeholder="Your hourly rate"
            required
          />
          {formErrors.price && <div className="error-message">{formErrors.price}</div>}
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            className="form-control"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma separated tags (e.g., java, python, machine learning)"
          />
          <small className="help-text">Separate multiple tags with commas</small>
        </div>
        
        <div className="form-section">
          <h3 className="section-title">Consultation Location <span className="required">*</span></h3>
          <div className="form-group">
            <label className="form-label" htmlFor="street-address">Street Address <span className="required">*</span></label>
            <input
              type="text"
              id="street-address"
              className={`form-control ${formErrors.streetAddress ? 'error-input' : ''}`}
              value={address.streetAddress}
              onChange={(e) => {
                setAddress(prev => ({...prev, streetAddress: e.target.value}));
                setFormErrors(prev => ({...prev, streetAddress: ''}));
              }}
              placeholder="Office/Building number, Street name"
              required
            />
            {formErrors.streetAddress && <div className="error-message">{formErrors.streetAddress}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label" htmlFor="state">State <span className="required">*</span></label>
              <select
                id="state"
                className={`form-control ${formErrors.state ? 'error-input' : ''}`}
                value={address.state}
                onChange={handleStateChange}
                required
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {formErrors.state && <div className="error-message">{formErrors.state}</div>}
            </div>
            
            <div className="form-group half-width">
              <label className="form-label" htmlFor="city">City <span className="required">*</span></label>
              <select
                id="city"
                className={`form-control ${formErrors.city ? 'error-input' : ''}`}
                value={address.city}
                onChange={(e) => {
                  setAddress(prev => ({...prev, city: e.target.value}));
                  setFormErrors(prev => ({...prev, city: ''}));
                }}
                disabled={!address.state}
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {formErrors.city && <div className="error-message">{formErrors.city}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <div className="address-note">
              <p>
                <strong>Note:</strong> This address will be shared with clients who book 
                appointments with you. Ensure it's accurate and professional.
              </p>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default ExpertProfile;