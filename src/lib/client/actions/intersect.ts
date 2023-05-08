import type { Action } from 'svelte/action';

const observerMap: Record<string, IntersectionObserver> = {};

export type IntersectParameters = {
  class?: string | false;
  intersectedClass?: string | false;
};

export type IntersectAttributes = {
  'on:intersect:once'?: (event: CustomEvent<IntersectionObserver>) => void;
};

export function getThreshold(node: HTMLElement) {
  if (node.dataset.intersectThreshold) {
    return Number(node.dataset.intersectThreshold);
  }
  if (node.clientHeight > window.innerHeight * 0.4) {
    return 0.5;
  }
  return 1;
}

/**
 * watch with `IntersectionObserver` and toggle corresponding classes
 */
export const intersect: Action<HTMLElement, IntersectParameters, IntersectAttributes> = function (
  node,
  parameters,
) {
  const className = parameters?.class ?? 'c-intro';
  const intersectedClass = parameters?.intersectedClass ?? `${className || ''}--intersected`;
  if (className !== false) {
    node.classList.toggle(className, true);
  }

  const threshold = getThreshold(node);
  let observer = observerMap[threshold];
  if (!observer) {
    const callback: IntersectionObserverCallback = (entries, observer) => {
      if (entries.some((e) => e.target.isSameNode(node) && !!e.intersectionRatio)) {
        if (intersectedClass !== false) {
          node.classList.toggle(intersectedClass, true);
        }
        node.dispatchEvent(new CustomEvent('intersect:once', { detail: observer }));
        observer.unobserve(node);
      }
    };
    observer = new IntersectionObserver(callback, { threshold });
  }
  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    },
  };
};
