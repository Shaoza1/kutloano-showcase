import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const timeframe = url.searchParams.get('timeframe') || '7d';
    
    let dateFilter = '';
    const now = new Date();
    
    switch(timeframe) {
      case '24h':
        dateFilter = `created_at >= '${new Date(now.getTime() - 24*60*60*1000).toISOString()}'`;
        break;
      case '7d':
        dateFilter = `created_at >= '${new Date(now.getTime() - 7*24*60*60*1000).toISOString()}'`;
        break;
      case '30d':
        dateFilter = `created_at >= '${new Date(now.getTime() - 30*24*60*60*1000).toISOString()}'`;
        break;
      default:
        dateFilter = `created_at >= '${new Date(now.getTime() - 7*24*60*60*1000).toISOString()}'`;
    }

    // Get page views analytics
    const { data: pageViews, error: pageViewsError } = await supabaseClient
      .from('site_analytics')
      .select('event_type, event_data, created_at')
      .eq('event_type', 'page_view')
      .gte('created_at', new Date(now.getTime() - (timeframe === '24h' ? 24*60*60*1000 : timeframe === '7d' ? 7*24*60*60*1000 : 30*24*60*60*1000)).toISOString());

    // Get contact form submissions
    const { data: contactSubmissions, error: contactError } = await supabaseClient
      .from('contact_submissions')
      .select('created_at, status')
      .gte('created_at', new Date(now.getTime() - (timeframe === '24h' ? 24*60*60*1000 : timeframe === '7d' ? 7*24*60*60*1000 : 30*24*60*60*1000)).toISOString());

    // Get CV downloads
    const { data: cvDownloads, error: cvError } = await supabaseClient
      .from('cv_downloads')
      .select('created_at, download_type')
      .gte('created_at', new Date(now.getTime() - (timeframe === '24h' ? 24*60*60*1000 : timeframe === '7d' ? 7*24*60*60*1000 : 30*24*60*60*1000)).toISOString());

    // Get project interactions
    const { data: projectInteractions, error: projectError } = await supabaseClient
      .from('project_interactions')
      .select('project_id, interaction_type, created_at, metadata')
      .gte('created_at', new Date(now.getTime() - (timeframe === '24h' ? 24*60*60*1000 : timeframe === '7d' ? 7*24*60*60*1000 : 30*24*60*60*1000)).toISOString());

    // Get visitor analytics
    const { data: visitorAnalytics, error: visitorError } = await supabaseClient
      .from('visitor_analytics')
      .select('*')
      .gte('created_at', new Date(now.getTime() - (timeframe === '24h' ? 24*60*60*1000 : timeframe === '7d' ? 7*24*60*60*1000 : 30*24*60*60*1000)).toISOString());

    if (pageViewsError || contactError || cvError || projectError || visitorError) {
      throw new Error('Failed to fetch analytics data');
    }

    // Process and aggregate data
    const analytics = {
      summary: {
        totalPageViews: pageViews?.length || 0,
        totalContacts: contactSubmissions?.length || 0,
        totalCVDownloads: cvDownloads?.length || 0,
        totalProjectInteractions: projectInteractions?.length || 0,
        uniqueVisitors: visitorAnalytics?.length || 0
      },
      pageViews: pageViews?.map(pv => ({
        page: pv.event_data?.page,
        timestamp: pv.created_at
      })) || [],
      contactSubmissions: contactSubmissions?.map(cs => ({
        status: cs.status,
        timestamp: cs.created_at
      })) || [],
      cvDownloads: cvDownloads?.map(cd => ({
        type: cd.download_type,
        timestamp: cd.created_at
      })) || [],
      projectInteractions: projectInteractions?.reduce((acc: any, pi) => {
        const projectId = pi.project_id;
        if (!acc[projectId]) {
          acc[projectId] = {
            views: 0,
            demoClicks: 0,
            githubClicks: 0,
            likes: 0
          };
        }
        
        switch(pi.interaction_type) {
          case 'view':
            acc[projectId].views++;
            break;
          case 'demo_click':
            acc[projectId].demoClicks++;
            break;
          case 'github_click':
            acc[projectId].githubClicks++;
            break;
          case 'like':
            acc[projectId].likes++;
            break;
        }
        
        return acc;
      }, {}) || {},
      visitors: visitorAnalytics?.map(va => ({
        country: va.country,
        city: va.city,
        deviceType: va.device_type,
        browser: va.browser,
        os: va.os,
        pageViews: va.page_views,
        timeOnSite: va.time_on_site,
        timestamp: va.created_at
      })) || [],
      timeframe
    };

    return new Response(
      JSON.stringify(analytics),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch analytics', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);