import { Link } from 'react-router-dom';
// import nyeriLogo from '../assets/nyeri-logo.png';

function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Government Header */}
      {/* <div className="flex items-center justify-between py-4 mb-8">
        <div className="flex items-center space-x-4">
          <img src={nyeriLogo} alt="Nyeri County Logo" className="h-16" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              County Government of Nyeri
            </h2>
            <p className="text-sm text-gray-600">
              Department of Environment & Sanitation
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Emergency Hotline:</p>
          <p className="text-lg font-bold text-green-600">0800-724-242</p>
        </div>
      </div> */}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-12 mb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Making Waste Management
            <span className="text-green-600 block">Simple & Efficient</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Help keep Nyeri County clean by reporting issues, tracking
            collections, and learning about proper waste management practices.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/report"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Report an Issue
            </Link>
            <Link
              to="/schedule"
              className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
            >
              View Collection Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition border border-gray-100">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Report an Issue</h3>
          <p className="text-gray-600 mb-4">
            Report illegal dumping, overflowing bins, or missed collections in
            your area.
          </p>
          <Link
            to="/report"
            className="text-red-600 hover:text-red-700 font-medium inline-flex items-center"
          >
            Report Now
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition border border-gray-100">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Collection Schedule</h3>
          <p className="text-gray-600 mb-4">
            View upcoming waste collection dates and routes for your
            neighborhood.
          </p>
          <Link
            to="/schedule"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
          >
            View Schedule
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition border border-gray-100">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <span className="text-2xl">🚛</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Special Pickup</h3>
          <p className="text-gray-600 mb-4">
            Schedule collection for bulk, hazardous, or electronic waste
            materials.
          </p>
          <Link
            to="/special-requests"
            className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center"
          >
            Request Pickup
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              ♻️
            </span>
            Waste Separation Guide
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-600">
                Separate recyclables from general waste
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-600">
                Clean containers before recycling
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-600">Flatten cardboard boxes</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-600">
                Use designated bins for different types of waste
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              📋
            </span>
            Collection Guidelines
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-600">
                Place bins out by 6 AM on collection day
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-600">
                Keep bin lids closed to prevent spillage
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-600">
                Ensure easy access for collection vehicles
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-600">
                Report missed collections within 24 hours
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-600">
              Department of Environment & Sanitation
            </p>
            <p className="text-gray-600">Nyeri County Government</p>
            <p className="text-gray-600">P.O. Box 1112-10100</p>
            <p className="text-gray-600">Nyeri, Kenya</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <p className="text-gray-600">Hotline: 0800-724-242</p>
            <p className="text-gray-600">Email: waste@nyeri.go.ke</p>
            <p className="text-gray-600">WhatsApp: +254 712 345678</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
            <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
            <p className="text-gray-600">Saturday: 8:00 AM - 1:00 PM</p>
            <p className="text-gray-600">Emergency services available 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
