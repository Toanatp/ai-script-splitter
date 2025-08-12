
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './contexts/I18nContext';
import { ClerkProvider } from '@clerk/clerk-react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// --- HƯỚNG DẪN ---
// 1. Lấy "Publishable Key" từ Clerk Dashboard của bạn.
// 2. Thay thế chuỗi "pk_test_YOUR_PUBLISHABLE_KEY_HERE" dưới đây bằng key thật của bạn.
const PUBLISHABLE_KEY = "pk_test_Zml0LXRpZ2VyLTYyLmNsZXJrLmFjY291bnRzLmRldiQ";

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes("YOUR_PUBLISHABLE_KEY_HERE")) {
  rootElement.innerHTML = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #111827;">
      <div style="text-align: center; padding: 2rem; background-color: #1f2937; border-radius: 0.5rem; border: 1px solid #374151; max-width: 90%; width: 600px;">
        <h1 style="font-size: 1.5rem; font-weight: bold; color: #fca5a5;">Lỗi Cấu Hình</h1>
        <p style="margin-top: 1rem; color: #d1d5db;">Chưa thiết lập Clerk Publishable Key.</p>
        <p style="margin-top: 0.5rem; color: #9ca3af; font-size: 0.875rem;">
          Vui lòng mở file <code>index.tsx</code>, lấy key từ Clerk Dashboard, và thay thế giá trị của hằng số <code>PUBLISHABLE_KEY</code> bằng key thật của bạn.
        </p>
      </div>
    </div>
  `;
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </ClerkProvider>
    </React.StrictMode>
  );
}
