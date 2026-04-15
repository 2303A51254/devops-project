import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminBookingsPage from './pages/admin/AdminBookingsPage.jsx';
import AdminContentPage from './pages/admin/AdminContentPage.jsx';
import AdminCustomersPage from './pages/admin/AdminCustomersPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminRoomsPage from './pages/admin/AdminRoomsPage.jsx';
import AvailabilityPage from './pages/admin/AvailabilityPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import BookingPage from './pages/public/BookingPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import GalleryPage from './pages/public/GalleryPage.jsx';
import HomePage from './pages/public/HomePage.jsx';
import MyBookingsPage from './pages/public/MyBookingsPage.jsx';
import RoomDetailsPage from './pages/public/RoomDetailsPage.jsx';
import RoomsPage from './pages/public/RoomsPage.jsx';

const AdminGuard = () => (
  <ProtectedRoute requireAdmin>
    <AdminLayout />
  </ProtectedRoute>
);

const AccountGuard = () => (
  <ProtectedRoute>
    <MyBookingsPage />
  </ProtectedRoute>
);

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:slug" element={<RoomDetailsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/my-bookings'} replace /> : <LoginPage />}
        />
        <Route path="/signup" element={user ? <Navigate to="/my-bookings" replace /> : <SignupPage />} />
        <Route path="/my-bookings" element={<AccountGuard />} />
      </Route>

      <Route path="/admin" element={<AdminGuard />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="rooms" element={<AdminRoomsPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="content" element={<AdminContentPage />} />
      </Route>
    </Routes>
  );
}

export default App;
