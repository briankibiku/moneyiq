/**
 * Share utility to handle URL parameter generation and clipboard copying
 */

export const generateShareUrl = (baseUrl, params) => {
  const url = new URL(window.location.origin + baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

export const parseQueryParams = (search) => {
  const params = new URLSearchParams(search);
  const result = {};
  for (const [key, value] of params.entries()) {
    // Try to parse numbers
    const num = Number(value);
    result[key] = !isNaN(num) ? num : value;
  }
  return result;
};
