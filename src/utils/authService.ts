// Auth service to bridge between axios interceptor and AuthContext
let forceLogoutCallback: (() => void) | null = null;

export const setForceLogoutCallback = (callback: () => void) => {
  forceLogoutCallback = callback;
};

export const forceLogout = () => {
  if (forceLogoutCallback) {
    forceLogoutCallback();
  } else {
    // Fallback if callback not set
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

