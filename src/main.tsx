import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FacultyPortal from './pages/falcutyportal.tsx';
import ClaimPortal from './pages/claimportal.tsx';  
import Overview from './pages/overview.tsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  { path: '/faculty', element: <FacultyPortal /> },
  { path: '/claims', element: <ClaimPortal /> },
  { path: '/overview', element: <Overview /> },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
