/**
 * Inline script injected in <head> before paint to set the theme class,
 * preventing a flash of the wrong theme (FOUC). Mirrors ThemeProvider logic.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('selah-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;
