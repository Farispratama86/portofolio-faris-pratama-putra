import React, { useEffect, useState } from 'react';
import PortfolioHome from './pages/PortfolioHome';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPath) => {
    if (nextPath !== window.location.pathname) {
      window.history.pushState({}, '', nextPath);
      setPath(nextPath);
      window.scrollTo(0, 0);
    }
  };

  if (path.startsWith('/admin')) {
    return <AdminPanel onNavigate={navigate} />;
  }

  return <PortfolioHome onNavigate={navigate} />;
}
