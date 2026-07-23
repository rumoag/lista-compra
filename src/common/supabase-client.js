// Import por URL directa (en vez de bare specifier + import map) — más compatible entre
// entornos de despliegue, sin depender del soporte de import maps del navegador/CDN.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.8';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.generated.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
