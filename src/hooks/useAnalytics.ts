import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
}

export function useAnalytics() {
  const trackEvent = useCallback(async ({ eventType, eventData }: AnalyticsEvent) => {
    try {
      await supabase.functions.invoke("track-analytics", {
        body: { eventType, eventData }
      });
    } catch (error) {
      console.error("Failed to track analytics event:", error);
    }
  }, []);

  const trackPageView = useCallback((page: string) => {
    trackEvent({
      eventType: "page_view",
      eventData: { page }
    });
  }, [trackEvent]);

  const trackProjectView = useCallback((projectId: string, projectTitle: string) => {
    trackEvent({
      eventType: "project_view",
      eventData: { projectId, projectTitle }
    });
  }, [trackEvent]);

  const trackCVDownload = useCallback(() => {
    trackEvent({
      eventType: "cv_download",
      eventData: { timestamp: new Date().toISOString() }
    });
  }, [trackEvent]);

  const trackContactFormSubmit = useCallback(() => {
    trackEvent({
      eventType: "contact_form_submit",
      eventData: { timestamp: new Date().toISOString() }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackProjectView,
    trackCVDownload,
    trackContactFormSubmit
  };
}