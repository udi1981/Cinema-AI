import sharp from 'sharp';

// Create a simple green cinema icon
const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#07070e"/>
  <rect x="24" y="24" width="464" height="464" rx="80" fill="#0f1520"/>
  <rect x="128" y="128" width="256" height="256" rx="32" fill="#10B981" opacity="0.15"/>
  <path d="M 200 180 L 200 332 L 340 256 Z" fill="#10B981"/>
  <rect x="156" y="108" width="24" height="40" rx="4" fill="#10B981" opacity="0.6"/>
  <rect x="204" y="108" width="24" height="40" rx="4" fill="#10B981" opacity="0.6"/>
  <rect x="252" y="108" width="24" height="40" rx="4" fill="#10B981" opacity="0.6"/>
  <rect x="300" y="108" width="24" height="40" rx="4" fill="#10B981" opacity="0.6"/>
  <rect x="156" y="364" width="24" height="40" rx="4" fill="#10B981" opacity="0.6"/>
  <rect x="204" y="364" width="24" height="40" rx="4" fill="#10B981" opacity="0.6"/>
  <rect x="252" y="364" width="24" height="40" rx="4" fill="#10B981" opacity="0.6"/>
  <rect x="300" y="364" width="24" height="40" rx="4" fill="#10B981" opacity="0.6"/>
</svg>`;

const buf = Buffer.from(svg);

await sharp(buf).resize(512, 512).png().toFile('./public/icons/icon-512.png');
await sharp(buf).resize(192, 192).png().toFile('./public/icons/icon-192.png');
console.log('Icons generated!');
