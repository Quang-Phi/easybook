export const API_URL = 'https://qpbookingapi.site/api/';
export const API_SERVER_URL = 'https://qpbookingapi.site/';

// export const API_URL = 'http://localhost:8000/api/';
// export const API_SERVER_URL = 'http://localhost:8000';
export const componentDidMount = () => {
  document.body.style.overflow = 'hidden';
};

export const componentUnmount = () => {
  document.body.style.overflow = 'unset';
};

export const checkLinkImg = (link) => {
  if (!link || typeof link !== 'string') {
    return false;
  }

  const lowerCaseLink = link.toLowerCase();
  if (
    lowerCaseLink.startsWith('http://') ||
    lowerCaseLink.startsWith('https://')
  ) {
    return true;
  }

  return false;
};

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
};

export const flattenObject = (obj, searchParams = new URLSearchParams()) => {
  let prefix = '';
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, `${prefix}${key}.`, searchParams);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(`${prefix}${key}`, item);
      });
    } else {
      searchParams.set(`${prefix}${key}`, value);
    }
  });
};
