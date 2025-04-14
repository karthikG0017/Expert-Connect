import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AxiosInstance from "../Auth/AxiosInstance";

function ExploreExperts() {
    const {user, setUser} = useAuth();
    const [filters, setFilters] = useState({
      domain:"", 
      minPrice:0, 
      maxPrice:1000000, 
      tag:""
    });
    const [domains, setDomains] = useState([]);
    const [tags, setTags] = useState([]);
    const [experts, setExperts] = useState([]);
    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchExperts = async () => {
          try {
            const queryString = buildQueryParams(filters);
            const  res = await AxiosInstance.get(`/expert-api/expert${queryString}`);
            setExperts(res.data.payload)

            const allTags = new Set();
            
            if (filters.domain !== "") {
              res.data.payload.forEach((expert) => {
                expert.tags.forEach((tag) => allTags.add(tag));
              });
              setTags([...allTags]);
            } else {
              const res = await AxiosInstance.get('/expert-api/expert');
              const allTags = new Set();
              
              res.data.payload.forEach((expert) => {
                expert.tags.forEach((tag) => allTags.add(tag));
              });
              setTags([...allTags]);
            }

          } catch (err) {
            console.error('Error:', err);
          }
        };
        fetchExperts();
      }, [filters]);

      useEffect(() => {
        const fetchExperts = async () => {
          try {
            const  res = await AxiosInstance.get('/expert-api/expert');
            const allDomains = new Set();
            res.data.payload.forEach((expert) => {
              allDomains.add(expert.domain);
            });
            setDomains([...allDomains]);
          } catch (err) {
            console.error('Error:', err);
          }
        };
        fetchExperts();
      }, []);

      const handleViewDetails = (expertId) => {
        navigate(`/expert-details/${expertId}`);
      };

      const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters((prev) => ({
          ...prev, 
          [name]: value
        }))
      };

      const buildQueryParams = (params) => {
        const query = Object.entries(params).map(([key, value]) => value !== undefined && value !== "" ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}` : "").filter(Boolean).join("&");
        return query?`?${query}`:"";
      }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Experts</h2>
            <div className="flex gap-4 p-4 bg-gray-100 rounded-xl">
              {/* domain */}
              <select name="domain" value={filters.domain} onChange={handleChange} className="border p-2 rounded">
                <option value="">All Domains</option>
                {
                  domains?.map((domain) => (
                    <option value={domain}>{domain}</option>
                  ))
                }
              </select>
              {/* tags */}
              <select name="tag" value={filters.value} onChange={handleChange} className="border p-2 rounded m-2">
                <option value="">All Tags</option>
                {
                  tags?.map((tag) => (
                    <option value={tag}>{tag}</option>
                  ))
                }
              </select>
              {/* min price */}
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} placeholder="Give a minimum price" className="border p-2 rounded m-2"/>
              {/* max price */}
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder="Give a maximum price" className="border p-2 rounded m-2"/>
            </div>
            {
              experts && experts.length > 0 ? (
                <>
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
                </>
              ) : (
                <h2>No Experts Found</h2>
              )
            }
        </div>
    );
}

export default ExploreExperts;