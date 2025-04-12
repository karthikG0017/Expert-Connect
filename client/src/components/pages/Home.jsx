import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex flex-col items-center">
            <main className="flex-1 flex flex-col justify-center items-center px-4 text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    Connect with Experts<br/>Anytime, Anywhere.
                </h2>
                <p className="text-gray-600 mb-8 max-w-xl">
                    Book 1-on-1 sessions with trusted professionals across tech, finance, career coaching, and more.
                </p>
                <Link to="/register" className="bg-sky-600 px-6 py-3 rounded-xl text-lg font-semibold hover:bg-sky-700">
                    Get Started
                </Link>
            </main>
            <section className="w-full bg-white py-12 px-6">
                <h3 className="text-2xl font-semibold text-center mb-6">Popular Categories</h3>
            </section>
        </div>
    )
}

export default Home