<template>
  <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none" aria-hidden="true" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

interface Cloud {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
  blobs: Array<{ x: number; y: number; radius: number }>;
}

type StarShape = 'circle' | 'cross' | 'diamond' | 'star' | 'dot';

interface Star {
  x: number;
  y: number;
  z: number;
  baseOpacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  twinkleIntensity: number;
  shape: StarShape;
  isLargeBrightCross?: boolean;
}

type ShapeType = 'code' | 'video' | 'brain' | 'database' | 'shield' | 'controller';

interface GeometricShape {
  x: number;
  y: number;
  z: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: ShapeType;
  opacity: number;
  speed: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
let clouds: Cloud[] = [];
let shapes: GeometricShape[] = [];
let stars: Star[] = [];

let lastFrameTime = Date.now();

const BASELINE_SPEED = 240;
const baselineDirectionX = -1;
const baselineDirectionY = 0;

const createStar = (width: number, height: number): Star => {
  let z = Math.random() * 0.8 + 0.1;
  let baseOpacity = 0.2 + Math.random() * 0.2;

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

  let isLargeBrightCross = false;
  if (shape === 'cross' && Math.random() < 0.2) {
    isLargeBrightCross = true;
    z = Math.random() * 0.2 + 0.05;
    baseOpacity = 0.5 + Math.random() * 0.3;
  }

  let twinkleIntensity = 0;
  if (shape !== 'dot') {
    if (isLargeBrightCross) {
      twinkleIntensity = 1.0;
    } else {
      const intensityRoll = Math.random();
      if (intensityRoll < 0.3) {
        twinkleIntensity = 0.8 + Math.random() * 0.2;
      } else if (intensityRoll < 0.7) {
        twinkleIntensity = 0.4 + Math.random() * 0.3;
      } else {
        twinkleIntensity = 0.1 + Math.random() * 0.2;
      }
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
    shape,
    isLargeBrightCross,
  };
};

const createCloud = (width: number, height: number, inViewport: boolean = false): Cloud => {
  const z = Math.random() * 0.6 + 0.2;
  const size = (100 + Math.random() * 150) * (1 - z * 0.3);
  const opacity = 0.95 + Math.random() * 0.05;
  const speed = (0.5 + Math.random() * 1.5) * (1 - z * 0.5);

  let x: number, y: number;
  if (inViewport) {
    x = Math.random() * width;
    y = Math.random() * height;
  } else {
    x = width + size + Math.random() * width * 3;
    y = Math.random() * height;
  }

  const numBlobs = 5 + Math.floor(Math.random() * 4);
  const blobs: Array<{ x: number; y: number; radius: number }> = [];

  const centerRadius = size * 0.4;
  blobs.push({ x, y, radius: centerRadius });

  for (let i = 0; i < numBlobs - 1; i++) {
    const angle = (i / (numBlobs - 1)) * Math.PI * 2;
    const distance = size * (0.3 + Math.random() * 0.3);
    const blobX = x + Math.cos(angle) * distance;
    const blobY = y + Math.sin(angle) * distance * 0.6;
    const blobRadius = size * (0.25 + Math.random() * 0.3);
    blobs.push({ x: blobX, y: blobY, radius: blobRadius });
  }

  return {
    x,
    y,
    z,
    size,
    opacity,
    speed,
    blobs,
  };
};

const createShape = (width: number, height: number): GeometricShape => {
  const z = Math.random() * 0.6 + 0.2;
  const size = (80 + Math.random() * 120) * (1 - z * 0.3);
  const opacity = 0.15 + Math.random() * 0.1;
  const speed = (0.5 + Math.random() * 1.5) * (1 - z * 0.5);

  const x = width + size + Math.random() * width * 3;
  const y = Math.random() * height;

  const types: ShapeType[] = ['code', 'video', 'brain', 'database', 'shield', 'controller'];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    x,
    y,
    z,
    size,
    rotation: 0,
    rotationSpeed: 0,
    type,
    opacity,
    speed,
  };
};

const initClouds = (width: number, height: number) => {
  clouds = [];

  stars = [];
  const numStars = Math.max(50, Math.floor((width * height) / 15000));
  for (let i = 0; i < numStars; i++) {
    stars.push(createStar(width, height));
  }

  const numClouds = Math.max(6, Math.floor((width * height) / 100000));
  const minCloudDistance = 200;

  for (let i = 0; i < numClouds; i++) {
    const inViewport = i < 3;
    let cloud: Cloud;
    let attempts = 0;
    let validPosition = false;

    do {
      cloud = createCloud(width, height, inViewport);
      validPosition = true;

      for (const existingCloud of clouds) {
        const distance = Math.sqrt(
          Math.pow(cloud.x - existingCloud.x, 2) +
          Math.pow(cloud.y - existingCloud.y, 2)
        );
        const minRequiredDistance = (cloud.size + existingCloud.size) / 2 + minCloudDistance;

        if (distance < minRequiredDistance) {
          validPosition = false;
          break;
        }
      }

      attempts++;
    } while (!validPosition && attempts < 200);

    if (validPosition) {
      clouds.push(cloud);
    }
  }

  shapes = [];
  const numShapes = Math.max(4, Math.floor((width * height) / 200000));
  const minDistance = 400;

  for (let i = 0; i < numShapes; i++) {
    let shape: GeometricShape;
    let attempts = 0;
    let validPosition = false;

    do {
      shape = createShape(width, height);
      validPosition = true;

      for (const existingShape of shapes) {
        const distance = Math.sqrt(
          Math.pow(shape.x - existingShape.x, 2) +
          Math.pow(shape.y - existingShape.y, 2)
        );
        const minRequiredDistance = (shape.size + existingShape.size) / 2 + minDistance;

        if (distance < minRequiredDistance) {
          validPosition = false;
          break;
        }
      }

      attempts++;
    } while (!validPosition && attempts < 200);

    if (validPosition) {
      shapes.push(shape);
    }
  }
};

const drawCloud = (
  ctx: CanvasRenderingContext2D,
  cloud: Cloud,
  width: number,
  height: number,
  deltaTime: number
) => {
  const speedMultiplier = (1 - cloud.z) * 0.6;
  const deltaX = baselineDirectionX * BASELINE_SPEED * speedMultiplier * deltaTime;
  const deltaY = 0;

  const newX = cloud.x + deltaX;
  const newY = cloud.y;

  let canMove = true;
  for (let i = 0; i < clouds.length; i++) {
    if (clouds[i] === cloud) continue;

    const otherCloud = clouds[i];
    const distance = Math.sqrt(
      Math.pow(newX - otherCloud.x, 2) +
      Math.pow(newY - otherCloud.y, 2)
    );
    const minRequiredDistance = (cloud.size + otherCloud.size) / 2 + 200;

    if (distance < minRequiredDistance) {
      canMove = false;
      break;
    }
  }

  if (canMove) {
    cloud.x = newX;
    cloud.y = newY;
  }

  if (cloud.x < -cloud.size * 2) {
    let validPosition = false;
    let attempts = 0;
    while (!validPosition && attempts < 100) {
      cloud.x = width + cloud.size * 2 + Math.random() * width * 2;
      cloud.y = Math.random() * height;

      validPosition = true;
      for (let i = 0; i < clouds.length; i++) {
        if (clouds[i] === cloud) continue;
        const otherCloud = clouds[i];
        const distance = Math.sqrt(
          Math.pow(cloud.x - otherCloud.x, 2) +
          Math.pow(cloud.y - otherCloud.y, 2)
        );
        const minRequiredDistance = (cloud.size + otherCloud.size) / 2 + 200;
        if (distance < minRequiredDistance) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    if (validPosition) {
      const numBlobs = cloud.blobs.length;
      const centerRadius = cloud.size * 0.4;
      cloud.blobs[0] = { x: cloud.x, y: cloud.y, radius: centerRadius };
      for (let i = 1; i < numBlobs; i++) {
        const angle = ((i - 1) / (numBlobs - 1)) * Math.PI * 2;
        const distance = cloud.size * (0.3 + Math.random() * 0.3);
        const blobX = cloud.x + Math.cos(angle) * distance;
        const blobY = cloud.y + Math.sin(angle) * distance * 0.6;
        const blobRadius = cloud.size * (0.25 + Math.random() * 0.3);
        cloud.blobs[i] = { x: blobX, y: blobY, radius: blobRadius };
      }
    }
  } else if (cloud.x > width + cloud.size * 2) {
    let validPosition = false;
    let attempts = 0;
    while (!validPosition && attempts < 100) {
      cloud.x = -cloud.size * 2 - Math.random() * width * 2;
      cloud.y = Math.random() * height;

      validPosition = true;
      for (let i = 0; i < clouds.length; i++) {
        if (clouds[i] === cloud) continue;
        const otherCloud = clouds[i];
        const distance = Math.sqrt(
          Math.pow(cloud.x - otherCloud.x, 2) +
          Math.pow(cloud.y - otherCloud.y, 2)
        );
        const minRequiredDistance = (cloud.size + otherCloud.size) / 2 + 200;
        if (distance < minRequiredDistance) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    if (validPosition) {
      const numBlobs = cloud.blobs.length;
      const centerRadius = cloud.size * 0.4;
      cloud.blobs[0] = { x: cloud.x, y: cloud.y, radius: centerRadius };
      for (let i = 1; i < numBlobs; i++) {
        const angle = ((i - 1) / (numBlobs - 1)) * Math.PI * 2;
        const distance = cloud.size * (0.3 + Math.random() * 0.3);
        const blobX = cloud.x + Math.cos(angle) * distance;
        const blobY = cloud.y + Math.sin(angle) * distance * 0.6;
        const blobRadius = cloud.size * (0.25 + Math.random() * 0.3);
        cloud.blobs[i] = { x: blobX, y: blobY, radius: blobRadius };
      }
    }
  } else {
    cloud.blobs.forEach(blob => {
      blob.x += deltaX;
      blob.y = cloud.y + (blob.y - cloud.y);
    });
  }

  const visibleShapeTypes = new Set<ShapeType>();

  shapes.forEach((shape) => {
    const isVisible = shape.x > -shape.size * 3 && shape.x < width + shape.size * 3 &&
      shape.y > -shape.size * 3 && shape.y < height + shape.size * 3;
    if (isVisible) {
      visibleShapeTypes.add(shape.type);
    }
  });

  shapes.forEach((shape, index) => {
    const shapeSpeedMultiplier = (1 - shape.z) * 0.15;
    const shapeDeltaX = baselineDirectionX * BASELINE_SPEED * shapeSpeedMultiplier * deltaTime;
    const shapeDeltaY = 0;

    const newX = shape.x + shapeDeltaX;
    const newY = shape.y;

    let canMove = true;
    for (let i = 0; i < shapes.length; i++) {
      if (i === index) continue;

      const otherShape = shapes[i];
      const distance = Math.sqrt(
        Math.pow(newX - otherShape.x, 2) +
        Math.pow(newY - otherShape.y, 2)
      );
      const minRequiredDistance = (shape.size + otherShape.size) / 2 + 400;

      if (distance < minRequiredDistance) {
        canMove = false;
        break;
      }
    }

    if (canMove) {
      shape.x = newX;
      shape.y = newY;
    }

    if (shape.x < -shape.size * 2) {
      let validPosition = false;
      let attempts = 0;
      while (!validPosition && attempts < 100) {
        shape.x = width + shape.size * 2 + Math.random() * width * 2;
        shape.y = Math.random() * height;

        const isVisible = shape.x > -shape.size * 3 && shape.x < width + shape.size * 3 &&
          shape.y > -shape.size * 3 && shape.y < height + shape.size * 3;
        const typeAlreadyVisible = isVisible && visibleShapeTypes.has(shape.type);

        if (typeAlreadyVisible) {
          const allTypes: ShapeType[] = ['code', 'video', 'brain', 'database', 'shield', 'controller'];
          const availableTypes = allTypes.filter(
            type => !visibleShapeTypes.has(type)
          );
          if (availableTypes.length > 0) {
            shape.type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          }
        }

        validPosition = true;
        for (let i = 0; i < shapes.length; i++) {
          if (i === index) continue;
          const otherShape = shapes[i];
          const distance = Math.sqrt(
            Math.pow(shape.x - otherShape.x, 2) +
            Math.pow(shape.y - otherShape.y, 2)
          );
          const minRequiredDistance = (shape.size + otherShape.size) / 2 + 400;
          if (distance < minRequiredDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }
    } else if (shape.x > width + shape.size * 2) {
      let validPosition = false;
      let attempts = 0;
      while (!validPosition && attempts < 100) {
        shape.x = -shape.size * 2 - Math.random() * width * 2;
        shape.y = Math.random() * height;

        const isVisible = shape.x > -shape.size * 3 && shape.x < width + shape.size * 3 &&
          shape.y > -shape.size * 3 && shape.y < height + shape.size * 3;
        const typeAlreadyVisible = isVisible && visibleShapeTypes.has(shape.type);

        if (typeAlreadyVisible) {
          const allTypes: ShapeType[] = ['code', 'video', 'brain', 'database', 'shield', 'controller'];
          const availableTypes = allTypes.filter(
            type => !visibleShapeTypes.has(type)
          );
          if (availableTypes.length > 0) {
            shape.type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          }
        }

        validPosition = true;
        for (let i = 0; i < shapes.length; i++) {
          if (i === index) continue;
          const otherShape = shapes[i];
          const distance = Math.sqrt(
            Math.pow(shape.x - otherShape.x, 2) +
            Math.pow(shape.y - otherShape.y, 2)
          );
          const minRequiredDistance = (shape.size + otherShape.size) / 2 + 400;
          if (distance < minRequiredDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }
    }
  });

  const isVisible = cloud.x > -cloud.size * 3 && cloud.x < width + cloud.size * 3 &&
    cloud.y > -cloud.size * 3 && cloud.y < height + cloud.size * 3;

  if (!isVisible) {
    return;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  cloud.blobs.forEach((blob, index) => {
    const shadowOffset = 3;
    const shadowGradient = ctx.createRadialGradient(
      blob.x + shadowOffset, blob.y + shadowOffset, 0,
      blob.x + shadowOffset, blob.y + shadowOffset, blob.radius
    );

    shadowGradient.addColorStop(0, `rgba(200, 220, 240, ${cloud.opacity * 0.2})`);
    shadowGradient.addColorStop(0.5, `rgba(200, 220, 240, ${cloud.opacity * 0.1})`);
    shadowGradient.addColorStop(1, `rgba(200, 220, 240, 0)`);

    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.arc(blob.x + shadowOffset, blob.y + shadowOffset, blob.radius, 0, Math.PI * 2);
    ctx.fill();

    const gradient = ctx.createRadialGradient(
      blob.x - blob.radius * 0.2, blob.y - blob.radius * 0.2, 0,
      blob.x, blob.y, blob.radius
    );

    const highlightOpacity = index === 0 ? cloud.opacity : cloud.opacity * 0.98;
    gradient.addColorStop(0, `rgba(255, 255, 255, ${highlightOpacity})`);
    gradient.addColorStop(0.15, `rgba(255, 255, 255, ${cloud.opacity * 0.99})`);
    gradient.addColorStop(0.4, `rgba(255, 255, 255, ${cloud.opacity * 0.95})`);
    gradient.addColorStop(0.7, `rgba(255, 255, 255, ${cloud.opacity * 0.85})`);
    gradient.addColorStop(0.9, `rgba(250, 250, 255, ${cloud.opacity * 0.6})`);
    gradient.addColorStop(1, `rgba(240, 245, 255, ${cloud.opacity * 0.2})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
    ctx.fill();

    const shineGradient = ctx.createRadialGradient(
      blob.x - blob.radius * 0.35, blob.y - blob.radius * 0.35, 0,
      blob.x - blob.radius * 0.35, blob.y - blob.radius * 0.35, blob.radius * 0.6
    );

    shineGradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * 1.0})`);
    shineGradient.addColorStop(0.3, `rgba(255, 255, 255, ${cloud.opacity * 0.8})`);
    shineGradient.addColorStop(0.6, `rgba(255, 255, 255, ${cloud.opacity * 0.4})`);
    shineGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.fillStyle = shineGradient;
    ctx.beginPath();
    ctx.arc(blob.x - blob.radius * 0.35, blob.y - blob.radius * 0.35, blob.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  star: Star,
  width: number,
  height: number,
  time: number
) => {
  let opacity: number;
  let size: number;
  const baseSize = (1 - star.z) * 2 + 0.5;

  const isDot = star.shape === 'dot';

  if (isDot) {
    opacity = star.baseOpacity;
    size = baseSize;
  } else {
    const twinkleValue = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
    let twinkleVariation: number;
    let twinkle: number;
    let sizeVariation: number;

    if (star.isLargeBrightCross) {
      twinkleVariation = twinkleValue * star.twinkleIntensity * 0.3;
      twinkle = 0.5 + twinkleVariation;
      opacity = Math.max(star.baseOpacity * 0.5, star.baseOpacity * twinkle);
      sizeVariation = 0.7 + twinkleVariation;
      size = baseSize * sizeVariation;
    } else {
      twinkleVariation = twinkleValue * star.twinkleIntensity * 0.3;
      twinkle = 0.7 + twinkleVariation;
      opacity = Math.max(star.baseOpacity * 0.5, star.baseOpacity * twinkle);
      sizeVariation = 0.6 + twinkleVariation * (2 / 3);
      size = baseSize * sizeVariation;
    }
  }

  const brightness = 240;
  const color = `rgba(${brightness}, ${brightness}, ${brightness + 10}, ${opacity})`;

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  switch (star.shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(star.x, star.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'cross': {
      if (star.isLargeBrightCross) {
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        const crossSize = size * 2;
        const lineWidth = 2.5;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(star.x - crossSize, star.y);
        ctx.lineTo(star.x + crossSize, star.y);
        ctx.moveTo(star.x, star.y - crossSize);
        ctx.lineTo(star.x, star.y + crossSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(star.x, star.y, crossSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.moveTo(star.x - size, star.y);
        ctx.lineTo(star.x + size, star.y);
        ctx.moveTo(star.x, star.y - size);
        ctx.lineTo(star.x, star.y + size);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(star.x, star.y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(star.x, star.y - size);
      ctx.lineTo(star.x + size, star.y);
      ctx.lineTo(star.x, star.y + size);
      ctx.lineTo(star.x - size, star.y);
      ctx.closePath();
      ctx.fill();
      break;

    case 'star': {
      const starSize = size * 0.9;
      const innerSize = starSize * 0.4;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = star.x + Math.cos(angle) * starSize;
        const outerY = star.y + Math.sin(angle) * starSize;
        const innerX = star.x + Math.cos(angle + Math.PI / 4) * innerSize;
        const innerY = star.y + Math.sin(angle + Math.PI / 4) * innerSize;

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
    }

    case 'dot':
      ctx.beginPath();
      ctx.arc(star.x, star.y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
};

const drawShape = (
  ctx: CanvasRenderingContext2D,
  shape: GeometricShape,
  width: number,
  height: number
) => {
  const isVisible = shape.x > -shape.size * 3 && shape.x < width + shape.size * 3 &&
    shape.y > -shape.size * 3 && shape.y < height + shape.size * 3;

  if (!isVisible) {
    return;
  }

  ctx.save();
  ctx.translate(shape.x, shape.y);

  const iconUnicode: Record<ShapeType, string> = {
    code: '\uf121',
    video: '\uf03d',
    brain: '\uf5dc',
    database: '\uf1c0',
    shield: '\uf3ed',
    controller: '\uf11b',
  };

  const fontSize = shape.size * 0.8;
  ctx.font = `900 ${fontSize}px "Font Awesome 6 Free"`;
  ctx.fillStyle = `rgba(0, 128, 255, ${shape.opacity * 0.5})`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(iconUnicode[shape.type], 0, 0);

  ctx.restore();
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

  const now = Date.now();
  const deltaTime = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
  skyGradient.addColorStop(0, '#4A90E2');
  skyGradient.addColorStop(0.3, '#6BA3E8');
  skyGradient.addColorStop(0.6, '#87B5ED');
  skyGradient.addColorStop(1, '#B8D4F0');

  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height);

  const currentTime = (Date.now() - startTime) / 1000;

  stars.forEach(star => {
    drawStar(ctx, star, width, height, currentTime);
  });

  shapes.forEach(shape => {
    drawShape(ctx, shape, width, height);
  });

  clouds.forEach(cloud => {
    drawCloud(ctx, cloud, width, height, deltaTime);
  });

  animationFrameId = requestAnimationFrame(() => animate(startTime));
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

  initClouds(width, height);
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

onMounted(() => {
  setTimeout(() => {
    setupCanvas();
    animationStartTime = Date.now();
    animate(animationStartTime);
  }, 0);


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

});
</script>
