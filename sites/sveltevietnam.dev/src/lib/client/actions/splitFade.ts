import type { Action } from 'svelte/action';
import { derived, writable } from 'svelte/store';

import { gsap, Back } from '$3rd/gsap';
import { splash } from '$client/components/SplashScreen';

export const splitFade: Action<HTMLElement> = function (node) {
  const children: HTMLElement[] = [];

  const elements: HTMLElement[] = [];
  const texts: [number, Text][] = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_ALL);
  while (walker.nextNode()) {
    const currentNode = walker.currentNode;
    if (
      currentNode.nodeType === Node.ELEMENT_NODE &&
      !currentNode.textContent?.trim() &&
      elements.every((e) => !e.contains(currentNode as HTMLElement))
    ) {
      elements.push(currentNode as HTMLElement);
      children.push(currentNode as HTMLElement);
    }
    if (currentNode.nodeType === Node.TEXT_NODE) {
      texts.push([children.length, currentNode as Text]);
    }
  }

  for (const [index, text] of texts.reverse()) {
    const charSpans: HTMLSpanElement[] = [];
    const wordSpans: (HTMLSpanElement | Text)[] = [];
    const textContent = text.textContent?.trim() ?? '';

    const words = textContent.split(' ');
    for (let i = 0; i < words.length; i++) {
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('splitFade-word');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.position = 'relative';

      for (const char of words[i]) {
        const charSpan = document.createElement('span');
        charSpan.classList.add('splitFade-char');
        charSpan.style.display = 'inline-block';
        charSpan.style.overflow = 'hidden';
        charSpan.style.position = 'relative';
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
        charSpans.push(charSpan);
      }
      wordSpans.push(wordSpan);
      if (i < words.length - 1) {
        wordSpans.push(document.createTextNode(' '));
      }
    }
    children.splice(index, 0, ...charSpans);
    text.replaceWith(...wordSpans);
  }
  gsap.set(children, { opacity: 0, y: 50, rotate: 10 });

  const intersection = writable(false);
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => !!e.intersectionRatio)) {
        intersection.set(true);
      }
    },
    { threshold: 1 },
  );
  observer.observe(node);

  const trigger = derived([splash, intersection], ([$splash, $intersection]) => {
    return $splash?.done && $intersection;
  });
  const sub = trigger.subscribe((intro) => {
    if (intro) {
      gsap.to(children, {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.4,
        ease: Back.easeOut.config(1.4),
        stagger: 0.04,
      });
      observer?.unobserve(node);
    }
  });

  return {
    destroy() {
      observer?.disconnect();
      sub();
    },
  };
};
