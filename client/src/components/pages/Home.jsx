import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import the CSS file

function Home() {
    return (
        <div className="home-container">
            <main className="hero-section">
                <h2 className="hero-title">
                    Connect with Experts<br/>Anytime, Anywhere.
                </h2>
                <p className="hero-subtitle">
                    Book 1-on-1 sessions with trusted professionals across tech, finance, career coaching, and more.
                </p>
                <Link to="/register" className="cta-button">
                    Get Started
                </Link>
            </main>
            <section className="categories-section">
                <h3 className="categories-title">Popular Categories</h3>
            </section>
        </div>
    )
}

export default Home;
























