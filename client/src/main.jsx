// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// // import './index.css'
// import App from './App.jsx'
// import ExpertPage from './components/pages/ExpertPage.jsx'
// import AuthContext from './contexts/AuthContext.jsx'
// import 'bootstrap/dist/css/bootstrap.css';
// import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import RootLayout from './components/Common/RootLayout.jsx';
// import Home from './components/pages/Home.jsx';
// import Login from './components/Auth/Login.jsx';
// import Register from './components/Auth/Register.jsx';
// import Dashboard from './components/Common/Dashboard.jsx';
// import ExploreExperts from './components/pages/ExploreExperts.jsx'

// const browserRouterObj = createBrowserRouter([
//   {
//     path: "/", 
//     element: <RootLayout/>, 
//     children: [
//       {
//         path: "", 
//         element: <Home/>
//       }, 
//       {
//         path: "login", 
//         element: <Login/>
//       }, 
//       {
//         path: "register", 
//         element: <Register/>
//       }, 
//       {
//         path: "dashboard", 
//         element: <Dashboard/>
//       },
//       {
//         path:`expert-details/:expertId`,
//         element:<ExpertPage/>
//       }, 
//       {
//         path:'explore-experts', 
//         element:<ExploreExperts/>
//       }
//     ]
//   }
// ])

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AuthContext>
//       <RouterProvider router={browserRouterObj}/>
//     </AuthContext>
//   </StrictMode>,
// )
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import ExpertPage from './components/pages/ExpertPage.jsx'
import AuthContext from './contexts/AuthContext.jsx'
import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './components/Common/RootLayout.jsx';
import Home from './components/pages/Home.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Dashboard from './components/Common/Dashboard.jsx';
import ExploreExperts from './components/pages/ExploreExperts.jsx'
import ExpertProfile from './components/pages/ExpertProfile.jsx'

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
      },
      {
        path:`expert-details/:expertId`,
        element:<ExpertPage/>
      }, 
      {
        path:'explore-experts', 
        element:<ExploreExperts/>
      },
      {
        path:'edit-profile',
        element:<ExpertProfile/>
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