import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FacultyPortal from './pages/falcutyportal.tsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  { path: '/faculty', element: <FacultyPortal /> },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
