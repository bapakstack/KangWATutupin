// WA Privacy Guard v2.0 - Content Script

(function () {
  'use strict';

  const DEFAULT_SETTINGS = {
    enabled: true,
    maskMode: 'blur', // 'blur' | 'pixelate' | 'blackout'
    blurLeft: true,
    blurRight: true,
    blurProfile: true,
    blurMedia: true,
    blurPreviews: true,
    blurMessages: false,
    blurRadius: 10,
    hoverDelay: 0, // in milliseconds
    autoLock: true, // auto lock when switching tab/window
    panicActive: false
  };

  let currentSettings = { ...DEFAULT_SETTINGS };
  let panicOverlayEl = null;
  let lastEscTime = 0;

  function getStorage() {
    return chrome.storage.sync || chrome.storage.local;
  }

  // Create or get the Panic Screen Overlay element
  function ensurePanicOverlay() {
    if (panicOverlayEl) return panicOverlayEl;

    const overlay = document.createElement('div');
    overlay.id = 'wa-panic-overlay';
    overlay.className = 'hidden';
    overlay.innerHTML = `
      <div class="panic-box">
        <div class="panic-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2>Layar Terkunci (Privacy Mode)</h2>
        <p>Tampilan WhatsApp Web telah disembunyikan untuk menjaga privasi Anda.</p>
        <div class="panic-shortcut">Tekan Alt + P atau Esc 2x untuk membuka</div>
      </div>
    `;
    document.documentElement.appendChild(overlay);
    panicOverlayEl = overlay;
    return overlay;
  }

  // Toggle Panic Screen state
  function setPanicState(active) {
    currentSettings.panicActive = active;
    const overlay = ensurePanicOverlay();
    if (active) {
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  }

  // Apply settings to document
  function applySettings(settings) {
    currentSettings = { ...currentSettings, ...settings };
    const body = document.body || document.documentElement;
    if (!body) return;

    // CSS Custom Properties
    body.style.setProperty('--wa-blur-radius', `${currentSettings.blurRadius}px`);
    body.style.setProperty('--wa-hover-delay', `${currentSettings.hoverDelay || 0}ms`);

    // Master Enabled State
    body.classList.toggle('wa-privacy-enabled', Boolean(currentSettings.enabled));

    // Masking Modes ('blur' | 'pixelate' | 'blackout')
    body.classList.remove('wa-mode-blur', 'wa-mode-pixelate', 'wa-mode-blackout');
    body.classList.add(`wa-mode-${currentSettings.maskMode || 'blur'}`);

    // Individual Feature Toggles
    body.classList.toggle('wa-blur-left', Boolean(currentSettings.blurLeft));
    body.classList.toggle('wa-blur-right', Boolean(currentSettings.blurRight));
    body.classList.toggle('wa-blur-profile', Boolean(currentSettings.blurProfile));
    body.classList.toggle('wa-blur-media', Boolean(currentSettings.blurMedia));
    body.classList.toggle('wa-blur-previews', Boolean(currentSettings.blurPreviews));
    body.classList.toggle('wa-blur-messages', Boolean(currentSettings.blurMessages));

    // Panic Screen
    setPanicState(Boolean(currentSettings.panicActive));
  }

  // Load saved settings
  function initSettings() {
    getStorage().get(DEFAULT_SETTINGS, (stored) => {
      applySettings(stored);
    });
  }

  // Keyboard Shortcuts (Alt+P & Double Esc)
  window.addEventListener('keydown', (e) => {
    // Alt + P -> Panic Toggle
    if (e.altKey && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      setPanicState(!currentSettings.panicActive);
      return;
    }

    // Double Escape key within 400ms -> Panic Toggle
    if (e.key === 'Escape') {
      const now = Date.now();
      if (now - lastEscTime < 400) {
        setPanicState(!currentSettings.panicActive);
        lastEscTime = 0;
      } else {
        lastEscTime = now;
      }
    }
  }, true);

  // Auto-Lock on Tab Visibility Change / Window Blur
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentSettings.autoLock && currentSettings.enabled) {
      // Ensure master privacy mode is enforced when switching tab
      applySettings({ enabled: true });
    }
  });

  // Listen for storage changes
  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' || area === 'local') {
        const updated = {};
        for (const key in changes) {
          updated[key] = changes[key].newValue;
        }
        applySettings(updated);
      }
    });
  }

  // Listen for direct runtime messages
  if (chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'WA_PRIVACY_UPDATE') {
        applySettings(message.settings);
      } else if (message.type === 'TOGGLE_PANIC') {
        setPanicState(!currentSettings.panicActive);
      }
    });
  }

  // Initialize
  if (document.body) {
    initSettings();
  } else {
    document.addEventListener('DOMContentLoaded', initSettings);
  }
})();
