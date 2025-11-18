import { inject, ref, type Ref } from 'vue';

export const STARFIELD_VELOCITY_KEY = Symbol('starfieldVelocity');

interface StarfieldVelocity {
  velocityX: Ref<number>;
  velocityY: Ref<number>;
}

export function useStarfieldVelocity() {
  const context = inject<StarfieldVelocity>(STARFIELD_VELOCITY_KEY);

  if (!context) {
    return {
      velocityX: ref(0),
      velocityY: ref(0),
    };
  }

  return context;
}

