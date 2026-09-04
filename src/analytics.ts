const GA_MEASUREMENT_ID = "G-5ZC0BMBPFE";

declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (...args: unknown[]) => void;
  }
}

const enabled =
  /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) &&
  !GA_MEASUREMENT_ID.includes("XXXX");

let started = false;
let lastTrackedPath: string | undefined;

export const initAnalytics = () => {
  if (!enabled || started) return;
  started = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
};

export const trackPageView = (path: string) => {
  if (!enabled || lastTrackedPath === path) return;
  lastTrackedPath = path;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
};
