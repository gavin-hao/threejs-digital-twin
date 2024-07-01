import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import route from './router';

createApp(App).use(route).mount('#app');

(function (doc, win) {
  const fn = () => {
    const docEl = doc.documentElement,
      clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
  };
  if (!doc.addEventListener) return;
  win.addEventListener('resize', fn);
  doc.addEventListener('DOMContentLoaded', fn);
})(document, window);
