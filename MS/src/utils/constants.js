export const INCIDENT_TYPES = [
  { value: 'ILLEGAL_DUMPING', label: 'Illegal Dumping', icon: '🗑️' },
  { value: 'OVERFLOWING_BIN', label: 'Overflowing Bin', icon: '🚮' },
  { value: 'MISSED_COLLECTION', label: 'Missed Collection', icon: '🚛' },
  { value: 'DAMAGED_BIN', label: 'Damaged Bin', icon: '⚠️' },
  { value: 'HAZARDOUS_WASTE', label: 'Hazardous Waste', icon: '☢️' },
  { value: 'OTHER', label: 'Other Issue', icon: '❓' },
];

export const PRIORITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const PRIORITY_STYLES = {
  LOW: {
    default: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
    selected: 'bg-gray-200 text-gray-800',
  },
  MEDIUM: {
    default: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    selected: 'bg-blue-200 text-blue-800',
  },
  HIGH: {
    default: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    selected: 'bg-orange-200 text-orange-800',
  },
  URGENT: {
    default: 'bg-red-50 text-red-600 hover:bg-red-100',
    selected: 'bg-red-200 text-red-800',
  },
};
