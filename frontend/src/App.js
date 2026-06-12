import StaffLogin from './pages/StaffLogin';
import StaffDashboard from './pages/StaffDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import WastePickup from './pages/WastePickup';
import Rewards from './pages/Rewards';
import CompostGuide from './pages/CompostGuide';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <Navbar />
                    <main className="flex-grow-1">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/staff-login" element={<StaffLogin />} />
                            <Route path="/staff-dashboard" element={<StaffDashboard />} />
                            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                            <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
                            <Route path="/compost-guide" element={<ProtectedRoute><CompostGuide /></ProtectedRoute>} />
                            <Route path="/waste-pickup" element={<ProtectedRoute><WastePickup /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;