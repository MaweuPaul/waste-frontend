import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import Schedule from './pages/Schedule';
import SpecialRequests from './pages/SpecialRequests';
import MyReports from './pages/MyReports';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/special-requests" element={<SpecialRequests />} />
            <Route path="/my-reports" element={<MyReports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
