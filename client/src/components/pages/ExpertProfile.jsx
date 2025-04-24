import React, { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import AxiosInstance from "../Auth/AxiosInstance"; // Import your AxiosInstance

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
    <div>
      <h1 className="text-xl font-bold mb-4">
        {message === 'Expert Not Found' ? 'Enter Expert Details' : 'Edit Expert Details'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            className="w-full border rounded p-2"
            placeholder="Enter your bio..."
          />
        </div>
        <div>
          <label className="block font-semibold">Price ($):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g., 50"
          />
        </div>
        <div>
          <label className="block font-semibold">Domain:</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Domain --</option>
            <option value="Career Coaching">Career Coaching</option>
            <option value="Sports">Sports</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g., AI, ML, Python"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {message === 'Expert Not Found' ? 'Create Profile' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default ExpertProfile;