import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

window.gtag = function(command: string, ...args: Array<string | Record<string, unknown> | undefined>): void {
  window.gtagCalls = window.gtagCalls || [];
  window.gtagCalls.push({
    command,
    action: args[0] as string,
    params: args[1] as Record<string, unknown>
  });
};

window.scrollTo = () => {};
window.matchMedia = () => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver; 