// Generates wedding-card.png from downloaded assets
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// Card dimensions (portrait) — matches Figma frame
const W = 1238;
const H = 1734;

async function generate() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 1. Background floral image (scaled + offset to match Figma)
  const bg = await loadImage(path.join(__dirname, 'assets/card-bg.png'));
  // Figma: left:-31.98%, top:-7.88%, width:163.25% of 1238px, height:116.54% of 1734px
  const bgW = W * 1.6325;
  const bgH = H * 1.1654;
  const bgX = W * -0.3198;
  const bgY = H * -0.0788;
  ctx.drawImage(bg, bgX, bgY, bgW, bgH);

  // 2. White card overlay (subtle — to let text be readable)
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, 0, W, H);

  // 3. Bismillah calligraphy (SVG loaded as image) — centered top
  try {
    const bismillah = await loadImage(path.join(__dirname, 'assets/bismillah.png'));
    const bW = 395, bH = 98.54;
    const bX = (W - bW) / 2;
    ctx.drawImage(bismillah, bX, 248, bW, bH);
  } catch(e) { console.log('bismillah skip:', e.message); }

  // 4. "Please join with us…" subtitle
  ctx.textAlign = 'center';
  ctx.fillStyle = '#377a27';
  ctx.font = 'bold 30px sans-serif';
  const subtitle = ['PLEASE JOIN WITH US TO', 'CELEBRATE THE WEDDING OF'];
  subtitle.forEach((line, i) => {
    ctx.fillText(line, W / 2, 400 + i * 44);
  });

  // 5. Names in large decorative style
  ctx.fillStyle = '#a6203b';
  ctx.font = 'italic bold 130px Georgia, serif';
  ctx.fillText('Mohammed', W / 2, 590);
  ctx.fillText('Abdul Razak', W / 2, 730);

  ctx.fillStyle = '#377a27';
  ctx.font = 'italic bold 150px Georgia, serif';
  ctx.fillText('&', W / 2, 870);

  ctx.fillStyle = '#a6203b';
  ctx.font = 'italic bold 130px Georgia, serif';
  ctx.fillText('Henna Shireen', W / 2, 1040);

  // 6. Parent names
  ctx.fillStyle = '#790c22';
  ctx.font = '28px sans-serif';
  ctx.fillText('S/O ABDUL RAZAK POOZHAMMAL & RAHANATH', W / 2, 800);
  ctx.fillText('D/O MOHAMMED KALLIL & SAMEERA', W / 2, 1110);

  // 7. Date & Venue section
  // Divider line
  const divX = W / 2 - 10;
  ctx.strokeStyle = '#377a27';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(divX, 1250);
  ctx.lineTo(divX, 1430);
  ctx.stroke();

  // Date block (left of divider)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#377a27';
  ctx.font = '34px sans-serif';
  ctx.fillText('MAY', divX - 220, 1280);
  ctx.font = 'bold 88px sans-serif';
  ctx.fillText('20', divX - 220, 1390);
  ctx.font = '34px sans-serif';
  ctx.fillText('2026', divX - 220, 1440);

  // Venue block (right of divider)
  ctx.fillStyle = '#377a27';
  ctx.font = '30px sans-serif';
  ctx.fillText('5.30 PM – 8:30PM (IST)', divX + 30, 1280);
  ctx.font = 'bold 38px sans-serif';
  ctx.fillText('MALABAR AVENUE', divX + 30, 1350);
  ctx.font = '30px sans-serif';
  ctx.fillText('RAMANATTUKARA', divX + 30, 1410);

  // 8. QR code (bottom right)
  try {
    const qr = await loadImage(path.join(__dirname, 'assets/qr-code.png'));
    ctx.drawImage(qr, W - 220, H - 260, 179, 179);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#377a27';
    ctx.font = '26px sans-serif';
    ctx.fillText('Save your date', W - 130, H - 275);
  } catch(e) { console.log('qr skip:', e.message); }

  // Save
  const out = path.join(__dirname, 'assets/wedding-card.png');
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log('✓ Generated:', out);
}

generate().catch(console.error);
