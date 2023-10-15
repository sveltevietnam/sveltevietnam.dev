declare module 'svelte/elements' {
  export interface SVGAttributes {
    'inline-src'?: import('@svelte-put/preprocess-inline-svg').Source;
  }

  export interface HTMLAnchorAttributes {
    external?: boolean;
  }
}

export {};
