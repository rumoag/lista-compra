-- Lista de la Compra Compartida — Esquema de datos (Unidad 1)
-- Ejecutar en el SQL Editor de Supabase (o vía CLI/migraciones) sobre un proyecto nuevo.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tabla: households
-- ---------------------------------------------------------------------------
create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table households enable row level security;

-- RLS permisivo (ver aidlc-docs/construction/unidad-1/nfr-design/nfr-design-patterns.md):
-- sin autenticación, el aislamiento real es la obscuridad del UUID del household.
-- Estas políticas solo evitan el estado por defecto inseguro de "sin políticas = sin acceso".
create policy households_select on households for select using (true);
create policy households_insert on households for insert with check (true);
create policy households_update on households for update using (true) with check (true);
create policy households_delete on households for delete using (true);

-- ---------------------------------------------------------------------------
-- Tabla: products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  name text not null,
  category text,
  quantity text,
  status text not null default 'pending',
  added_by text not null,
  created_at timestamptz not null default now(),
  bought_by text,
  bought_at timestamptz,

  -- BR-1: nombre obligatorio, máx 50 caracteres, solo letras/números/espacios/acentos
  constraint products_name_length check (char_length(name) between 1 and 50),
  constraint products_name_format check (name ~ '^[[:alpha:][:digit:] ]+$'),

  -- BR-2: límites de longitud para cantidad y categoría (opcionales)
  constraint products_category_length check (category is null or char_length(category) <= 40),
  constraint products_quantity_length check (quantity is null or char_length(quantity) <= 50),

  -- BR-5: estado válido
  constraint products_status_valid check (status in ('pending', 'bought'))
);

-- Índice para paginación por cursor (created_at) dentro de un household
create index if not exists products_household_created_idx
  on products (household_id, created_at desc);

alter table products enable row level security;

create policy products_select on products for select using (true);
create policy products_insert on products for insert with check (true);
create policy products_update on products for update using (true) with check (true);
create policy products_delete on products for delete using (true);

-- ---------------------------------------------------------------------------
-- Realtime (Unidad 2) — necesario para que Supabase emita eventos
-- postgres_changes (INSERT/UPDATE/DELETE) sobre products.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table products;

-- ---------------------------------------------------------------------------
-- Unidad 5 — título e icono de lista (households pasa a mostrarse en un
-- listado de "listas activas" en la pantalla de inicio, ver BR-24/BR-25/BR-26)
-- ---------------------------------------------------------------------------
alter table households add column if not exists title text;
alter table households add column if not exists image_icon text;

-- BR-26: backfill de listas creadas antes de este cambio
update households set title = 'Lista sin nombre' where title is null;
update households set image_icon = '🛒' where image_icon is null;

alter table households alter column title set not null;
alter table households alter column image_icon set not null;

-- BR-24: título obligatorio, máx 50 caracteres (cualquier carácter permitido)
alter table households add constraint households_title_length check (char_length(title) between 1 and 50);

-- BR-25: icono debe pertenecer al set cerrado definido en domain-entities.md
alter table households add constraint households_image_icon_valid
  check (image_icon in ('🛒', '🥦', '🧴', '🍞', '🥛', '🧻', '🍎', '🧀', '🍗', '🧃', '🏠', '📦'));

-- ---------------------------------------------------------------------------
-- Unidad 6 — cantidad numérica en productos (products.quantity, texto libre,
-- se sustituye por quantity_number + quantity_unit, ver BR-35/BR-36/BR-37).
-- ⚠️ Migración destructiva: si ya tienes datos en producción, ejecuta SOLO este
-- bloque (no el archivo completo) en el SQL Editor de Supabase.
-- ---------------------------------------------------------------------------
alter table products add column if not exists quantity_number integer;
alter table products add column if not exists quantity_unit text;

-- BR-37: migración best-effort del texto libre existente en quantity.
-- Si empieza por dígitos, se extraen como quantity_number (tope 999) y el resto
-- de texto (recortado) pasa a quantity_unit; si no, quantity_number = 1 y todo
-- el texto original pasa a quantity_unit.
update products
set
  quantity_number = least(
    coalesce(nullif(substring(trim(quantity) from '^[0-9]+'), '')::integer, 1),
    999
  ),
  quantity_unit = nullif(trim(substring(trim(quantity) from '^[0-9]*\s*(.*)$')), '')
where quantity_number is null;

update products set quantity_number = 1 where quantity_number is null;

alter table products alter column quantity_number set default 1;
alter table products alter column quantity_number set not null;

-- BR-35: cantidad entre 1 y 999
alter table products add constraint products_quantity_number_range check (quantity_number between 1 and 999);

-- BR-36: unidad opcional, máx 20 caracteres
alter table products add constraint products_quantity_unit_length check (quantity_unit is null or char_length(quantity_unit) <= 20);

-- Elimina la columna y el constraint de longitud de la Unidad 1 asociado a ella
alter table products drop column quantity;
