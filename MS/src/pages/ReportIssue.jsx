import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import LocationMap from '../components/LocationMap';
import api from '../utils/api';
import {
  validateFile,
  createObjectURL,
  revokeObjectURL,
} from '../utils/fileUtils.';
import {
  INCIDENT_TYPES,
  PRIORITY_LEVELS,
  PRIORITY_STYLES,
} from '../utils/constants';

const initialFormState = {
  type: '',
  description: '',
  location: null,
  photos: [],
  priority: 'MEDIUM',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
};

function ReportIssue() {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState([]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePhotoChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const remainingSlots = 5 - formData.photos.length;

      if (remainingSlots === 0) {
        toast.error('Maximum 5 photos allowed');
        return;
      }

      const validFiles = [];
      const newPreviews = [];

      files.slice(0, remainingSlots).forEach((file) => {
        const validation = validateFile(file);
        if (validation.isValid) {
          validFiles.push(file);
          newPreviews.push(createObjectURL(file));
        } else {
          toast.error(validation.error);
        }
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...validFiles],
        }));
        setPhotoPreview((prev) => [...prev, ...newPreviews]);
      }
    },
    [formData.photos.length]
  );

  const handleRemovePhoto = useCallback(
    (index) => {
      setFormData((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      }));

      revokeObjectURL(photoPreview[index]);
      setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
    },
    [photoPreview]
  );

  const validateForm = useCallback(() => {
    if (!formData.type) {
      toast.error('Please select an issue type');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please provide a description');
      return false;
    }
    if (!formData.location) {
      toast.error('Please select a location on the map');
      return false;
    }
    if (!formData.contactName.trim() || !formData.contactPhone.trim()) {
      toast.error('Please provide contact information');
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const form = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photos' || key === 'location') return;
        form.append(key, value);
      });

      // Append location as JSON
      form.append('location', JSON.stringify(formData.location));

      // Append photos
      formData.photos.forEach((photo) => {
        form.append('photos', photo);
      });

      await api.post('/incidents', form);

      toast.success('Issue reported successfully!');

      // Reset form
      setFormData(initialFormState);

      // Clear photo previews
      photoPreview.forEach(revokeObjectURL);
      setPhotoPreview([]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Issue Type */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {INCIDENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.type === type.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl mb-1">{type.icon}</span>
                  <span className="block text-sm font-medium">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
              placeholder="Please provide detailed information about the issue..."
            />
          </div>

          {/* Priority & Photos */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-6">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {PRIORITY_LEVELS.map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handleInputChange('priority', priority)}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        formData.priority === priority
                          ? PRIORITY_STYLES[priority].selected
                          : PRIORITY_STYLES[priority].default
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Max 5)
                </label>
                <div className="space-y-4">
                  {photoPreview.length < 5 && (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-all cursor-pointer">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                            <span>Upload photos</span>
                            <input
                              type="file"
                              multiple
                              className="sr-only"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              disabled={isSubmitting}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB ({5 - photoPreview.length}{' '}
                          remaining)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Photo previews */}
                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            disabled={isSubmitting}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {preview.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange('contactName', e.target.value)
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange('contactPhone', e.target.value)
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange('contactEmail', e.target.value)
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>

        {/* Map Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Select Location on Map</h2>
          <LocationMap
            onLocationSelect={(location) =>
              handleInputChange('location', location)
            }
          />
        </div>
      </div>
    </form>
  );
}

export default ReportIssue;
