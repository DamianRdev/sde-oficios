import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. " +
    "Copiá tu .env.local y completá los valores de tu proyecto Supabase."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Cliente sin tipos estrictos para operaciones de escritura del panel admin
// (inserts/updates con campos dinámicos)
export const db = createClient(supabaseUrl, supabaseAnonKey);

