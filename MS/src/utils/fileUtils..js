export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File ${file.name} is too large (max 10MB)`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File ${file.name} is not a supported image format`,
    };
  }

  return { isValid: true };
};

export const createObjectURL = (file) => ({
  url: URL.createObjectURL(file),
  name: file.name,
});

export const revokeObjectURL = (preview) => {
  if (preview?.url) {
    URL.revokeObjectURL(preview.url);
  }
};
