import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import BasketPage from './pages/BasketPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import DriverTrackingPage from './pages/DriverTrackingPage';
import StaffTrackingPage from './pages/StaffTrackingPage';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/driver-tracking" element={<DriverTrackingPage />} />
          <Route path="/staff" element={<StaffTrackingPage />} />
        </Routes>
      </PageTransition>
    </>
  );
}

export default App;
