/**
 * Authentication & Session Management Module
 */

const AUTH_STORAGE_KEY = "gourmet_chef_auth_session";

const DEFAULT_CHEF_USER = {
  email: "chef@gourmet.com",
  password: "chef123",
  name: "Chef Alexander Vance",
  title: "Executive Chef & Kitchen Manager",
  restaurant: "L'Étoile Gourmet Bistro",
  avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80"
};

const AuthService = {
  getCurrentUser() {
    const session = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  login(email, password, remember = true) {
    const cleanEmail = email.trim().toLowerCase();

    // Validate credentials (allows default chef account or any valid email/password combination for flexibility)
    if ((cleanEmail === "chef@gourmet.com" || cleanEmail === "admin") && password === "chef123") {
      const userSession = {
        ...DEFAULT_CHEF_USER,
        loginTime: new Date().toISOString()
      };
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
      }
      return { success: true, user: userSession };
    } else if (cleanEmail.length >= 3 && password.length >= 3) {
      // Demo flexibility: custom manager login
      const userSession = {
        email: cleanEmail,
        name: cleanEmail.split('@')[0].toUpperCase() + " (Manager)",
        title: "Chef Manager",
        restaurant: "L'Étoile Gourmet Bistro",
        avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
        loginTime: new Date().toISOString()
      };
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
      }
      return { success: true, user: userSession };
    } else {
      return { success: false, error: "Invalid credentials. Use email: chef@gourmet.com & pass: chef123" };
    }
  },

  logout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
