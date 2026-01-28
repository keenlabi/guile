export const getFileUrl = (path?: string | null): string => {
  if (!path) return '';
  
  // 1. If it's already a full URL (e.g. S3 or Cloudinary), return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 2. Get Base URL from env (fallback to empty string if not set)
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  // 3. Normalize paths to avoid double slashes (e.g. base/ + /path)
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');

  return `${cleanBase}/${cleanPath}`;
};