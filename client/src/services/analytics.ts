import { apiFetch } from './api';

const getSessionId = () => {
  let sid = localStorage.getItem('kisan_session_id');
  if (!sid) {
    sid = 'sess-' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('kisan_session_id', sid);
  }
  return sid;
};

/**
 * Enterprise Analytics Tracker
 * (Anonymous & Privacy-First)
 */
export const trackEvent = async (
  eventType: string, 
  metadata: { district?: string; crop?: string } = {}
): Promise<void> => {
  try {
    await apiFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        event_type: eventType,
        district: metadata.district,
        crop: metadata.crop,
        session_id: getSessionId(),
        platform: window.navigator.userAgent.includes('Android') ? 'android' : 'web'
      })
    });
  } catch (e) {
    // Fail silently to never block user experience
  }
};
