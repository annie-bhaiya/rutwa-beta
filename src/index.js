import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ProductsList } from './ProductsList';
import ProductDetail from './ProductDetail';
import { Home } from './Home';
import { Signup } from './Signup';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { Logout } from './Logout';
import ProductDetailss from './PD';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/products",
    element:<ProductsList/>
  },
  {
    path:"/signup",
    element:<Signup />
  },
  {
    path:"/product/:id",
    element: <ProductDetailss />
  },
  {
    path:'/login',
    element: <Login />
  },
  {
    path:'/dashboard',
    element: <Dashboard />
  },
  {
    path:'/logout',
    element: <Logout />
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
);