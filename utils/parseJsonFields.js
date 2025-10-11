// utils/parseJsonFields.js
module.exports = function parseJsonFields(obj) {
  const parsed = {};

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      try {
        // Try to parse stringified JSON
        parsed[key] = JSON.parse(obj[key]);
      } catch (e) {
        // If not JSON, keep original string
        parsed[key] = obj[key];
      }
    } else if (Array.isArray(obj[key])) {
      parsed[key] = obj[key].map((item) => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        }
        return item;
      });
    } else {
      parsed[key] = obj[key];
    }
  }

  return parsed;
};
