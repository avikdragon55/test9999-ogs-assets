const canvas = document.querySelector('.dance-art canvas');
const ctx = canvas.getContext('2d');
const playback = document.querySelector('#dance-playback');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

function oval(x, y, width, height, color, angle = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, width, height, angle, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function stroke(points, width, color) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function backdrop() {
  const wall = ctx.createLinearGradient(0, 0, 0, 330);
  wall.addColorStop(0, '#6e294a');
  wall.addColorStop(1, '#d57e9a');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, 640, 440);
  oval(320, 248, 163, 225, '#eca2b7');
  oval(320, 248, 148, 212, '#f5c3cf');
  ctx.fillStyle = '#d999a4';
  ctx.fillRect(0, 322, 640, 118);
  for (const x of [-180, 20, 220, 420, 620, 820]) {
    stroke([[320 + (x - 320) * .22, 323], [x, 440]], 1, '#c37e90');
  }
  stroke([[0, 372], [640, 372]], 1, '#c37e90');
  ctx.beginPath();
  ctx.moveTo(0, 38);
  ctx.quadraticCurveTo(320, 133, 640, 38);
  ctx.strokeStyle = '#9d5870';
  ctx.stroke();
  for (let x = 22; x < 640; x += 31) {
    const t = x / 640;
    const y = 38 + 190 * t * (1 - t);
    oval(x, y + 4, 9, 9, '#ffcda466');
    oval(x, y + 3, 3, 4, '#fff2cf');
  }
  for (const x of [28, 65, 575, 612]) {
    stroke([[x, 437], [x + 12, 365]], 3, '#77535d');
    oval(x + 5, 399, 11, 5, '#87616a', -.6);
    oval(x + 13, 366, 13, 11, '#a64c73');
    oval(x + 11, 363, 8, 6, '#e58ba6');
  }
}

function dancer({x, y, direction, step, nahla, hand, partner}) {
  const skin = nahla ? '#a96248' : '#eab393';
  const hair = nahla ? '#30212a' : '#674331';
  const outfit = nahla ? '#bb416d' : '#f2a2b4';
  const leg = nahla ? '#e99eb5' : '#493644';
  const shoes = nahla ? '#a63d6b' : '#4b3039';
  oval(x, 369, 44, 7, '#71355337');

  for (const side of [-1, 1]) {
    const foot = x + side * 15 + side * step;
    stroke([[x + side * 10, y + 96], [x + side * 13 + side * step * .4, y + 132], [foot, 357]], 13, leg);
    oval(foot + direction * 5, 359, 13, 5, shoes);
  }

  stroke([[x, y + 44], [x + direction * 25, y + 51], [partner, y + 37]], 9, skin);
  stroke([[x, y + 44], [x + direction * 17, y + 49]], 14, outfit);
  oval(x, y + 67, 22, 35, outfit, direction * .13);
  if (nahla) {
    ctx.fillStyle = '#d86189';
    ctx.beginPath();
    ctx.moveTo(x - 17, y + 80);
    ctx.quadraticCurveTo(x - 24, y + 97, x - 36, y + 109);
    ctx.quadraticCurveTo(x, y + 122, x + 36, y + 109);
    ctx.quadraticCurveTo(x + 24, y + 97, x + 17, y + 80);
    ctx.fill();
    stroke([[x - 12, y + 87], [x + 12, y + 87]], 3, '#ffbed0');
  }
  stroke([[x, y + 24], [x, y + 43]], 11, skin);
  oval(x - direction * 5, y + 2, 27, nahla ? 33 : 26, hair);
  oval(x + direction * 3, y + 7, 21, 24, skin, direction * .08);
  for (const [dx, dy, radius] of nahla
    ? [[-22, -10, 11], [-24, 1, 9], [-22, 13, 10], [-15, 24, 9], [-6, -21, 14], [10, -18, 10]]
    : [[-19, -11, 11], [-13, -20, 13], [0, -23, 14], [13, -21, 13], [21, -12, 9]]) {
    oval(x + direction * dx, y + dy, radius, radius * .78, hair, -.24);
  }
  if (nahla) oval(x - direction * 15, y - 12, 6, 6, '#ffe3ec');
  oval(x + direction * 13, y + 8, 2.2, 2.6, '#3e2732');
  oval(x + direction * 20, y + 14, 4, 3, skin);
  stroke([[x + direction * 11, y + 20], [x + direction * 16, y + 19]], 1.5, '#803f47');
  stroke([[x + direction * 5, y + 49], [x + direction * 24, y + 72], hand], 10, skin);
  stroke([[x + direction * 5, y + 49], [x + direction * 14, y + 60]], 15, outfit);
}

function draw(time) {
  backdrop();
  const phase = time / 1150;
  const sway = Math.sin(phase);
  const rise = Math.cos(phase * 2) * 3;
  const center = 320 + sway * 31;
  const distance = 41 + Math.cos(phase) * 5;
  const hand = [center + sway * 5, 221 + rise];
  dancer({x: center - distance, y: 158 + rise, direction: 1, step: sway * 9, nahla: true, hand, partner: center + distance - 10});
  dancer({x: center + distance, y: 150 + rise, direction: -1, step: -sway * 9, nahla: false, hand, partner: center - distance + 10});
  oval(...hand, 6, 5, '#ce8b70');
}

let frame;
let elapsed = 0;
let previous;
let playing = false;

function tick(now) {
  if (previous !== undefined) elapsed += now - previous;
  previous = now;
  draw(elapsed);
  frame = requestAnimationFrame(tick);
}

function setPlaying(next) {
  if (frame !== undefined) cancelAnimationFrame(frame);
  previous = undefined;
  playing = next;
  playback.textContent = next ? 'Pause dance' : 'Play dance';
  if (next) frame = requestAnimationFrame(tick);
}

playback.addEventListener('click', () => setPlaying(!playing));
reduceMotion.addEventListener('change', (event) => setPlaying(!event.matches));
draw(0);
setPlaying(!reduceMotion.matches);
