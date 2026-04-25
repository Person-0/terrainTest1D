const canvas = document.getElementById('main') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const canvasWidth = 512;
const canvasHeight = 512;
const vCenter = canvasHeight / 2;
const hCenter = canvasWidth / 2;

const resize = () => {
    canvas.width = 512;
    canvas.height = 512;
}
window.onresize = resize;
resize();

let offset = 0;
const speed = 1;

const hash = (x: number, seed = 7) => {
    const dotted = (x * 12.9898) + (seed * 78.233);
    const val = (Math.sin(dotted) * 43758.5453);
    return (val - Math.floor(val)) * 2 - 1;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const noise = (x: number) => {
    const i = Math.floor(x);
    const t = smoothstep(x - i);
    return hash(i) + t * (hash(i + 1) - hash(i));
};

const terrain = (x: number) => noise(x * 0.0067) * 128;

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let x = 0; x < canvasWidth; x += 1) {
        const point = x + offset;

        ctx.fillRect(
            x,
            vCenter + terrain(point),
            2,
            2
        );
    }

    const midP = hCenter + offset;
    const mid = terrain(midP);
    const midL = terrain(midP - 0.25);
    const midR = terrain(midP + 0.25);
    ctx.fillRect(hCenter - 2, vCenter + mid, 4, 4);

    const y = vCenter + mid;
    const slope = (midR - midL) / 0.5;
    const dx = 20;
    const dy = slope * dx;
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.moveTo(hCenter - dx, y - dy);
    ctx.lineTo(hCenter + dx, y + dy);
    ctx.stroke();

    offset += speed;
    requestAnimationFrame(draw);
}

draw();