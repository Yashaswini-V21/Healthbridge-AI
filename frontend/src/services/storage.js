export const storageService = {
  // Token management
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),

  // User management
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user'),

  // Language preference
  getLanguage: () => localStorage.getItem('language') || 'english',
  setLanguage: (language) => localStorage.setItem('language', language),

  // Search history
  getSearchHistory: () => {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  },
  addToSearchHistory: (search) => {
    const history = storageService.getSearchHistory();
    history.unshift(search);
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
  },

  // Favorites
  getFavorites: () => {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  },
  addFavorite: (hospital) => {
    const favorites = storageService.getFavorites();
    if (!favorites.find(fav => fav.id === hospital.id)) {
      favorites.push(hospital);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  },
  removeFavorite: (hospitalId) => {
    const favorites = storageService.getFavorites();
    const updated = favorites.filter(fav => fav.id !== hospitalId);
    localStorage.setItem('favorites', JSON.stringify(updated));
  },

  // Health Profile
  getHealthProfile: () => {
    const profile = localStorage.getItem('healthProfile');
    return profile ? JSON.parse(profile) : null;
  },
  setHealthProfile: (profile) => {
    localStorage.setItem('healthProfile', JSON.stringify(profile));
  },

  // Appointments
  getAppointments: () => {
    const appointments = localStorage.getItem('appointments');
    return appointments ? JSON.parse(appointments) : [];
  },
  addAppointment: (appointment) => {
    const appointments = storageService.getAppointments();
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
  },
};
