import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Recarrega a página automaticamente para aplicar a nova versão.
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App pronto para funcionar offline');
  },
});

createRoot(document.getElementById("root")!).render(<App />);
