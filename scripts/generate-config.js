// Genera src/common/config.generated.js a partir de variables de entorno en build time
// (Vercel: SUPABASE_URL, SUPABASE_ANON_KEY). Ver aidlc-docs/construction/unidad-1/infrastructure-design/.
import { writeFileSync, mkdirSync } from 'node:fs';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_ANON_KEY. ' +
      'Configúralas antes de ejecutar "npm run build" (ver .env.example).'
  );
  process.exit(1);
}

const content = `// Archivo generado automáticamente por scripts/generate-config.js — no editar a mano.
export const SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
export const SUPABASE_ANON_KEY = ${JSON.stringify(SUPABASE_ANON_KEY)};
`;

mkdirSync('src/common', { recursive: true });
writeFileSync('src/common/config.generated.js', content, 'utf8');
console.log('src/common/config.generated.js generado correctamente.');
