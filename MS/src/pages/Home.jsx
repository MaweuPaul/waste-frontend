// Home.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[600px] mb-20"
      >
        {/* Wave Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-blue-50 to-green-50">
            {/* Animated Wave SVG */}
            <svg
              className="absolute bottom-0 w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="#ffffff"
                fillOpacity="0.1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                className="animate-wave-slow"
              />
              <path
                fill="#ffffff"
                fillOpacity="0.2"
                d="M0,192L48,176C96,160,192,128,288,144C384,160,480,224,576,240C672,256,768,224,864,197.3C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                className="animate-wave"
              />
              <path
                fill="#ffffff"
                fillOpacity="0.3"
                d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,192C672,203,768,213,864,208C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                className="animate-wave-fast"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Making Waste
                <br />
                Management
                <span className="text-green-600 block mt-2">
                  Simple & Efficient
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Join us in keeping Nyeri County clean through efficient waste
                management, community participation, and sustainable practices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <Link
                to="/report"
                className="px-8 py-4 bg-green-600 text-white text-lg rounded-xl
                    hover:bg-green-700 transition-all duration-300"
              >
                Report an Issue
              </Link>
              <Link
                to="/schedule"
                className="px-8 py-4 border-2 border-green-600 text-green-600 text-lg
                    rounded-xl hover:bg-green-50 transition-all duration-300"
              >
                View Collection Schedule
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-20 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </motion.div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Collection Rate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
              95%
            </h3>
            <p className="text-gray-600">Collection Rate</p>
          </motion.div>

          {/* Service Support Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
              5 Days
            </h3>
            <p className="text-gray-600">Weekly Service</p>
          </motion.div>

          {/* Collection Zones Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
              50+
            </h3>
            <p className="text-gray-600">Collection Zones</p>
          </motion.div>

          {/* Issues Resolved Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
              1000+
            </h3>
            <p className="text-gray-600">Issues Resolved</p>
          </motion.div>
        </div>
      </div>
      {/* Services Cards */}
      <div className="max-w-7xl mx-auto px-4 mt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Report Issue Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Report an Issue</h3>
            <p className="text-gray-600 mb-4">
              Quick and easy reporting of waste management issues in your area.
              Track the status of your reports in real-time.
            </p>
            <Link
              to="/report"
              className="text-red-600 hover:text-red-700 font-medium inline-flex items-center group"
            >
              Report Now
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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
          </motion.div>

          {/* Collection Schedule Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Collection Schedule</h3>
            <p className="text-gray-600 mb-4">
              Access your area's collection timetable, get reminders, and stay
              updated with any schedule changes.
            </p>
            <Link
              to="/schedule"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center group"
            >
              View Schedule
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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
          </motion.div>

          {/* Special Pickup Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🚛</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Special Pickup</h3>
            <p className="text-gray-600 mb-4">
              Schedule special collections for large items, hazardous waste, and
              electronic waste with ease.
            </p>
            <Link
              to="/special-requests"
              className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center group"
            >
              Request Pickup
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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
          </motion.div>
        </motion.div>
      </div>
      {/* News & Updates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 mx-auto px-4 mt-10"
      >
        <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <p className="text-sm text-green-600 mb-2">News</p>
              <h3 className="text-lg font-semibold mb-2">
                New Recycling Program Launch
              </h3>
              <p className="text-gray-600 mb-4">
                Introducing our new recycling initiative to improve waste
                separation...
              </p>
              <Link to="/news/1" className="text-blue-600 hover:text-blue-700">
                Read More →
              </Link>
            </div>
          </div>

          {/* Add more news items */}
        </div>
      </motion.div>

      {/* Enhanced Guidelines Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 animate-bounce">
              ♻️
            </span>
            Waste Separation Guide
          </h3>
          <ul className="space-y-4">
            {[
              'Separate recyclables from general waste',
              'Clean containers before recycling',
              'Flatten cardboard boxes',
              'Use designated bins for different types of waste',
              'Compost organic waste when possible',
              'Properly dispose of hazardous materials',
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                <span className="text-gray-600">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              📋
            </span>
            Collection Guidelines
          </h3>
          <ul className="space-y-4">
            {[
              'Place bins out by 6 AM on collection day',
              'Keep bin lids closed to prevent spillage',
              'Ensure easy access for collection vehicles',
              'Report missed collections within 24 hours',
              'Maintain clean bin storage areas',
              'Follow weight limits for bins',
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span className="text-gray-600">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: 'When is my collection day?',
              a: "Check the Collection Schedule section for your area's specific collection days.",
            },
            {
              q: 'How do I report illegal dumping?',
              a: 'Use the Report an Issue feature to notify us about illegal dumping in your area.',
            },
            {
              q: 'What items need special pickup?',
              a: 'Large furniture, electronic waste, and hazardous materials require special pickup arrangements.',
            },
            {
              q: 'How can I get a new waste bin?',
              a: 'Contact our office through the provided channels to request a new waste bin.',
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Enhanced Contact Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                📍
              </span>
              Contact Us
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>Department of Environment & Sanitation</li>
              <li>Nyeri County Government</li>
              <li>P.O. Box 1112-10100</li>
              <li>Nyeri, Kenya</li>
            </ul>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                ☎️
              </span>
              Emergency Contacts
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>Hotline: 0800-724-242</li>
              <li>Email: waste@nyeri.go.ke</li>
              <li>WhatsApp: +254 712 345678</li>
            </ul>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                🕒
              </span>
              Working Hours
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>Monday - Friday: 8:00 AM - 5:00 PM</li>
              <li>Saturday: 8:00 AM - 1:00 PM</li>
              <li>Emergency services available 24/7</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
