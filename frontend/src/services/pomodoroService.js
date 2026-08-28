import api from './api';

export const saveStudySession = async (sessionData) => {
  try {
    const response = await api.post('/study-sessions', sessionData);
    return response.data;
  } catch (error) {
    console.error('Error saving study session:', error);
    throw error;
  }
};

export const getTodaysSessions = async () => {
  try {
    // The backend returns all sessions for the user, we can filter for today
    const response = await api.get('/study-sessions');
    const allSessions = response.data;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysSessions = allSessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= today;
    });
    
    return todaysSessions;
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    return [];
  }
};

export const getSubjects = async () => {
  try {
    const response = await api.get('/subjects');
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
};
