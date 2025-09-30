const API_BASE_URL = 'https://planity-backend-xigh.onrender.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token;
    }
    return null;
  }

  // Create request headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Network error occurred' 
      }));
      throw new Error(errorData.message || 'API request failed');
    }
    return response.json();
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Tasks methods
  async getTasks(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return this.request(endpoint);
  }

  async getTask(id) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async completeTask(id) {
    return this.request(`/tasks/${id}/complete`, {
      method: 'POST',
    });
  }

  async getOverdueTasks() {
    return this.request('/tasks/overdue');
  }

  // Timetable methods
  async getTimetable(dayOfWeek = null) {
    const endpoint = dayOfWeek ? `/timetable?dayOfWeek=${dayOfWeek}` : '/timetable';
    return this.request(endpoint);
  }

  async createTimetableEntry(entryData) {
    return this.request('/timetable', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async updateTimetableEntry(id, entryData) {
    return this.request(`/timetable/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  }

  async deleteTimetableEntry(id) {
    return this.request(`/timetable/${id}`, {
      method: 'DELETE',
    });
  }

  async getWeekTimetable() {
    return this.request('/timetable/week/current');
  }

  // Reminders methods
  async getReminders() {
    return this.request('/reminders');
  }

  async getUpcomingReminders(hours = 24) {
    return this.request(`/reminders/upcoming?hours=${hours}`);
  }

  async createReminder(reminderData) {
    return this.request('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  }

  async updateReminder(id, reminderData) {
    return this.request(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reminderData),
    });
  }

  async deleteReminder(id) {
    return this.request(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // Study Sessions methods
  async getStudySessions(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/study-sessions?${queryString}` : '/study-sessions';
    return this.request(endpoint);
  }

  async startStudySession(sessionData) {
    return this.request('/study-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async endStudySession(id, endData) {
    return this.request(`/study-sessions/${id}/end`, {
      method: 'PUT',
      body: JSON.stringify(endData),
    });
  }

  async getWeeklyStudyStats() {
    return this.request('/study-sessions/stats/weekly');
  }

  // Progress methods
  async getProgress(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/progress?${queryString}` : '/progress';
    return this.request(endpoint);
  }

  async createProgress(progressData) {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async getWeeklyProgress() {
    return this.request('/progress/stats/weekly');
  }

  // Subjects methods
  async getSubjects() {
    return this.request('/subjects');
  }

  async addSubject(subjectData) {
    return this.request('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async updateSubject(name, subjectData) {
    return this.request(`/subjects/${encodeURIComponent(name)}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  }
}

export default new ApiService();