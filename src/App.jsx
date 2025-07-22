import { useEffect } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './services/UserContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
      <UserProvider>
        <Router>
          <Routes>          
              <Route path='/*' element={<AppRoutes/>}/>
          </Routes>
          <ForceRedirect/>
        </Router>
      </UserProvider>
  );
}

function ForceRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {    
    console.log('location', location.pathname);
    const isCallbackRoute = location.pathname.startsWith('/google/callback') 
      || location.pathname.startsWith('/signup') || location.pathname === '/'; 
    if (!isCallbackRoute) {
      navigate('/');
    }
  }, []);

  return null;
}

export default App
