import type { Brand } from '../contracts/index.js';

const escapeXml = (value: string) => value.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]!));

// Six compositions cover the campaign's three images and three allowed regenerations.
// Select by image count, not piece version: editing copy must not repeat a composition.
export function simulatedArt(brand: Brand, sequence: number) {
  const [cream, dark, gold] = brand.palette;
  const scenes = [
    {
      description: 'Una ventana arqueada junto a una planta y un sol dorado.',
      drawing: `<circle cx="800" cy="285" r="118" fill="${gold}"/>
        <path d="M175 860V425a245 245 0 0 1 490 0v435z" fill="${dark}"/>
        <path d="M245 860V435a175 175 0 0 1 350 0v425z" fill="${gold}"/>
        <path d="M420 260v600M245 525h350" stroke="${cream}" stroke-width="14"/>
        <ellipse cx="815" cy="880" rx="125" ry="24" fill="${dark}" opacity=".12"/>
        <path d="M760 745h110l-20 130h-70z" fill="${gold}"/>
        <path d="M815 755V490M815 620q-145-80-85-150 100 30 85 150M815 690q145-80 85-150-100 30-85 150" fill="${dark}" stroke="${dark}" stroke-width="8"/>`,
    },
    {
      description: 'Una naturaleza muerta con un jarrón, hojas, una taza y libros sobre una mesa.',
      drawing: `<rect x="115" y="190" width="850" height="515" rx="250" fill="${gold}" opacity=".25"/>
        <path d="M85 725h910v170H85z" fill="${dark}"/>
        <ellipse cx="540" cy="725" rx="455" ry="75" fill="${gold}"/>
        <path d="M290 420h150l-20 90q90 190-55 190T310 510z" fill="${dark}"/>
        <path d="M365 445V255M365 350q-155-15-125-125 125-10 125 125M365 395q160-40 120-150-130 20-120 150" fill="${dark}" stroke="${dark}" stroke-width="9"/>
        <rect x="540" y="655" width="260" height="38" rx="5" fill="${cream}"/>
        <rect x="565" y="612" width="215" height="34" rx="5" fill="${dark}"/>
        <path d="M610 495h100v75q0 45-50 45t-50-45z" fill="${cream}"/>
        <path d="M710 515q75-5 40 65h-40" fill="none" stroke="${cream}" stroke-width="16"/>`,
    },
    {
      description: 'Una maleta y un mapa plegado con una ruta punteada, vistos como un collage de viaje.',
      drawing: `<circle cx="800" cy="300" r="135" fill="${gold}" opacity=".5"/>
        <g transform="rotate(-12 390 560)"><path d="M285 335v-65h190v65" fill="none" stroke="${dark}" stroke-width="28"/>
        <rect x="170" y="335" width="440" height="490" rx="55" fill="${dark}"/>
        <path d="M265 350v455M515 350v455" stroke="${gold}" stroke-width="25"/>
        <rect x="320" y="480" width="145" height="100" rx="8" fill="${cream}"/></g>
        <path d="m575 515 120 45 120-45 115 45v315l-115-45-120 45-120-45z" fill="${gold}" stroke="${cream}" stroke-width="10"/>
        <path d="M695 560v315M815 515v315" stroke="${dark}" stroke-width="7" opacity=".35"/>
        <path d="M620 760q25-170 110-90t140-50" fill="none" stroke="${dark}" stroke-width="12" stroke-dasharray="18 18"/>
        <circle cx="870" cy="620" r="22" fill="${dark}"/>`,
    },
    {
      description: 'Un sillón con cojín, una lámpara de pie y un cuadro circular.',
      drawing: `<rect x="640" y="180" width="240" height="300" fill="${gold}" opacity=".25"/>
        <circle cx="760" cy="330" r="85" fill="${dark}"/>
        <ellipse cx="440" cy="875" rx="315" ry="45" fill="${gold}" opacity=".3"/>
        <rect x="225" y="445" width="400" height="300" rx="105" fill="${dark}"/>
        <rect x="175" y="650" width="500" height="165" rx="45" fill="${gold}"/>
        <rect x="180" y="585" width="85" height="180" rx="40" fill="${dark}"/>
        <rect x="585" y="585" width="85" height="180" rx="40" fill="${dark}"/>
        <path d="M250 810v60M595 810v60" stroke="${dark}" stroke-width="28"/>
        <rect x="335" y="500" width="170" height="155" rx="25" fill="${cream}" transform="rotate(12 420 580)"/>
        <path d="M820 850V580" stroke="${dark}" stroke-width="14"/>
        <path d="m720 585 55-170h90l55 170z" fill="${gold}"/>
        <ellipse cx="820" cy="855" rx="100" ry="18" fill="${dark}"/>`,
    },
    {
      description: 'Un paisaje abstracto con un gran sol, colinas y un camino sinuoso.',
      drawing: `<circle cx="540" cy="360" r="190" fill="${gold}"/>
        <path d="M75 720q240-390 490-20t440-80v275H75z" fill="${gold}" opacity=".45"/>
        <path d="M75 835q290-450 590-120t340-30v210H75z" fill="${dark}"/>
        <path d="M445 895q330-100 100-190t30-140" fill="none" stroke="${cream}" stroke-width="55"/>
        <path d="M155 330h120M215 270v120M850 480h80M890 440v80" stroke="${dark}" stroke-width="8"/>
        <path d="M160 450q35-35 70 0 35-35 70 0" fill="none" stroke="${dark}" stroke-width="10"/>`,
    },
    {
      description: 'Un desayuno visto desde arriba con un plato, una taza, cubiertos y una servilleta a rayas.',
      drawing: `<rect x="150" y="170" width="780" height="730" rx="55" fill="${gold}" opacity=".3"/>
        <path d="M170 210h740M170 270h740M170 330h740M170 390h740M170 450h740M170 510h740M170 570h740M170 630h740M170 690h740M170 750h740M170 810h740M170 870h740" stroke="${cream}" stroke-width="14"/>
        <circle cx="445" cy="525" r="230" fill="${dark}"/>
        <circle cx="445" cy="525" r="185" fill="${cream}"/>
        <path d="M325 540q0-200 240-85l-35 125q-120-80-160 60z" fill="${gold}"/>
        <circle cx="780" cy="320" r="100" fill="${dark}"/>
        <circle cx="780" cy="320" r="66" fill="${gold}"/>
        <path d="M870 285q90 30 0 75" fill="none" stroke="${dark}" stroke-width="22"/>
        <path d="M765 565v245M740 560v75q25 35 50 0v-75M845 560v250M845 560q50 90 0 110" fill="none" stroke="${dark}" stroke-width="16"/>`,
    },
  ];
  const scene = scenes[sequence];
  if (!scene) throw new Error('No quedan composiciones de prueba para esta campaña.');
  const altText = `Ilustración simulada. ${scene.description} No representa una propiedad real.`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img">
    <title>${escapeXml(altText)}</title><rect width="1080" height="1080" fill="${cream}"/>
    ${scene.drawing}
    <text x="70" y="80" font-family="sans-serif" font-size="25" fill="${dark}" letter-spacing="5">${escapeXml(brand.name.slice(0, 28).toUpperCase())}</text>
    <text x="70" y="1005" font-family="sans-serif" font-size="21" fill="${dark}">EJEMPLO EDUCATIVO · ILUSTRACIÓN SIMULADA</text>
  </svg>`;
  return { svg, altText, description: scene.description };
}
