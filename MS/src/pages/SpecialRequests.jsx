import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/';

// Validation Schema
const validationSchema = Yup.object({
  wasteType: Yup.string().required('Please select a waste type'),
  quantity: Yup.string().required('Quantity is required'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  preferredDate: Yup.date()
    .required('Please select a date')
    .min(new Date(), 'Date cannot be in the past'),
  preferredTime: Yup.string().required('Please select a time slot'),
  location: Yup.object()
    .nullable()
    .required('Please select a location on the map'),
  contactName: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  contactPhone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Invalid phone number format'),
  contactEmail: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

const wasteTypes = [
  { id: 'GENERAL', label: 'General Waste', icon: '🗑️' },
  { id: 'RECYCLABLE', label: 'Recyclable', icon: '♻️' },
  { id: 'ORGANIC', label: 'Organic Waste', icon: '🌱' },
  { id: 'HAZARDOUS', label: 'Hazardous', icon: '⚠️' },
  { id: 'E_WASTE', label: 'Electronic Waste', icon: '🖥️' },
];

const timeSlots = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
];

// Map Click Handler Component
function LocationMarker({ onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
}

function SpecialRequest() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      wasteType: '',
      quantity: '',
      description: '',
      preferredDate: null,
      preferredTime: '',
      location: null,
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setShowConfirmation(true);
    },
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }
    setSelectedFiles(files);
  };

  const handleLocationSelect = (latlng) => {
    formik.setFieldValue('location', latlng);
  };

  const handleSubmitFinal = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append form fields
      Object.keys(formik.values).forEach((key) => {
        if (key === 'location') {
          formData.append(key, JSON.stringify(formik.values[key]));
        } else if (key === 'preferredDate') {
          formData.append(key, formik.values[key].toISOString());
        } else {
          formData.append(key, formik.values[key]);
        }
      });

      // Append photos
      selectedFiles.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await axios.post(`${API_URL}specialPickup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Special pickup request submitted successfully!');
      setShowConfirmation(false);
      formik.resetForm();
      setSelectedFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, name, type = 'text', ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {formik.errors[name] && formik.touched[name] && '*'}
      </label>
      <input
        type={type}
        {...formik.getFieldProps(name)}
        {...props}
        className={`w-full px-4 py-2 rounded-lg border ${
          formik.errors[name] && formik.touched[name]
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        }`}
      />
      {formik.errors[name] && formik.touched[name] && (
        <p className="mt-1 text-sm text-red-600">{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Special Pickup Request
        </h1>
        <p className="mt-2 text-gray-600">
          Schedule a special pickup for large items or additional waste
          collection
        </p>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column */}
        <div className="space-y-6">
          {/* Waste Type Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Waste Type
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {wasteTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => formik.setFieldValue('wasteType', type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formik.values.wasteType === type.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{type.icon}</span>
                  <span className="block text-sm font-medium">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
            {formik.errors.wasteType && formik.touched.wasteType && (
              <p className="mt-2 text-sm text-red-600">
                {formik.errors.wasteType}
              </p>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Details
            </h2>
            <div className="space-y-4">
              <InputField
                label="Quantity"
                name="quantity"
                type="number"
                placeholder="Number of items"
                min="1"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...formik.getFieldProps('description')}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.errors.description && formik.touched.description
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Provide details about the items for pickup"
                />
                {formik.errors.description && formik.touched.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photos (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload up to 5 photos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Location Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pickup Location
            </h2>
            <div className="h-[300px] rounded-lg overflow-hidden mb-4">
              <MapContainer
                center={[-1.2921, 36.8219]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationMarker onLocationSelect={handleLocationSelect} />
                {formik.values.location && (
                  <Marker position={formik.values.location} />
                )}
              </MapContainer>
            </div>
            {formik.errors.location && formik.touched.location && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.location}
              </p>
            )}
          </div>

          {/* Schedule Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Preferred Schedule
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <DatePicker
                  selected={formik.values.preferredDate}
                  onChange={(date) =>
                    formik.setFieldValue('preferredDate', date)
                  }
                  minDate={new Date()}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.errors.preferredDate && formik.touched.preferredDate
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholderText="Select date"
                />
                {formik.errors.preferredDate &&
                  formik.touched.preferredDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.preferredDate}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <select
                  {...formik.getFieldProps('preferredTime')}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.errors.preferredTime && formik.touched.preferredTime
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {formik.errors.preferredTime &&
                  formik.touched.preferredTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.preferredTime}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <InputField label="Full Name" name="contactName" />
              <InputField label="Phone Number" name="contactPhone" type="tel" />
              <InputField label="Email" name="contactEmail" type="email" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Request Pickup
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Request</h2>

            <div className="space-y-2">
              <div>
                <span className="font-medium">Waste Type:</span>{' '}
                {
                  wasteTypes.find((t) => t.id === formik.values.wasteType)
                    ?.label
                }
              </div>
              <div>
                <span className="font-medium">Quantity:</span>{' '}
                {formik.values.quantity}
              </div>
              <div>
                <span className="font-medium">Pickup Date:</span>{' '}
                {formik.values.preferredDate?.toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Time Slot:</span>{' '}
                {formik.values.preferredTime}
              </div>
              <div>
                <span className="font-medium">Photos:</span>{' '}
                {selectedFiles.length} selected
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Edit Request
              </button>
              <button
                type="button"
                onClick={handleSubmitFinal}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecialRequest;
