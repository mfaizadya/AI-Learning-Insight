const TOKEN_KEY = "token";
const USER_KEY = "user_data";

export const storage = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};