import { RegisterFormData } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';
const API_URL = `${API_BASE_URL}/auth`;

export const registerUser = async (userData: RegisterFormData) => {
  try {
    // Calculate age from date of birth
    const dob = new Date(userData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Prepare data for backend
    const backendData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      age: age,
      gender: userData.gender || 'other', // Default to 'other' if not provided
      state: userData.state || 'Not specified',
      district: userData.district || 'Not specified',
      village_city: userData.city || 'Not specified',
      conditions: userData.conditions || [],
      preferred_language: userData.preferredLanguage || 'hindi'
    };

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Vitals API functions
export const logVitals = async (vitalsData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vitals/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vitalsData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to log vitals');
    }
    
    return data;
  } catch (error) {
    console.error('Vitals logging error:', error);
    throw error;
  }
};

export const getUserVitals = async (userId: number, days: number = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vitals/user/${userId}?days=${days}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch vitals');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch vitals error:', error);
    throw error;
  }
};

export const getLatestVitals = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vitals/user/${userId}/latest`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch latest vitals');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch latest vitals error:', error);
    throw error;
  }
};

export const getVitalsStats = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vitals/user/${userId}/stats`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch vitals statistics');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch vitals stats error:', error);
    throw error;
  }
};

// Reminders API functions
export const createReminder = async (reminderData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reminders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create reminder');
    }
    
    return data;
  } catch (error) {
    console.error('Create reminder error:', error);
    throw error;
  }
};

export const getUserReminders = async (userId: number, activeOnly: boolean = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reminders/user/${userId}?active_only=${activeOnly}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch reminders');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch reminders error:', error);
    throw error;
  }
};

export const updateReminder = async (reminderId: number, reminderData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update reminder');
    }
    
    return data;
  } catch (error) {
    console.error('Update reminder error:', error);
    throw error;
  }
};

export const deleteReminder = async (reminderId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete reminder');
    }
    
    return data;
  } catch (error) {
    console.error('Delete reminder error:', error);
    throw error;
  }
};

// User API functions
export const getUser = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch user error:', error);
    throw error;
  }
};

export const updateUser = async (userId: number, userData: any) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update user');
    }
    
    return data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};