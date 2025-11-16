<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

type StarShape = 'circle' | 'cross' | 'diamond' | 'star' | 'dot';

interface Star {
  x: number;
  y: number;
  z: number;
  baseOpacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  twinkleIntensity: number;
  isConstellation: boolean;
  movementPhase: number;
  movementSpeed: number;
  shape: StarShape;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
  life: number;
  speed: number;
}

interface CosmicGas {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: { r: number; g: number; b: number };
  baseOpacity: number;
  blobs: Array<{ x: number; y: number; radius: number }>;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { theme } = useTheme();
let animationFrameId: number | null = null;
let stars: Star[] = [];
let shootingStars: ShootingStar[] = [];
let lastShootingStarTime = -3;
let cosmicGases: CosmicGas[] = [];
let lastGasSpawnTime = 0;

let mouseX = 0;
let mouseY = 0;
let lastMouseX: number | null = null;
let lastMouseY: number | null = null;
let lastMouseMoveTime = 0;
let velocityX = 0;
let velocityY = 0;
let isMouseOver = false;
let lastFrameTime = Date.now();

const BASELINE_SPEED = 50;
let baselineDirectionX = -0.707;
let baselineDirectionY = 0.707;

const isDarkMode = computed(() => {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme') || 'light';
  return currentTheme === 'dark';
});

let cachedBrightness: number | null = null;
const getBrightness = () => {
  if (cachedBrightness === null) {
    cachedBrightness = isDarkMode.value ? 255 : 220;
  }
  return cachedBrightness;
};

const createStar = (width: number, height: number): Star => {
  const z = Math.random() * 0.8 + 0.1;
  const baseOpacity = isDarkMode.value 
    ? 0.5 + Math.random() * 0.4 
    : 0.4 + Math.random() * 0.3;
  
  const shapeRoll = Math.random();
  let shape: StarShape;
  if (shapeRoll < 0.5) {
    shape = 'circle';
  } else if (shapeRoll < 0.7) {
    shape = 'cross';
  } else if (shapeRoll < 0.85) {
    shape = 'diamond';
  } else if (shapeRoll < 0.95) {
    shape = 'star';
  } else {
    shape = 'dot';
  }
  
  let twinkleIntensity = 0;
  if (shape !== 'dot') {
    const intensityRoll = Math.random();
    if (intensityRoll < 0.3) {
      twinkleIntensity = 0.8 + Math.random() * 0.2;
    } else if (intensityRoll < 0.7) {
      twinkleIntensity = 0.4 + Math.random() * 0.3;
    } else {
      twinkleIntensity = 0.1 + Math.random() * 0.2;
    }
  }
  
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    z,
    baseOpacity,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: 2.0 + Math.random() * 3.0,
    twinkleIntensity,
    isConstellation: false,
    movementPhase: 0,
    movementSpeed: 0,
    shape,
  };
};

const createCosmicGas = (width: number, height: number, bufferZone: { minX: number; maxX: number; minY: number; maxY: number }): CosmicGas => {
  let x: number, y: number;
  let attempts = 0;
  const maxAttempts = 20;
  
  const margin = 400;
  
  do {
    x = bufferZone.minX + Math.random() * (bufferZone.maxX - bufferZone.minX);
    y = bufferZone.minY + Math.random() * (bufferZone.maxY - bufferZone.minY);
    attempts++;
    
    const isOutside = x < -margin || x > width + margin || 
                     y < -margin || y > height + margin;
    
    if (isOutside) {
      break;
    }
  } while (attempts < maxAttempts);
  
  const safetyMargin = 500;
  if (x >= -safetyMargin && x <= width + safetyMargin && 
      y >= -safetyMargin && y <= height + safetyMargin) {
    const angle = Math.random() * Math.PI * 2;
    const pushDistance = Math.max(width, height) * 0.6;
    x = width / 2 + Math.cos(angle) * pushDistance;
    y = height / 2 + Math.sin(angle) * pushDistance;
  }
  
  const z = Math.random() * 0.7 + 0.2;
  
  const baseRadius = (150 + Math.random() * 200) * (1 - z * 0.5);
  
  const colorType = Math.random();
  let color: { r: number; g: number; b: number };
  if (colorType < 0.3) {
    color = { r: 150, g: 80, b: 180 };
  } else if (colorType < 0.6) {
    color = { r: 80, g: 120, b: 200 };
  } else if (colorType < 0.8) {
    color = { r: 80, g: 180, b: 200 };
  } else {
    color = { r: 100, g: 150, b: 180 };
  }
  
  const numBlobs = 3 + Math.floor(Math.random() * 4);
  const blobs: Array<{ x: number; y: number; radius: number }> = [];
  
  for (let i = 0; i < numBlobs; i++) {
    const angle = (i / numBlobs) * Math.PI * 2 + Math.random() * 0.5;
    const distance = (baseRadius * 0.3) + Math.random() * (baseRadius * 0.4);
    const blobX = x + Math.cos(angle) * distance;
    const blobY = y + Math.sin(angle) * distance;
    const blobRadius = baseRadius * (0.4 + Math.random() * 0.4);
    blobs.push({ x: blobX, y: blobY, radius: blobRadius });
  }
  
  return {
    x,
    y,
    z,
    radius: baseRadius,
    color,
    baseOpacity: 0.08 + Math.random() * 0.12,
    blobs,
  };
};

const initStars = (width: number, height: number) => {
  stars = [];
  
  const numStars = Math.max(100, Math.floor((width * height) / 8000));
  for (let i = 0; i < numStars; i++) {
    stars.push(createStar(width, height));
  }
  
  const bufferSize = 4000;
  const totalGases = Math.floor((width * height) / 10000);
  
  cosmicGases = [];
  
  const baselineDirX = baselineDirectionX;
  const baselineDirY = baselineDirectionY;
  
  let i = 0;
  while (i < totalGases) {
    const shouldCreateCluster = Math.random() < 0.3;
    
    const shouldBeClose = Math.random() < 0.3;
    
    if (shouldCreateCluster && i + 5 <= totalGases) {
      const placementRoll = Math.random();
      let clusterCenterX: number, clusterCenterY: number;
      
      let distance: number;
      if (shouldBeClose) {
        distance = Math.max(width, height) * (0.5 + Math.random() * 0.7);
      } else {
        distance = Math.max(width, height) * (0.8 + Math.random() * 1.5);
      }
      
      if (placementRoll < 0.25) {
        clusterCenterX = width / 2 + baselineDirX * distance;
        clusterCenterY = height / 2 + baselineDirY * distance;
      } else {
        const side = Math.floor(Math.random() * 4);
        switch (side) {
          case 0:
            clusterCenterX = width / 2 + (Math.random() - 0.5) * width * 2;
            clusterCenterY = -distance;
            break;
          case 1:
            clusterCenterX = width + distance;
            clusterCenterY = height / 2 + (Math.random() - 0.5) * height * 2;
            break;
          case 2:
            clusterCenterX = width / 2 + (Math.random() - 0.5) * width * 2;
            clusterCenterY = height + distance;
            break;
          default:
            clusterCenterX = -distance;
            clusterCenterY = height / 2 + (Math.random() - 0.5) * height * 2;
            break;
        }
      }
      
      const clusterRadius = 600;
      const numInCluster = 6 + Math.floor(Math.random() * 5);
      
      for (let j = 0; j < numInCluster && i < totalGases; j++) {
        const clusterBufferZone = {
          minX: clusterCenterX - clusterRadius,
          maxX: clusterCenterX + clusterRadius,
          minY: clusterCenterY - clusterRadius,
          maxY: clusterCenterY + clusterRadius
        };
        cosmicGases.push(createCosmicGas(width, height, clusterBufferZone));
        i++;
      }
    } else {
      const placementRoll = Math.random();
      let bufferZone: { minX: number; maxX: number; minY: number; maxY: number };
      
      let distance: number;
      if (shouldBeClose) {
        distance = Math.max(width, height) * (0.5 + Math.random() * 0.7);
      } else {
        distance = Math.max(width, height) * (0.8 + Math.random() * 1.5);
      }
      
      if (placementRoll < 0.25) {
        const aheadX = width / 2 + baselineDirX * distance;
        const aheadY = height / 2 + baselineDirY * distance;
        bufferZone = {
          minX: aheadX - bufferSize / 2,
          maxX: aheadX + bufferSize / 2,
          minY: aheadY - bufferSize / 2,
          maxY: aheadY + bufferSize / 2
        };
      } else {
        const side = Math.floor(Math.random() * 4);
        switch (side) {
          case 0:
            bufferZone = {
              minX: -bufferSize,
              maxX: width + bufferSize,
              minY: -distance - bufferSize / 2,
              maxY: -distance + bufferSize / 2
            };
            break;
          case 1:
            bufferZone = {
              minX: width + distance - bufferSize / 2,
              maxX: width + distance + bufferSize / 2,
              minY: -bufferSize,
              maxY: height + bufferSize
            };
            break;
          case 2:
            bufferZone = {
              minX: -bufferSize,
              maxX: width + bufferSize,
              minY: height + distance - bufferSize / 2,
              maxY: height + distance + bufferSize / 2
            };
            break;
          default:
            bufferZone = {
              minX: -distance - bufferSize / 2,
              maxX: -distance + bufferSize / 2,
              minY: -bufferSize,
              maxY: height + bufferSize
            };
            break;
        }
      }
      cosmicGases.push(createCosmicGas(width, height, bufferZone));
      i++;
    }
  }
  
  const initialVisibleGases = 3 + Math.floor(Math.random() * 3);
  for (let j = 0; j < initialVisibleGases; j++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const z = Math.random() * 0.7 + 0.2;
    const baseRadius = (150 + Math.random() * 200) * (1 - z * 0.5);
    
    const colorType = Math.random();
    let color: { r: number; g: number; b: number };
    if (colorType < 0.3) {
      color = { r: 150, g: 80, b: 180 };
    } else if (colorType < 0.6) {
      color = { r: 80, g: 120, b: 200 };
    } else if (colorType < 0.8) {
      color = { r: 80, g: 180, b: 200 };
    } else {
      color = { r: 100, g: 150, b: 180 };
    }
    
    const numBlobs = 3 + Math.floor(Math.random() * 4);
    const blobs: Array<{ x: number; y: number; radius: number }> = [];
    
    for (let k = 0; k < numBlobs; k++) {
      const angle = (k / numBlobs) * Math.PI * 2 + Math.random() * 0.5;
      const distance = (baseRadius * 0.3) + Math.random() * (baseRadius * 0.4);
      const blobX = x + Math.cos(angle) * distance;
      const blobY = y + Math.sin(angle) * distance;
      const blobRadius = baseRadius * (0.4 + Math.random() * 0.4);
      blobs.push({ x: blobX, y: blobY, radius: blobRadius });
    }
    
    cosmicGases.push({
      x,
      y,
      z,
      radius: baseRadius,
      color,
      baseOpacity: 0.08 + Math.random() * 0.12,
      blobs,
    });
  }
  
  lastGasSpawnTime = 0;
};

const getStarPosition = (star: Star, width: number, height: number, deltaTime: number): { x: number; y: number } => {
  const speedMultiplier = (1 - star.z) * 0.6;
  
  const cursorSpeed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
  
  let activeDirectionX: number;
  let activeDirectionY: number;
  let activeSpeed: number;
  
  if (cursorSpeed > 0.5) {
    activeDirectionX = velocityX / cursorSpeed;
    activeDirectionY = velocityY / cursorSpeed;
    activeSpeed = cursorSpeed;
    baselineDirectionX = activeDirectionX;
    baselineDirectionY = activeDirectionY;
  } else {
    activeDirectionX = baselineDirectionX;
    activeDirectionY = baselineDirectionY;
    activeSpeed = BASELINE_SPEED;
  }
  
  const deltaX = activeDirectionX * activeSpeed * speedMultiplier * deltaTime;
  const deltaY = activeDirectionY * activeSpeed * speedMultiplier * deltaTime;
  
  let x = star.x + deltaX;
  let y = star.y + deltaY;
  
  while (x < 0) x += width;
  while (x >= width) x -= width;
  while (y < 0) y += height;
  while (y >= height) y -= height;
  
  star.x = x;
  star.y = y;
  
  return { x, y };
};

const createShootingStar = (width: number, height: number): ShootingStar => {
  const edge = Math.floor(Math.random() * 4);
  let startX: number, startY: number;
  let angle: number;
  
  switch (edge) {
    case 0:
      startX = Math.random() * width;
      startY = -20;
      angle = Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 3;
      break;
    case 1:
      startX = width + 20;
      startY = Math.random() * height;
      angle = (3 * Math.PI) / 4 + (Math.random() - 0.5) * Math.PI / 3;
      break;
    case 2:
      startX = Math.random() * width;
      startY = height + 20;
      angle = (5 * Math.PI) / 4 + (Math.random() - 0.5) * Math.PI / 3;
      break;
    default:
      startX = -20;
      startY = Math.random() * height;
      angle = (7 * Math.PI) / 4 + (Math.random() - 0.5) * Math.PI / 3;
      break;
  }
  
  const speed = 30 + Math.random() * 20;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  
  return {
    x: startX,
    y: startY,
    vx,
    vy,
    trail: [],
    life: 1.0,
    speed,
  };
};

const drawShootingStar = (
  ctx: CanvasRenderingContext2D,
  shootingStar: ShootingStar,
  width: number,
  height: number,
  deltaTime: number
) => {
  shootingStar.x += shootingStar.vx * deltaTime;
  shootingStar.y += shootingStar.vy * deltaTime;
  
  shootingStar.trail.push({
    x: shootingStar.x,
    y: shootingStar.y,
    opacity: 1.0,
  });
  
  const maxTrailLength = 60;
  if (shootingStar.trail.length > maxTrailLength) {
    shootingStar.trail.shift();
  }
  
  shootingStar.trail.forEach((point, index) => {
    point.opacity = (index / shootingStar.trail.length) * 0.3;
  });
  
  if (shootingStar.trail.length > 1) {
    ctx.beginPath();
    ctx.moveTo(shootingStar.trail[0].x, shootingStar.trail[0].y);
    
    for (let i = 1; i < shootingStar.trail.length; i++) {
      const point = shootingStar.trail[i];
      const prevPoint = shootingStar.trail[i - 1];
      
      const gradient = ctx.createLinearGradient(
        prevPoint.x, prevPoint.y,
        point.x, point.y
      );
      
      const greenBrightness = isDarkMode.value ? 200 : 150;
      const greenR = Math.floor(greenBrightness * 0.4);
      const greenG = greenBrightness;
      const greenB = Math.floor(greenBrightness * 0.6);
      gradient.addColorStop(0, `rgba(${greenR}, ${greenG}, ${greenB}, ${prevPoint.opacity * 0.15})`);
      gradient.addColorStop(1, `rgba(${greenR}, ${greenG}, ${greenB}, ${point.opacity * 0.05})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }
  
  const greenBrightness = isDarkMode.value ? 180 : 120;
  const greenR = Math.floor(greenBrightness * 0.4);
  const greenG = greenBrightness;
  const greenB = Math.floor(greenBrightness * 0.6);
  ctx.fillStyle = `rgba(${greenR}, ${greenG}, ${greenB}, 0.2)`;
  ctx.beginPath();
  ctx.arc(shootingStar.x, shootingStar.y, 1, 0, Math.PI * 2);
  ctx.fill();
  
  const glowGradient = ctx.createRadialGradient(
    shootingStar.x, shootingStar.y, 0,
    shootingStar.x, shootingStar.y, 3
  );
  glowGradient.addColorStop(0, `rgba(${greenR}, ${greenG}, ${greenB}, 0.1)`);
  glowGradient.addColorStop(1, `rgba(${greenR}, ${greenG}, ${greenB}, 0)`);
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(shootingStar.x, shootingStar.y, 3, 0, Math.PI * 2);
  ctx.fill();
  
  shootingStar.life -= deltaTime * 0.5;
};

const drawCosmicGas = (
  ctx: CanvasRenderingContext2D,
  gas: CosmicGas,
  width: number,
  height: number,
  deltaTime: number,
  activeDirectionX: number,
  activeDirectionY: number,
  activeSpeed: number
) => {
  const depthSpeedMultiplier = (1 - gas.z) * 0.4;
  gas.x += activeDirectionX * activeSpeed * depthSpeedMultiplier * deltaTime;
  gas.y += activeDirectionY * activeSpeed * depthSpeedMultiplier * deltaTime;
  
  const maxBlobRadius = Math.max(...gas.blobs.map(b => b.radius));
  const visibilityMargin = Math.max(maxBlobRadius * 3, 600);
  const isVisible = gas.x > -visibilityMargin && gas.x < width + visibilityMargin &&
                    gas.y > -visibilityMargin && gas.y < height + visibilityMargin;
  
  if (!isVisible) {
    gas.blobs.forEach(blob => {
      blob.x += activeDirectionX * activeSpeed * depthSpeedMultiplier * deltaTime;
      blob.y += activeDirectionY * activeSpeed * depthSpeedMultiplier * deltaTime;
    });
    return;
  }
  
  gas.blobs.forEach(blob => {
    blob.x += activeDirectionX * activeSpeed * depthSpeedMultiplier * deltaTime;
    blob.y += activeDirectionY * activeSpeed * depthSpeedMultiplier * deltaTime;
  });
  
  const depthOpacityMultiplier = 1 - gas.z * 0.5;
  const effectiveOpacity = gas.baseOpacity * depthOpacityMultiplier;
  const depthSizeMultiplier = 1 - gas.z * 0.3;
  
  gas.blobs.forEach(blob => {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    const adjustedRadius = blob.radius * depthSizeMultiplier;
    const gradient = ctx.createRadialGradient(
      blob.x, blob.y, 0,
      blob.x, blob.y, adjustedRadius
    );
    
    const { r, g, b } = gas.color;
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${effectiveOpacity * 0.85})`);
    gradient.addColorStop(0.15, `rgba(${r}, ${g}, ${b}, ${effectiveOpacity * 0.75})`);
    gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${effectiveOpacity * 0.6})`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${effectiveOpacity * 0.4})`);
    gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${effectiveOpacity * 0.2})`);
    gradient.addColorStop(0.85, `rgba(${r}, ${g}, ${b}, ${effectiveOpacity * 0.08})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(blob.x, blob.y, adjustedRadius, 0, Math.PI * 2);
    ctx.fill();
  });
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  star: Star,
  width: number,
  height: number,
  time: number,
  deltaTime: number
) => {
  const { x, y } = getStarPosition(star, width, height, deltaTime);
  
  let opacity: number;
  let size: number;
  const baseSize = star.isConstellation ? 3 : (1 - star.z) * 2 + 1;
  
  const isDot = star.shape === 'dot';
  
  if (isDot) {
    opacity = star.baseOpacity;
    size = baseSize;
  } else {
    const twinkleValue = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
    const twinkleVariation = twinkleValue * star.twinkleIntensity * 0.3;
    const twinkle = 0.7 + twinkleVariation;
    opacity = Math.max(star.baseOpacity * 0.5, star.baseOpacity * twinkle);
    const sizeVariation = 0.6 + twinkleVariation * (2/3);
    size = baseSize * sizeVariation;
  }
  
  const brightness = isDot ? getBrightness() : (isDarkMode.value ? 255 : 220);
  const color = isDot 
    ? `rgba(${brightness}, ${brightness}, ${brightness}, ${star.baseOpacity})`
    : `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
  
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  
  switch (star.shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'cross':
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'star':
      const starSize = size * 0.9;
      const innerSize = starSize * 0.4;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = x + Math.cos(angle) * starSize;
        const outerY = y + Math.sin(angle) * starSize;
        const innerX = x + Math.cos(angle + Math.PI / 4) * innerSize;
        const innerY = y + Math.sin(angle + Math.PI / 4) * innerSize;
        
        if (i === 0) {
          ctx.moveTo(outerX, outerY);
        } else {
          ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'dot':
      ctx.beginPath();
      ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
};

const animate = (startTime: number) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.width / dpr;
  const height = canvas.clientHeight || canvas.height / dpr;
  const currentTime = (Date.now() - startTime) / 1000;
  
  const now = Date.now();
  const deltaTime = (now - lastFrameTime) / 1000;
  lastFrameTime = now;
  
  const currentSpeed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
  
  if (currentSpeed > BASELINE_SPEED) {
    const friction = 0.99;
    const newSpeed = Math.max(BASELINE_SPEED, currentSpeed * friction);
    
    if (currentSpeed > 0) {
      const directionX = velocityX / currentSpeed;
      const directionY = velocityY / currentSpeed;
      velocityX = directionX * newSpeed;
      velocityY = directionY * newSpeed;
    }
  } else {
    if (currentSpeed > 0) {
      const directionX = velocityX / currentSpeed;
      const directionY = velocityY / currentSpeed;
      velocityX = directionX * BASELINE_SPEED;
      velocityY = directionY * BASELINE_SPEED;
    } else {
      velocityX = baselineDirectionX * BASELINE_SPEED;
      velocityY = baselineDirectionY * BASELINE_SPEED;
    }
  }
  
  ctx.fillStyle = '#000011';
  ctx.fillRect(0, 0, width, height);
  
  const timeSinceLastShootingStar = currentTime - lastShootingStarTime;
  const spawnChance = 1 / (4 + Math.random() * 4);
  if (timeSinceLastShootingStar > 3 && Math.random() < spawnChance * deltaTime) {
    shootingStars.push(createShootingStar(width, height));
    lastShootingStarTime = currentTime;
  }
  
  const cursorSpeed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
  let activeDirectionX: number;
  let activeDirectionY: number;
  let activeSpeed: number;
  
  if (cursorSpeed > 0.5) {
    activeDirectionX = velocityX / cursorSpeed;
    activeDirectionY = velocityY / cursorSpeed;
    activeSpeed = cursorSpeed;
  } else {
    activeDirectionX = baselineDirectionX;
    activeDirectionY = baselineDirectionY;
    activeSpeed = BASELINE_SPEED;
  }
  
  const removeMargin = Math.max(width, height) * 2;
  cosmicGases = cosmicGases.filter(gas => {
    const relativeX = gas.x - width / 2;
    const relativeY = gas.y - height / 2;
    const dotProduct = relativeX * activeDirectionX + relativeY * activeDirectionY;
    
    const inViewport = gas.x > -removeMargin && gas.x < width + removeMargin && 
                       gas.y > -removeMargin && gas.y < height + removeMargin;
    const isAhead = dotProduct > -removeMargin;
    
    return inViewport || isAhead;
  });
  
  const minGases = Math.floor((width * height) / 12000);
  const targetGases = Math.floor((width * height) / 10000);
  const timeSinceLastGas = currentTime - lastGasSpawnTime;
  
  if (cosmicGases.length < targetGases || (timeSinceLastGas > 3 && Math.random() < 0.1 * deltaTime)) {
    const bufferSize = 3000;
    const minDistanceFromViewport = Math.max(width, height) * (1.0 + Math.random() * 1.5);
    
    const spawnDirection = Math.random();
    let centerX: number, centerY: number;
    
    if (spawnDirection < 0.25) {
      centerX = width / 2 + activeDirectionX * minDistanceFromViewport;
      centerY = height / 2 + activeDirectionY * minDistanceFromViewport;
    } else if (spawnDirection < 0.5) {
      centerX = width / 2 - activeDirectionX * minDistanceFromViewport;
      centerY = height / 2 - activeDirectionY * minDistanceFromViewport;
    } else {
      const perpendicularX = -activeDirectionY;
      const perpendicularY = activeDirectionX;
      const side = Math.random() < 0.5 ? 1 : -1;
      centerX = width / 2 + perpendicularX * minDistanceFromViewport * side;
      centerY = height / 2 + perpendicularY * minDistanceFromViewport * side;
    }
    
    const bufferZone = {
      minX: centerX - bufferSize / 2,
      maxX: centerX + bufferSize / 2,
      minY: centerY - bufferSize / 2,
      maxY: centerY + bufferSize / 2
    };
    
    const shouldCreateCluster = Math.random() < 0.3;
    
    if (shouldCreateCluster) {
      const clusterRadius = 500;
      const numInCluster = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < numInCluster; i++) {
        const clusterBufferZone = {
          minX: centerX - clusterRadius,
          maxX: centerX + clusterRadius,
          minY: centerY - clusterRadius,
          maxY: centerY + clusterRadius
        };
        cosmicGases.push(createCosmicGas(width, height, clusterBufferZone));
      }
    } else {
      const numNew = cosmicGases.length < minGases ? 7 : (4 + Math.floor(Math.random() * 4));
      for (let i = 0; i < numNew; i++) {
        cosmicGases.push(createCosmicGas(width, height, bufferZone));
      }
    }
    lastGasSpawnTime = currentTime;
  }
  
  cosmicGases.forEach(gas => {
    drawCosmicGas(ctx, gas, width, height, deltaTime, activeDirectionX, activeDirectionY, activeSpeed);
  });
  
  shootingStars = shootingStars.filter(shootingStar => {
    const isOffScreen = shootingStar.x < -50 || shootingStar.x > width + 50 ||
                        shootingStar.y < -50 || shootingStar.y > height + 50;
    const isDead = shootingStar.life <= 0;
    
    if (!isOffScreen && !isDead) {
      drawShootingStar(ctx, shootingStar, width, height, deltaTime);
      return true;
    }
    return false;
  });
  
  stars.forEach(star => drawStar(ctx, star, width, height, currentTime, deltaTime));
  
  animationFrameId = requestAnimationFrame(() => animate(startTime));
};

const handleMouseMove = (event: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const mainElement = canvas.closest('main');
  if (!mainElement) return;
  
  const rect = mainElement.getBoundingClientRect();
  const newMouseX = event.clientX - rect.left;
  const newMouseY = event.clientY - rect.top;
  const currentTime = Date.now();

  if (lastMouseX !== null && lastMouseY !== null && lastMouseMoveTime > 0) {
    const deltaX = newMouseX - lastMouseX;
    const deltaY = newMouseY - lastMouseY;
    const deltaTime = (currentTime - lastMouseMoveTime) / 1000;
    
    if (deltaTime > 0 && deltaTime < 0.1) {
      const speedX = deltaX / deltaTime;
      const speedY = deltaY / deltaTime;
      
      velocityX = -speedX * 0.3;
      velocityY = -speedY * 0.3;
    }
  } else {
    velocityX = 0;
    velocityY = 0;
  }
  
  lastMouseX = newMouseX;
  lastMouseY = newMouseY;
  lastMouseMoveTime = currentTime;
  mouseX = newMouseX;
  mouseY = newMouseY;
  isMouseOver = true;
};

const handleMouseLeave = () => {
  isMouseOver = false;
  lastMouseX = null;
  lastMouseY = null;
  lastMouseMoveTime = 0;
};

const setupCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const container = canvas.parentElement;
  if (!container) return;
  
  const dpr = window.devicePixelRatio || 1;
  
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  
  initStars(width, height);
};

let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
let animationStartTime: number | null = null;

const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    setupCanvas();
    if (animationStartTime !== null && animationFrameId === null) {
      animationStartTime = Date.now();
      animate(animationStartTime);
    }
  }, 250);
};

watch(isDarkMode, () => {
  cachedBrightness = null;
  if (canvasRef.value && canvasRef.value.parentElement) {
    const container = canvasRef.value.parentElement;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    initStars(width, height);
  }
});

onMounted(() => {
  setTimeout(() => {
    setupCanvas();
    animationStartTime = Date.now();
    animate(animationStartTime);
  }, 0);
  
  const canvas = canvasRef.value;
  if (canvas) {
    const mainElement = canvas.closest('main');
    if (mainElement) {
      mainElement.addEventListener('mousemove', handleMouseMove);
      mainElement.addEventListener('mouseleave', handleMouseLeave);
    }
  }
  
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  window.removeEventListener('resize', handleResize);
  
  const canvas = canvasRef.value;
  if (canvas) {
    const mainElement = canvas.closest('main');
    if (mainElement) {
      mainElement.removeEventListener('mousemove', handleMouseMove);
      mainElement.removeEventListener('mouseleave', handleMouseLeave);
    }
  }
});
</script>
