import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

const PublicLayout = () => (
  <div className="app-shell">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
