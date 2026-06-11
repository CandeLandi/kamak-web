// Forma pública de una obra, tal como la devuelve el endpoint del ERP Kamak
// GET /api/public/obras (whitelist sanitizada — sin costos/márgenes/cliente).
// Es la fuente de verdad de la web pública (reemplaza el dataset estático
// js/obras-data.js del mockup y los "projects" de api.rakium.dev).
export interface ObraWebFoto {
  url: string;
  caption: string;
}

export interface ObraWeb {
  slug: string;
  titulo: string;
  nombre: string;
  localidad: string;
  provincia: string;
  marca: string;        // formato: Shop Express / Super 7 / ...
  categoria: string;    // Tienda / Comercial
  m2: number | null;
  dias: number | null;
  antes: boolean;       // true => slider antes/después · false => galería
  imageBefore: string | null;
  imageAfter: string | null;
  gallery: ObraWebFoto[];
  portada: string | null;
  coords: { lat: number; lng: number } | null;
  texto: string[];
  destacada: boolean;
  orden: number;
  fechaFin: string | null;
}
