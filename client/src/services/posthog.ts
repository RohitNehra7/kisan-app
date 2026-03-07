import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.REACT_APP_POSTHOG_KEY;
const POSTHOG_HOST = process.env.REACT_APP_POSTHOG_HOST || 'https://app.posthog.com';

const isEnabled = !!POSTHOG_KEY && POSTHOG_KEY !== 'phc_mock_key';

export const initPostHog = () => {
  if (typeof window !== 'undefined' && isEnabled) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
      capture_pageview: true,
      persistence: 'localStorage',
    });
  }
};

export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (isEnabled) {
    posthog.capture(eventName, properties);
  } else {
    console.log(`[PostHog Mock] Event: ${eventName}`, properties);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (isEnabled) {
    posthog.identify(userId, properties);
  } else {
    console.log(`[PostHog Mock] Identify User: ${userId}`, properties);
  }
};
