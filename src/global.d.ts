interface GtagEventParams {
  [key: string]: string | number | boolean | null | undefined;
}

interface Window {
  gtag?: (...args: [string, string, GtagEventParams]) => void;
}