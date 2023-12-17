import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import App2 from "./App2.jsx";
import Menu from "./component/Menu.jsx"
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/friendcardgame",
        element: <App2 />,
    },
    {
        path: "/test",
        element: <Menu />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
