import { randomVariant } from '$client/components/SplashScreen';

export function load() {
  return {
    splashScreenVariant: randomVariant(),
  };
}
