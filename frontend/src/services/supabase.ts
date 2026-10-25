import { createClient } from '@supabase/supabase-js';
import { ApplicationSession } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://klxmoqyargqzbvyzvqfi.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtseG1vcXlhcmdxemJ2eXp2cWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDIxMjksImV4cCI6MjEwODQ3ODEyOX0._t1NPd8c5qlLHOUOOBObFdgA5FftYk5WK48HV9oHmp8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database Operations for Multi-User Cloud Sessions
export async function fetchUserSessionsFromCloud(userId: string): Promise<ApplicationSession[]> {
  try {
    const { data, error } = await supabase
      .from('application_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch sessions:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      updated_at: row.updated_at || new Date().toISOString(),
      job_title: row.job_title,
      company_name: row.company_name,
      job_description: row.job_description,
      resume_text: row.raw_resume || '',
      resume_filename: 'uploaded_resume.txt',
      clarification_answers: {},
      analysis: row.analysis || undefined,
      tailored_resume: row.tailored_resume || undefined,
      company_research: row.company_research || undefined,
      interview_prep: row.interview_prep || undefined,
      checklist: row.checklist || [],
    }));
  } catch (err) {
    console.error('[Supabase] Error fetching sessions:', err);
    return [];
  }
}

export async function saveUserSessionToCloud(session: ApplicationSession, userId: string): Promise<boolean> {
  try {
    const payload = {
      id: session.id,
      user_id: userId,
      job_title: session.job_title || 'Target Role',
      company_name: session.company_name || 'Target Company',
      job_description: session.job_description,
      raw_resume: session.resume_text || '',
      status: 'active',
      analysis: session.analysis || {},
      tailored_resume: session.tailored_resume || {},
      company_research: session.company_research || {},
      interview_prep: session.interview_prep || {},
      checklist: session.checklist || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('application_sessions')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error saving session to cloud:', err);
    return false;
  }
}

export async function deleteUserSessionFromCloud(sessionId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('application_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      console.warn('[Supabase] Delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Error deleting session:', err);
    return false;
  }
}
