import gsap from 'gsap';
import { Power1 } from 'gsap';
// TODO: improve responsive animation with https://greensock.com/docs/v3/GSAP/gsap.matchMedia()??

const SCROLL_DELTA = 500;

export function alternateShapes(shapeElements: HTMLElement[]) {
  gsap.to(shapeElements, {
    rotateX: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-x').toString(),
    rotateY: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-y').toString(),
    rotateZ: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-z-to').toString(),
    scale: (_, target: HTMLElement) => gsap.getProperty(target, '--scale').toString(),
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease: Power1.easeInOut,
    stagger: 0.1,
  });
}

export function createIntroTimeline(
  titleElement: HTMLElement,
  cardElements: HTMLElement[],
  shapeElements: HTMLElement[],
  onComplete: () => void,
) {
  const tl = gsap.timeline({
    defaults: {
      ease: Power1.easeOut,
      duration: 0.8,
    },
    paused: true,
    onComplete,
  });

  // title & cards
  tl.fromTo(
    cardElements,
    {
      opacity: 0,
      y: (_, target: HTMLElement) => gsap.getProperty(target, '--initial-translate-y').toString(),
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.2,
    },
    0,
  );

  // shapes
  tl.fromTo(
    shapeElements,
    {
      x: (_, target: HTMLElement) => gsap.getProperty(target, '--initial-translate-x').toString(),
      y: (_, target: HTMLElement) => gsap.getProperty(target, '--initial-translate-y').toString(),
      rotateZ: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-z-from').toString(),
      opacity: 0,
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      stagger: 0.15,
    },
    0,
  );

  return tl;
}

/** @internal */
function getCardsContainerY(cardsContainerElement: HTMLElement) {
  const { top, height } = cardsContainerElement.getBoundingClientRect();
  const viewBoxHeight = window.innerHeight;
  if (top < viewBoxHeight / 2) {
    return -80;
  }
  const y = top - height / 2 - viewBoxHeight / 2;
  return y;
}
export function createScrollTimeline(
  sectionElement: HTMLElement,
  cardsContainerElement: HTMLElement,
  titleElement: HTMLElement,
  shapeElements: HTMLElement[],
  backdropElement: HTMLElement,
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionElement,
      start: 0,
      end: SCROLL_DELTA,
      pin: true,
      pinSpacing: false,
      scrub: 0.2,
      invalidateOnRefresh: true,
      onRefresh() {
        const communitySection = document.getElementById('community');
        if (communitySection) {
          communitySection.style.marginTop = `${
            SCROLL_DELTA + getCardsContainerY(cardsContainerElement)
          }px`;
        }
      },
    },
    defaults: {
      duration: 1,
      ease: Power1.easeInOut,
    },
  });

  tl.fromTo(
    titleElement,
    {
      yPercent: 0,
      opacity: 1,
    },
    {
      yPercent: -50,
      opacity: 0.1,
    },
    0,
  )
    .fromTo(
      cardsContainerElement,
      {
        y: 0,
      },
      {
        y: () => getCardsContainerY(cardsContainerElement),
      },
      0,
    )
    .fromTo(
      backdropElement,
      {
        opacity: 1,
      },
      {
        opacity: 0,
      },
      0,
    )
    .fromTo(
      shapeElements,
      {
        x: 0,
        y: 0,
      },
      {
        x: (_, target: HTMLElement) => gsap.getProperty(target, '--initial-translate-x').toString(),
        y: (_, target: HTMLElement) => gsap.getProperty(target, '--initial-translate-y').toString(),
      },
      0,
    );
  return tl;
}

export function createCardParallaxTimeline(
  sectionElement: HTMLElement,
  svelteCardElement: HTMLElement,
  sveltevietnamCardElement: HTMLElement,
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionElement,
      start: SCROLL_DELTA,
      end: 'bottom top',
      scrub: 0.1,
      invalidateOnRefresh: true,
    },
  });
  tl.fromTo(
    svelteCardElement,
    {
      y: 0,
    },
    {
      y: (_, target: HTMLElement) =>
        (target.parentElement?.offsetHeight ?? 0) - target.offsetHeight,
    },
    0,
  ).fromTo(
    sveltevietnamCardElement,
    {
      y: 0,
    },
    {
      y: (_, target: HTMLElement) =>
        target.offsetHeight - (target.parentElement?.offsetHeight ?? 0),
    },
    0,
  );
  return tl;
}
