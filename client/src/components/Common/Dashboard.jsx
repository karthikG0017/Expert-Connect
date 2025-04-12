import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import UserDashboard from "../pages/UserDashboard";
import ExpertDashboard from "../pages/ExpertDashboard";
import { Navigate } from "react-router-dom";
import PrivateRoute from "../Auth/PrivateRoute";

function Dashboard() {
    const {user} = useAuth();

    if (!user) {
        return <Navigate to="/dashboard"/>;
    }

    return (
        <div>
            <PrivateRoute>
                {user.role === "expert" ? <ExpertDashboard/> : <UserDashboard/>}
            </PrivateRoute>
        </div>
    );
}

export default Dashboard