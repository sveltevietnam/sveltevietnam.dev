import { randomVariant } from '$client/components/SplashScreen/SplashScreen.svelte';

export function load() {
  return {
    splashScreenVariant: randomVariant(),
  };
}
