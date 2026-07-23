// Genera src/common/config.generated.js a partir de variables de entorno en build time.
// Localmente lee .env si existe (parser mínimo, sin dependencias); en Vercel las variables
// ya llegan inyectadas directamente en process.env (no hay archivo .env), así que ese paso
// se omite sin error. Ver aidlc-docs/construction/unidad-1/infrastructure-design/.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';

function loadDotEnvIfPresent(path = '.env') {
  if (!existsSync(path)) return;

  const contents = readFileSync(path, 'utf8');
  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnvIfPresent();

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_ANON_KEY. ' +
      'Configúralas en tu .env local (ver .env.example) o en las variables de entorno de Vercel.'
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
