import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AxiosInstance from "../Auth/AxiosInstance";
import "./ExploreExperts.css"; // Import the CSS file

function ExploreExperts() {
    const { user, setUser } = useAuth();
    const [filters, setFilters] = useState({
        domain: "",
        minPrice: 0,
        maxPrice: 1000000,
        tag: "",
        state: "", // Add state to filters
        city: "" // Add city to filters
    });
    const [domains, setDomains] = useState([]);
    const [tags, setTags] = useState([]);
    const [states, setStates] = useState([]); // Add state list
    const [citiesByState, setCitiesByState] = useState({}); // Group cities by state
    const [experts, setExperts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const queryString = buildQueryParams(filters);
                const res = await AxiosInstance.get(`/expert-api/expert${queryString}`);
                setExperts(res.data.payload);

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
        const fetchDomainsStatesAndCities = async () => {
            try {
                const res = await AxiosInstance.get('/expert-api/expert');
                const allDomains = new Set();
                const allStates = new Set();
                const citiesByStateMap = {}; // Map to group cities by state

                res.data.payload.forEach((expert) => {
                    allDomains.add(expert.domain);
                    if (expert.address?.state) {
                        allStates.add(expert.address.state);
                        if (!citiesByStateMap[expert.address.state]) {
                            citiesByStateMap[expert.address.state] = new Set();
                        }
                        if (expert.address?.city) {
                            citiesByStateMap[expert.address.state].add(expert.address.city);
                        }
                    }
                });

                setDomains([...allDomains]);
                setStates([...allStates]);
                // Convert city sets to arrays for each state
                const citiesByStateArray = Object.fromEntries(
                    Object.entries(citiesByStateMap).map(([state, cities]) => [state, [...cities]])
                );
                setCitiesByState(citiesByStateArray);
            } catch (err) {
                console.error('Error:', err);
            }
        };
        fetchDomainsStatesAndCities();
    }, []);

    const handleViewDetails = (expertId) => {
        navigate(`/expert-details/${expertId}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            // Reset city filter if state changes
            ...(name === "state" ? { city: "" } : {})
        }));
    };

    const buildQueryParams = (params) => {
        const query = Object.entries(params)
            .map(([key, value]) => (value !== undefined && value !== "" ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}` : ""))
            .filter(Boolean)
            .join("&");
        return query ? `?${query}` : "";
    };

    return (
        <div className="experts-container">
            <h2 className="page-title">Explore Experts</h2>

            <div className="filter-section">
                <div className="filter-controls">
                    <div className="filter-group">
                        <label className="filter-label" htmlFor="domain-select">Domain</label>
                        <select
                            id="domain-select"
                            className="filter-select"
                            name="domain"
                            value={filters.domain}
                            onChange={handleChange}
                        >
                            <option value="">All Domains</option>
                            {domains?.map((domain, index) => (
                                <option key={index} value={domain}>{domain}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label" htmlFor="tag-select">Tags</label>
                        <select
                            id="tag-select"
                            className="filter-select"
                            name="tag"
                            value={filters.tag}
                            onChange={handleChange}
                        >
                            <option value="">All Tags</option>
                            {tags?.map((tag, index) => (
                                <option key={index} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label" htmlFor="state-select">State</label>
                        <select
                            id="state-select"
                            className="filter-select"
                            name="state"
                            value={filters.state}
                            onChange={handleChange}
                        >
                            <option value="">All States</option>
                            {states?.map((state, index) => (
                                <option key={index} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label" htmlFor="city-select">City</label>
                        <select
                            id="city-select"
                            className="filter-select"
                            name="city"
                            value={filters.city}
                            onChange={handleChange}
                            disabled={!filters.state} // Disable if no state is selected
                        >
                            <option value="">All Cities</option>
                            {filters.state &&
                                citiesByState[filters.state]?.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label" htmlFor="min-price">Min Price (₹)</label>
                        <input
                            id="min-price"
                            className="filter-input"
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleChange}
                            placeholder="Minimum price"
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label" htmlFor="max-price">Max Price (₹)</label>
                        <input
                            id="max-price"
                            className="filter-input"
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            placeholder="Maximum price"
                        />
                    </div>
                </div>
            </div>

            {experts && experts.length > 0 ? (
                <div className="experts-grid">
                    {experts.map((expert) => (
                        <div className="expert-card" key={expert.userId?.email || expert._id}>
                            <div className="expert-card-body">
                                <h3 className="expert-name">{expert.userId?.name}</h3>
                                <span className="expert-domain">{expert.domain}</span>
                                <p className="expert-bio">{expert.bio}</p>

                                {expert.tags && expert.tags.length > 0 && (
                                    <div className="expert-tags">
                                        {expert.tags.map((tag, index) => (
                                            <span key={index} className="expert-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="expert-price">₹{expert.price.toLocaleString()}</div>
                                <button
                                    className="view-details-btn"
                                    onClick={() => handleViewDetails(expert._id)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-experts-message">
                    <h3>No Experts Found</h3>
                    <p>Try adjusting your filters to find experts</p>
                </div>
            )}
        </div>
    );
}

export default ExploreExperts;