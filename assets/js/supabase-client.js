/* Client partagé. Aucun secret serveur ne doit être ajouté ici. */
(function initSupabaseClient() {
  if (!window.supabase || !window.APP_CONFIG) {
    window.AppSupabase = { client: null, initializationError: new Error("Supabase JS n'a pas pu être chargé.") };
    return;
  }

  const { supabaseUrl, supabasePublishableKey } = window.APP_CONFIG;
  const client = window.supabase.createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  window.AppSupabase = { client, initializationError: null };
})();
