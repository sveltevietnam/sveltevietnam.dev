/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action } from 'svelte/action';

// TODO: extract to own package?

type TurnstileConfig = {
  sitekey: string;
  action?: string;
  cData?: string;
  execution?: string;
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  tabindex?: number;
  'response-field'?: boolean;
  'response-field-name'?: string;
  size?: 'normal' | 'compact';
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
  'refresh-expired'?: 'auto' | 'manual' | 'never' | 'auto';
  appearance?: 'always' | 'execute' | 'interaction-only';

  callback?: (token: string) => void;
  'error-callback'?: (...args: any[]) => void;
  'expired-callback'?: (...args: any[]) => void;
  'timeout-callback'?: (...args: any[]) => void;
};

type Turnstile = {
  render: (element: string | HTMLElement, config: TurnstileConfig) => string;
  reset: (id: string) => void;
  getResponse: (id: string) => string | undefined;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile: Turnstile;
  }
}

export type TurnstileEventAttributes = {
  'on:turnstile'?: (event: CustomEvent<any>) => void;
  'on:turnstile:error'?: (event: CustomEvent<any>) => void;
  'on:turnstile:timeout'?: (event: CustomEvent<any>) => void;
  'on:turnstile:expired'?: (event: CustomEvent<any>) => void;
};

export type TurnstileDataAttributes = {
  'turnstile-sitekey': TurnstileConfig['sitekey'];
  'turnstile-action'?: TurnstileConfig['action'];
  'turnstile-cdata'?: TurnstileConfig['cData'];
  'turnstile-execution'?: TurnstileConfig['execution'];
  'turnstile-theme'?: TurnstileConfig['theme'];
  'turnstile-language'?: TurnstileConfig['language'];
  'turnstile-tabindex'?: TurnstileConfig['tabindex'];
  'turnstile-response-field'?: TurnstileConfig['response-field'];
  'turnstile-response-field-name'?: TurnstileConfig['response-field-name'];
  'turnstile-size'?: TurnstileConfig['size'];
  'turnstile-retry'?: TurnstileConfig['retry'];
  'turnstile-retry-interval'?: TurnstileConfig['retry-interval'];
  'turnstile-refresh-expired'?: TurnstileConfig['refresh-expired'];
  'turnstile-appearance'?: TurnstileConfig['appearance'];
  // non-canonical
  'turnstile-script-src'?: string;
};

export type TurnstileAttributes = TurnstileEventAttributes & TurnstileDataAttributes;

/**
 * {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations | Turnstile client configuration}
 */
export type TurnstileParameters = {
  sitekey: TurnstileConfig['sitekey'];
  action?: TurnstileConfig['action'];
  cData?: TurnstileConfig['cData'];
  execution?: TurnstileConfig['execution'];
  theme?: TurnstileConfig['theme'];
  language?: TurnstileConfig['language'];
  tabindex?: TurnstileConfig['tabindex'];
  responseField?: TurnstileConfig['response-field'];
  responseFieldName?: TurnstileConfig['response-field-name'];
  size?: TurnstileConfig['size'];
  retry?: TurnstileConfig['retry'];
  retryInterval?: TurnstileConfig['retry-interval'];
  refreshExpired?: TurnstileConfig['refresh-expired'];
  appearance?: TurnstileConfig['appearance'];
  // non-canonical
  scriptScr?: string;
};

const CLOUDFLARE_TURNSTILE_SCRIPT =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export const turnstile: Action<HTMLElement, TurnstileParameters, TurnstileAttributes> = function (
  node,
  parameters,
) {
  let id: string | null = null;
  if (!window.turnstile) {
    const script = document.createElement('script');
    const src =
      parameters?.scriptScr ??
      node.getAttribute('turnstile-script-src') ??
      CLOUDFLARE_TURNSTILE_SCRIPT;
    script.setAttribute('src', src);
    document.head.appendChild(script);
    script.addEventListener('load', () => {
      load(parameters);
    });
  } else {
    load(parameters);
  }

  function load(parameters?: TurnstileParameters) {
    const sitekey = parameters?.sitekey ?? node.getAttribute('turnstile-sitekey');
    if (!sitekey) throw new Error('`sitekey` is required');
    const config = {
      sitekey,
      action:
        parameters?.action ??
        (node.getAttribute('turnstile-action') as TurnstileConfig['action']) ??
        undefined,
      // get the rest of the parameters from the node, fallback to matching attributes
      cData:
        parameters?.cData ??
        (node.getAttribute('turnstile-cdata') as TurnstileConfig['cData']) ??
        undefined,
      execution:
        parameters?.execution ??
        (node.getAttribute('turnstile-execution') as TurnstileConfig['execution']) ??
        undefined,
      theme:
        parameters?.theme ??
        (node.getAttribute('turnstile-theme') as TurnstileConfig['theme']) ??
        undefined,
      language:
        parameters?.language ??
        (node.getAttribute('turnstile-language') as TurnstileConfig['language']) ??
        undefined,
      tabindex:
        parameters?.tabindex ??
        (parseInt(node.getAttribute('turnstile-tabindex') ?? '0') as TurnstileConfig['tabindex']),
      'response-field': parameters?.responseField ?? node.hasAttribute('turnstile-response-field'),
      'response-field-name':
        parameters?.responseFieldName ??
        (node.getAttribute(
          'turnstile-response-field-name',
        ) as TurnstileConfig['response-field-name']) ??
        undefined,
      size:
        parameters?.size ??
        (node.getAttribute('turnstile-size') as TurnstileConfig['size']) ??
        undefined,
      retry:
        parameters?.retry ??
        (node.getAttribute('turnstile-retry') as TurnstileConfig['retry']) ??
        undefined,
      'retry-interval':
        parameters?.retryInterval ??
        (parseInt(
          node.getAttribute('turnstile-retry-interval') ?? '8000',
        ) as TurnstileConfig['retry-interval']),
      'refresh-expired':
        parameters?.refreshExpired ??
        (node.getAttribute('turnstile-refresh-expired') as TurnstileConfig['refresh-expired']) ??
        undefined,
      appearance:
        parameters?.appearance ??
        (node.getAttribute('turnstile-appearance') as TurnstileConfig['appearance']) ??
        undefined,
      callback: (token) => {
        node.dispatchEvent(new CustomEvent('turnstile', { detail: token }));
      },
      'error-callback': (error) => {
        node.dispatchEvent(new CustomEvent('turnstile:error', { detail: error }));
      },
      'timeout-callback': (timeout) => {
        node.dispatchEvent(new CustomEvent('turnstile:timeout', { detail: timeout }));
      },
      'expired-callback': (expired) => {
        node.dispatchEvent(new CustomEvent('turnstile:expired', { detail: expired }));
      },
    } satisfies TurnstileConfig;
    id = window.turnstile.render(node, config);
  }
  return {
    destroy() {
      if (id) window.turnstile.remove(id);
    },
  };
};
