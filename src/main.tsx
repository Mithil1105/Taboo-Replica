import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent("pwa-update-available", { detail: { updateSW } }));
  },
});

createRoot(document.getElementById("root")!).render(<App />);
