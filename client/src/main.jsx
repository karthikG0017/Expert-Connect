import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'

import AuthContext from './contexts/AuthContext.jsx'
import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './components/Common/RootLayout.jsx';
import Home from './components/pages/Home.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Dashboard from './components/Common/Dashboard.jsx';

const browserRouterObj = createBrowserRouter([
  {
    path: "/", 
    element: <RootLayout/>, 
    children: [
      {
        path: "", 
        element: <Home/>
      }, 
      {
        path: "login", 
        element: <Login/>
      }, 
      {
        path: "register", 
        element: <Register/>
      }, 
      {
        path: "dashboard", 
        element: <Dashboard/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContext>
      <RouterProvider router={browserRouterObj}/>
    </AuthContext>
  </StrictMode>,
)
