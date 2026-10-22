/**
 * Gerador das ilustrações (SVG) da landing page ESTOU BEM.
 * Uso: node tools/gen-svgs.mjs
 *
 * Desenvolvido por Agência DZ Marketing Digital
 * Desenvolvedor responsável: Doni Leite
 * © 2026 Agência DZ Marketing Digital — todos os direitos reservados
 *
 * As ilustrações são placeholders de marca. Para usar fotos reais do cliente,
 * basta gravar um arquivo com o MESMO nome e extensão .jpg (ex.:
 * assets/img/esp-dermatologia.jpg) — a página troca automaticamente
 * (ver assets/app.js -> photoFallback).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "img");
fs.mkdirSync(outDir, { recursive: true });

const BRAND = "#106858";
const BRAND_SOFT = "#74d6b9";
const SAND = "#ffe6d5";
const ACCENT = "#f05d28";
const INK = "#333947";

/* ---------------------------------------------------------------- ícones 24x24 */
const stroke = (d, extra = "") => `<path d="${d}" fill="none" stroke="${BRAND}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const fillCircle = (cx, cy, r, color = BRAND) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;

const icons = {
  clinica: [
    `<circle cx="12" cy="12" r="8.6" fill="none" stroke="${BRAND}" stroke-width="1.9"/>`,
    `<path d="M12 8.2v7.6M8.2 12h7.6" fill="none" stroke="${BRAND}" stroke-width="2.4" stroke-linecap="round"/>`,
    `<path d="M4.4 15.8c1.9 1.5 3.4 3.4 4.3 5.6" fill="none" stroke="${BRAND_SOFT}" stroke-width="1.9" stroke-linecap="round"/>`,
  ],
  dermatologia: [
    `<path d="M12 3.4c3.1 3.6 5.1 6.2 5.1 8.6a5.1 5.1 0 1 1-10.2 0c0-2.4 2-5 5.1-8.6Z" fill="none" stroke="${BRAND}" stroke-width="1.9" stroke-linejoin="round"/>`,
    `<path d="M9.6 12.6a2.4 2.4 0 0 0 2.4 2.4" fill="none" stroke="${BRAND_SOFT}" stroke-width="1.8" stroke-linecap="round"/>`,
    fillCircle(6.6, 19.4, 1.05, ACCENT),
    fillCircle(12, 20.2, 1.05, BRAND_SOFT),
    fillCircle(17.4, 19.4, 1.05, ACCENT),
  ],
  cardiologia: [
    `<path d="M12 20.4S4.6 15.9 4.6 11a4.2 4.2 0 0 1 7.4-2.7A4.2 4.2 0 0 1 19.4 11c0 4.9-7.4 9.4-7.4 9.4Z" fill="none" stroke="${BRAND}" stroke-width="1.9" stroke-linejoin="round"/>`,
    `<path d="M3.6 13.2h3.1l1.4-2.2 1.9 4.3 1.5-2.1h3.9" fill="none" stroke="${ACCENT}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  ],
  ortopedia: [
    `<path d="M3.6 20.4 9.4 14.6" fill="none" stroke="${BRAND}" stroke-width="4.2" stroke-linecap="round"/>`,
    `<path d="M14.6 9.4 20.4 3.6" fill="none" stroke="${BRAND}" stroke-width="4.2" stroke-linecap="round"/>`,
    `<circle cx="12" cy="12" r="3.3" fill="#fff" stroke="${BRAND}" stroke-width="1.9"/>`,
    `<circle cx="12" cy="12" r="1.2" fill="${BRAND_SOFT}"/>`,
  ],
  neurologia: [
    `<path d="M12 12 5.6 6.4M12 12 5.6 17.6M12 12 18.4 6.4M12 12 18.4 17.6" fill="none" stroke="${BRAND_SOFT}" stroke-width="1.7" stroke-linecap="round"/>`,
    fillCircle(5.6, 6.4, 1.9, BRAND),
    fillCircle(5.6, 17.6, 1.9, BRAND),
    fillCircle(18.4, 6.4, 1.9, BRAND),
    fillCircle(18.4, 17.6, 1.9, BRAND),
    `<circle cx="12" cy="12" r="2.9" fill="#fff" stroke="${BRAND}" stroke-width="1.9"/>`,
    fillCircle(12, 12, 1.05, ACCENT),
  ],
  pediatria: [
    `<path d="M9.4 7.2c1.8 0 2.9 1.6 2.9 4.2 0 2.5-1.1 5.8-2.9 5.8s-2.9-3.3-2.9-5.8c0-2.6 1.1-4.2 2.9-4.2Z" fill="none" stroke="${BRAND}" stroke-width="1.8"/>`,
    fillCircle(6.8, 5.4, 1.05, BRAND_SOFT),
    fillCircle(9.4, 4.5, 1.15, BRAND),
    fillCircle(12, 5.4, 1, BRAND_SOFT),
    `<path d="M16.4 10.6c1.4 0 2.2 1.3 2.2 3.2 0 1.9-.8 4.5-2.2 4.5s-2.2-2.6-2.2-4.5c0-1.9.8-3.2 2.2-3.2Z" fill="none" stroke="${BRAND_SOFT}" stroke-width="1.7"/>`,
    fillCircle(14.6, 8.6, .85, BRAND_SOFT),
    fillCircle(16.8, 8, .95, BRAND),
  ],
  endocrinologia: [
    `<path d="M12 3.6 19.1 7.7v8.6L12 20.4 4.9 16.3V7.7L12 3.6Z" fill="none" stroke="${BRAND}" stroke-width="1.9" stroke-linejoin="round"/>`,
    `<path d="M12 3.6v8.3M4.9 7.7 12 12M19.1 7.7 12 12M4.9 16.3 12 12M19.1 16.3 12 12" fill="none" stroke="${BRAND_SOFT}" stroke-width="1.4"/>`,
    `<circle cx="12" cy="12" r="2.5" fill="#fff" stroke="${BRAND}" stroke-width="1.9"/>`,
    fillCircle(12, 12, .9, ACCENT),
  ],
  nutricao: [
    `<path d="M12 20.8c-3.9 0-6.4-2.9-6.4-6.2S8.2 8.6 12 8.6s6.4 2.6 6.4 6S15.9 20.8 12 20.8Z" fill="none" stroke="${BRAND}" stroke-width="1.9"/>`,
    `<path d="M12 8.8c-.2-3.1 1.9-5.2 5.2-5.2-.1 3.1-2.1 5.2-5.2 5.2Z" fill="none" stroke="${BRAND_SOFT}" stroke-width="1.8" stroke-linejoin="round"/>`,
    `<path d="M12 8.8v3.2" fill="none" stroke="${BRAND}" stroke-width="1.8" stroke-linecap="round"/>`,
  ],
  ginecologia: [
    `<circle cx="12" cy="8" r="5" fill="none" stroke="${BRAND}" stroke-width="1.9"/>`,
    `<path d="M12 13v7.4M8.6 16.6h6.8" fill="none" stroke="${BRAND}" stroke-width="1.9" stroke-linecap="round"/>`,
    `<path d="M9.6 8.2h4.8" fill="none" stroke="${BRAND_SOFT}" stroke-width="1.5" stroke-linecap="round"/>`,
  ],
  urologia: [
    `<path d="M14.8 3.6c3.6 2.5 5.6 6.1 5.6 9.7 0 4.1-2.6 7.6-6.2 7.6-3.1 0-4.6-2.6-4.6-5.7 0-2.6 1.1-4.1 2.6-5.7 1.2-1.2 1.9-2.6 1.5-4.1-.2-1-.4-1.5.6-1.8Z" fill="none" stroke="${BRAND}" stroke-width="1.9" stroke-linejoin="round"/>`,
    `<path d="M10.8 13.6c-1 2-2.4 3-3.9 3.9" fill="none" stroke="${BRAND_SOFT}" stroke-width="1.8" stroke-linecap="round"/>`,
    fillCircle(6.2, 18.6, 1.5, BRAND_SOFT),
  ],
};

/* ------------------------------------------------------- gerador de imagem */
const svg = (inner, w, h, extra = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" role="img" ${extra}>
${inner}
</svg>
`;

/* grade de pontos via <pattern> (leve: few bytes em vez de centenas de <circle>) */
const dotsPattern = (id, color, opacity = 0.5, step = 28) => `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
  <circle cx="4" cy="4" r="1.6" fill="${color}" opacity="${opacity}"/>
</pattern>`;

const write = (file, content) => {
  fs.writeFileSync(path.join(outDir, file), content, "utf8");
  console.log("  ✓", file, `${(content.length / 1024).toFixed(1)}kb`);
};

/* ------------------------------------------------ imagem de especialidade */
const specialtyImage = (key) => {
  const W = 640;
  const H = 480;
  const art = icons[key] || icons.clinica;
  return svg(
    `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#eefbf6"/>
    <stop offset="55%" stop-color="#d3f5e8"/>
    <stop offset="100%" stop-color="#ffffff"/>
  </linearGradient>
  <linearGradient id="badge" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="100%" stop-color="#f2fbf7"/>
  </linearGradient>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0f5348" flood-opacity="0.16"/>
  </filter>
  ${dotsPattern("dots", BRAND, 0.22, 30)}
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#dots)"/>
<circle cx="${W - 40}" cy="${H - 60}" r="120" fill="${SAND}" opacity="0.55"/>
<circle cx="46" cy="52" r="70" fill="${BRAND_SOFT}" opacity="0.28"/>
<g filter="url(#shadow)">
  <rect x="${W / 2 - 132}" y="${H / 2 - 132}" width="264" height="264" rx="72" fill="url(#badge)"/>
</g>
<g transform="translate(${W / 2 - 96}, ${H / 2 - 96}) scale(8)">
  ${art.join("\n  ")}
</g>
<rect x="18" y="${H - 74}" width="${W - 36}" height="56" rx="28" fill="#ffffff" opacity="0.7"/>
<text x="${W / 2}" y="${H - 39}" text-anchor="middle" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="20" font-weight="600" fill="${BRAND}" opacity="0.85">ESPECIALIDADE</text>`,
    W,
    H,
  );
};

/* ------------------------------------------------------------- imagem hero */
const heroImage = () => {
  const W = 960;
  const H = 1080;
  return svg(
    `<defs>
  <linearGradient id="hbg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#0e453d"/>
    <stop offset="52%" stop-color="#106858"/>
    <stop offset="100%" stop-color="#1ea382"/>
  </linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.24"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.06"/>
  </linearGradient>
  <filter id="hshadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#03271f" flood-opacity="0.35"/>
  </filter>
  ${dotsPattern("hdots", "#ffffff", 0.18, 36)}
</defs>
<rect width="${W}" height="${H}" fill="url(#hbg)"/>
<rect width="${W}" height="${H}" fill="url(#hdots)"/>
<circle cx="${W - 90}" cy="150" r="180" fill="#ffffff" opacity="0.07"/>
<circle cx="90" cy="${H - 140}" r="220" fill="#ffffff" opacity="0.06"/>
<g filter="url(#hshadow)">
  <rect x="120" y="210" width="720" height="520" rx="56" fill="url(#glass)"/>
</g>
<rect x="120" y="210" width="720" height="520" rx="56" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
<g transform="translate(360, 360) scale(10)">
  ${icons.cardiologia.join("\n  ")}
</g>
<g transform="translate(190, 790)">
  <rect width="580" height="96" rx="48" fill="#ffffff" opacity="0.14"/>
  <circle cx="52" cy="48" r="22" fill="#ffffff" opacity="0.9"/>
  <path d="M43 48.5l6.5 6.5 13-14" fill="none" stroke="${BRAND}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="96" y="42" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">Cuidado completo</text>
  <text x="96" y="70" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="18" fill="#ffffff" opacity="0.82">em todas as especialidades</text>
</g>`,
    W,
    H,
  );
};

/* --------------------------------------------------------- retrato do médico */
const doctorImage = () => {
  const W = 720;
  const H = 900;
  return svg(
    `<defs>
  <linearGradient id="dbg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#d3f5e8"/>
    <stop offset="100%" stop-color="#eefbf6"/>
  </linearGradient>
  <linearGradient id="coat" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="100%" stop-color="#e6f4ef"/>
  </linearGradient>
  <filter id="dshadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f5348" flood-opacity="0.18"/>
  </filter>
  ${dotsPattern("ddots", BRAND, 0.2, 32)}
</defs>
<rect width="${W}" height="${H}" fill="url(#dbg)"/>
<rect width="${W}" height="${H}" fill="url(#ddots)"/>
<circle cx="${W / 2}" cy="${H / 2}" r="250" fill="#ffffff" opacity="0.5"/>
<g filter="url(#dshadow)">
  <path d="M180 900c0-150 78-236 180-236s180 86 180 236Z" fill="url(#coat)"/>
</g>
<path d="M330 604l30 52 30-52" fill="none" stroke="${BRAND_SOFT}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M320 690h80" fill="none" stroke="${BRAND}" stroke-width="10" stroke-linecap="round"/>
<circle cx="360" cy="450" r="128" fill="#ffffff" opacity="0.92"/>
<circle cx="360" cy="430" r="96" fill="${BRAND_SOFT}" opacity="0.35"/>
<path d="M282 430c8-58 42-88 78-88s70 30 78 88c2 16-10 26-24 22-18-5-36-9-54-9s-36 4-54 9c-14 4-26-6-24-22Z" fill="${BRAND}" opacity="0.55"/>
<path d="M300 520c-12-16-18-34-18-54 0-56 35-98 78-98s78 42 78 98c0 20-6 38-18 54" fill="none" stroke="${BRAND}" stroke-width="12" stroke-linecap="round"/>
<rect x="150" y="806" width="420" height="62" rx="31" fill="#ffffff" opacity="0.9"/>
<text x="${W / 2}" y="846" text-anchor="middle" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="${BRAND}">Dr. Humberto</text>`,
    W,
    H,
  );
};

/* ------------------------------------------------------------- logo + favicon */
const logo = () => {
  const W = 512;
  const H = 128;
  return svg(
    `<rect width="${W}" height="${H}" fill="none"/>
<g transform="translate(8, 8)">
  <rect width="112" height="112" rx="34" fill="${BRAND}"/>
  <path d="M56 30v52M30 56h52" stroke="#ffffff" stroke-width="13" stroke-linecap="round"/>
</g>
<text x="140" y="60" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="42" font-weight="800" fill="${INK}" letter-spacing="1.5">ESTOU</text>
<text x="140" y="104" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="42" font-weight="800" fill="${BRAND}" letter-spacing="1.5">BEM</text>`,
    W,
    H,
    'style="max-width:100%;height:auto"',
  );
};

const favicon = () => {
  const S = 512;
  return svg(
    `<defs>
  <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#0e453d"/>
    <stop offset="100%" stop-color="#1ea382"/>
  </linearGradient>
</defs>
<rect width="${S}" height="${S}" rx="116" fill="url(#fg)"/>
<path d="M256 118v276M118 256h276" stroke="#ffffff" stroke-width="54" stroke-linecap="round"/>`,
    S,
    S,
  );
};

/* ------------------------------------------------------------------- gerar */
console.log("gerando ilustrações em assets/img ...");
for (const key of Object.keys(icons)) {
  const file = key === "clinica" ? "esp-clinica-medica.svg" : `esp-${key}.svg`;
  write(file, specialtyImage(key));
}
write("hero.svg", heroImage());
write("dr-humberto.svg", doctorImage());
write("logo.svg", logo());
write("favicon.svg", favicon());
console.log("ok.");
