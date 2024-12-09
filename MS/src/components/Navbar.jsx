import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/report', label: 'Report Issue' },
    { path: '/schedule', label: 'Collection Schedule' },
    { path: '/special-requests', label: 'Special Pickup' },
    // { path: '/my-reports', label: 'My Reports' },
    // { path: '/education', label: 'Recycling Guide' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Waste Management
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
