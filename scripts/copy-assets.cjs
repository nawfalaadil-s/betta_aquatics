const fs = require('fs');
const path = require('path');

const srcDir = 'product_image';
const pubImgDir = path.join('public', 'product_image');
const pubVidDir = path.join('public', 'videos');

if (!fs.existsSync(pubImgDir)) fs.mkdirSync(pubImgDir, { recursive: true });
if (!fs.existsSync(pubVidDir)) fs.mkdirSync(pubVidDir, { recursive: true });

const files = fs.readdirSync(srcDir);

// Mapping of file names to normalized clean web slugs
const fileMappings = {
  'albino red koi .png': 'albino-red-koi.png',
  'betta main.png': 'betta-main.png',
  'black samurai.png': 'black-samurai.png',
  'blue guppy 120rs.png': 'blue-guppy-120.png',
  'dumbo ear 120rs.png': 'dumbo-ear-120.png',
  'green zeiltail - 100rs.png': 'green-zeiltail-100.png',
  'guppy 45.png': 'guppy-45.png',
  'white betta.png': 'white-betta.png',
  'white guppy.png': 'white-guppy.png',
  'zeiltail .png': 'zeiltail.png',
  'Air Stone - 20rs.jpeg': 'air-stone-20.jpeg',
  'Almond Leaves - 10pc - 20rs.jpeg': 'almond-leaves-20.jpeg',
  'Aqua Air Pump - 180rs.jpeg': 'aqua-air-pump-180.jpeg',
  'fish tank 4x4x4 - 150rs.jpeg': 'fish-tank-4x4x4-150.jpeg',
  'fish tank 5x5x5 - 230rs.jpeg': 'fish-tank-5x5x5-230.jpeg',
  'fox tail - 50rs.jpg': 'foxtail-50.jpg',
  'Full Moon Betta - 10pc  - 750rs.jpeg': 'full-moon-betta-750.jpeg',
  'Grindal Worms - 100rs.jpeg': 'grindal-worms-100.jpeg',
};

const videoMappings = {
  'betta - male - 100rs.mp4': 'betta-male-100.mp4',
  'green zeiltail  - 1 pair - 100rs.mp4': 'green-tail-100.mp4',
  'guppy - 1 pair - 120rs.mp4': 'guppy-120.mp4',
  'guppy - 1 pair - 150rs.mp4': 'guppy-150.mp4',
  'guppy - 1 pair - 45rs.mp4': 'guppy-45.mp4',
  'red guppy - 1 pair - 120rs.mp4': 'guppy-pair-120.mp4',
  'samuari betta - 1 pair - 350rs.mp4': 'betta-350.mp4',
  'White betta - 1 pair - 250rs.mp4': 'betta-250.mp4',
  'white guppy - 1 pair - 799rs.mp4': 'guppy-800.mp4',
  'zeiltail  - 5 pair - 150rs.mp4': 'zebra-5pair-150.mp4',
};

for (const file of files) {
  const srcPath = path.join(srcDir, file);
  if (file.endsWith('.mp4')) {
    // Copy video to public/videos with exact name and mapped name
    fs.copyFileSync(srcPath, path.join(pubVidDir, file));
    if (videoMappings[file]) {
      fs.copyFileSync(srcPath, path.join(pubVidDir, videoMappings[file]));
    }
  } else {
    // Copy image to public/product_image with exact name and mapped clean name
    fs.copyFileSync(srcPath, path.join(pubImgDir, file));
    if (fileMappings[file]) {
      fs.copyFileSync(srcPath, path.join(pubImgDir, fileMappings[file]));
    }
  }
}

console.log('Successfully copied and normalized all media into public/ directories!');
