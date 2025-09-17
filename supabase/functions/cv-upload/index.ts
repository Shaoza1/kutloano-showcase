import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
};

const ADMIN_KEY = Deno.env.get('ADMIN_DASHBOARD_KEY') ?? 'portfolio_admin_2024';

interface Database {
  public: {
    Tables: {
      cv_management: {
        Row: {
          id: string;
          filename: string;
          file_path: string;
          upload_date: string;
          is_active: boolean;
          version: number;
          file_size: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          filename: string;
          file_path: string;
          is_active?: boolean;
          version?: number;
          file_size?: number;
        };
        Update: {
          is_active?: boolean;
        };
      };
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'GET') {
      // Get active CV for download
      const { data: activeCV, error } = await supabaseClient
        .from('cv_management')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error || !activeCV) {
        return new Response(
          JSON.stringify({ error: 'No active CV found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get the file from storage
      const { data: fileData, error: downloadError } = await supabaseClient.storage
        .from('cv-files')
        .download(activeCV.file_path);

      if (downloadError || !fileData) {
        return new Response(
          JSON.stringify({ error: 'Failed to download CV file' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Track download
      await supabaseClient.from('cv_downloads').insert({
        download_type: 'pdf',
        user_agent: req.headers.get('user-agent'),
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || 
                   req.headers.get('x-real-ip') || 
                   'unknown'
      });

      return new Response(fileData, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${activeCV.filename}"`,
        },
      });
    }

    if (req.method === 'POST') {
      // Upload new CV
      const adminHeader = req.headers.get('x-admin-key');
      if (adminHeader !== ADMIN_KEY) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const formData = await req.formData();
      const file = formData.get('file') as File;
      const makeActive = formData.get('makeActive') === 'true';

      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No file provided' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check file type
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        return new Response(
          JSON.stringify({ error: 'Invalid file type. Only PDF and Word documents are allowed.' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const fileName = `cv-${Date.now()}-${file.name}`;
      const filePath = fileName;

      // Upload file to storage
      const { error: uploadError } = await supabaseClient.storage
        .from('cv-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return new Response(
          JSON.stringify({ error: 'Failed to upload file', details: uploadError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // If making this active, deactivate all others first
      if (makeActive) {
        await supabaseClient
          .from('cv_management')
          .update({ is_active: false })
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all rows
      }

      // Get the next version number
      const { data: latestCV } = await supabaseClient
        .from('cv_management')
        .select('version')
        .order('version', { ascending: false })
        .limit(1);

      const nextVersion = (latestCV?.[0]?.version || 0) + 1;

      // Save CV metadata
      const { data, error: insertError } = await supabaseClient
        .from('cv_management')
        .insert({
          filename: file.name,
          file_path: filePath,
          is_active: makeActive,
          version: nextVersion,
          file_size: file.size
        })
        .select()
        .single();

      if (insertError) {
        // Clean up uploaded file if database insert fails
        await supabaseClient.storage.from('cv-files').remove([filePath]);
        
        return new Response(
          JSON.stringify({ error: 'Failed to save CV metadata', details: insertError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // If this is the active CV, also copy it as current-cv.pdf for public access
      if (makeActive) {
        const { data: fileData } = await supabaseClient.storage
          .from('cv-files')
          .download(filePath);

        if (fileData) {
          await supabaseClient.storage
            .from('cv-files')
            .upload('current-cv.pdf', fileData, {
              cacheControl: '3600',
              upsert: true
            });
        }
      }

      return new Response(
        JSON.stringify({ 
          message: 'CV uploaded successfully', 
          cv: data 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('CV upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);