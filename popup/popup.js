// WA Privacy Guard v2.0 - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_SETTINGS = {
    enabled: true,
    maskMode: 'blur', // 'blur' | 'pixelate' | 'blackout'
    blurLeft: true,
    blurRight: true,
    blurProfile: true,
    blurMedia: true,
    blurPreviews: true,
    blurRadius: 10,
    hoverDelay: 0,
    autoLock: true,
    pinEnabled: false,
    pinCode: ''
  };

  const elements = {
    enabled: document.getElementById('enabled'),
    blurLeft: document.getElementById('blurLeft'),
    blurRight: document.getElementById('blurRight'),
    blurProfile: document.getElementById('blurProfile'),
    blurMedia: document.getElementById('blurMedia'),
    blurPreviews: document.getElementById('blurPreviews'),
    blurRadius: document.getElementById('blurRadius'),
    blurRadiusValue: document.getElementById('blurRadiusValue'),
    hoverDelay: document.getElementById('hoverDelay'),
    hoverDelayValue: document.getElementById('hoverDelayValue'),
    autoLock: document.getElementById('autoLock'),
    pinEnabled: document.getElementById('pinEnabled'),
    pinSetupBox: document.getElementById('pinSetupBox'),
    newPinInput: document.getElementById('newPinInput'),
    savePinBtn: document.getElementById('savePinBtn'),
    statusBadge: document.getElementById('statusBadge'),
    statusText: document.getElementById('statusText'),
    triggerPanicBtn: document.getElementById('triggerPanicBtn'),
    pinModal: document.getElementById('pinModal'),
    pinError: document.getElementById('pinError'),
    pinDigits: [
      document.getElementById('pin1'),
      document.getElementById('pin2'),
      document.getElementById('pin3'),
      document.getElementById('pin4')
    ]
  };

  let savedPinCode = '';

  function getStorage() {
    return chrome.storage.sync || chrome.storage.local;
  }

  // Check PIN protection on popup open
  function checkPinLock() {
    getStorage().get(DEFAULT_SETTINGS, (settings) => {
      savedPinCode = settings.pinCode || '';
      if (settings.pinEnabled && savedPinCode.length === 4) {
        elements.pinModal.classList.remove('hidden');
        elements.pinDigits[0].focus();
      }
    });
  }

  // Handle PIN input fields auto-advance
  elements.pinDigits.forEach((digitInput, idx) => {
    digitInput.addEventListener('input', (e) => {
      if (e.target.value && idx < 3) {
        elements.pinDigits[idx + 1].focus();
      }
      verifyEnteredPin();
    });

    digitInput.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && idx > 0) {
        elements.pinDigits[idx - 1].focus();
      }
    });
  });

  // Verify PIN entered by user
  function verifyEnteredPin() {
    const entered = elements.pinDigits.map(d => d.value).join('');
    if (entered.length === 4) {
      if (entered === savedPinCode) {
        elements.pinModal.classList.add('hidden');
        elements.pinError.classList.add('hidden');
      } else {
        elements.pinError.classList.remove('hidden');
        elements.pinDigits.forEach(d => d.value = '');
        elements.pinDigits[0].focus();
      }
    }
  }

  // Load saved settings into UI
  getStorage().get(DEFAULT_SETTINGS, (settings) => {
    elements.enabled.checked = settings.enabled;
    elements.blurLeft.checked = settings.blurLeft;
    elements.blurRight.checked = settings.blurRight;
    elements.blurProfile.checked = settings.blurProfile;
    elements.blurMedia.checked = settings.blurMedia;
    elements.blurPreviews.checked = settings.blurPreviews;
    elements.autoLock.checked = settings.autoLock;
    elements.pinEnabled.checked = settings.pinEnabled;

    elements.blurRadius.value = settings.blurRadius;
    elements.blurRadiusValue.textContent = `${settings.blurRadius}px`;

    elements.hoverDelay.value = settings.hoverDelay || 0;
    elements.hoverDelayValue.textContent = `${settings.hoverDelay || 0}ms`;

    // Radio mask mode
    const modeRadio = document.querySelector(`input[name="maskMode"][value="${settings.maskMode || 'blur'}"]`);
    if (modeRadio) modeRadio.checked = true;

    // Show/hide PIN setup box
    if (settings.pinEnabled && (!settings.pinCode || settings.pinCode.length !== 4)) {
      elements.pinSetupBox.classList.remove('hidden');
    }

    updateStatusBadge(settings.enabled);
    checkPinLock();
  });

  // Update Status Badge UI
  function updateStatusBadge(isEnabled) {
    if (isEnabled) {
      elements.statusBadge.classList.remove('disabled');
      elements.statusText.textContent = 'Aktif';
    } else {
      elements.statusBadge.classList.add('disabled');
      elements.statusText.textContent = 'Nonaktif';
    }
  }

  // Get current state of all controls
  function getFormData() {
    const selectedMode = document.querySelector('input[name="maskMode"]:checked')?.value || 'blur';
    return {
      enabled: elements.enabled.checked,
      maskMode: selectedMode,
      blurLeft: elements.blurLeft.checked,
      blurRight: elements.blurRight.checked,
      blurProfile: elements.blurProfile.checked,
      blurMedia: elements.blurMedia.checked,
      blurPreviews: elements.blurPreviews.checked,
      autoLock: elements.autoLock.checked,
      pinEnabled: elements.pinEnabled.checked,
      blurRadius: parseInt(elements.blurRadius.value, 10),
      hoverDelay: parseInt(elements.hoverDelay.value, 10)
    };
  }

  // Save changes and notify active WA Web tab
  function saveAndNotify() {
    const updatedSettings = getFormData();
    updateStatusBadge(updatedSettings.enabled);

    getStorage().set(updatedSettings, () => {
      chrome.tabs.query({ url: 'https://web.whatsapp.com/*' }, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            type: 'WA_PRIVACY_UPDATE',
            settings: updatedSettings
          }).catch(() => {});
        });
      });
    });
  }

  // Add listeners to toggles
  const toggleKeys = ['enabled', 'blurLeft', 'blurRight', 'blurProfile', 'blurMedia', 'blurPreviews', 'autoLock'];
  toggleKeys.forEach((key) => {
    elements[key].addEventListener('change', saveAndNotify);
  });

  // Mask Mode Radio Listener
  document.querySelectorAll('input[name="maskMode"]').forEach(radio => {
    radio.addEventListener('change', saveAndNotify);
  });

  // Range Sliders
  elements.blurRadius.addEventListener('input', (e) => {
    elements.blurRadiusValue.textContent = `${e.target.value}px`;
    saveAndNotify();
  });

  elements.hoverDelay.addEventListener('input', (e) => {
    elements.hoverDelayValue.textContent = `${e.target.value}ms`;
    saveAndNotify();
  });

  // PIN Lock Toggle & Save
  elements.pinEnabled.addEventListener('change', (e) => {
    if (e.target.checked) {
      elements.pinSetupBox.classList.remove('hidden');
    } else {
      elements.pinSetupBox.classList.add('hidden');
      getStorage().set({ pinCode: '' });
    }
    saveAndNotify();
  });

  elements.savePinBtn.addEventListener('click', () => {
    const val = elements.newPinInput.value.trim();
    if (val.length === 4 && /^\d+$/.test(val)) {
      savedPinCode = val;
      getStorage().set({ pinCode: val, pinEnabled: true }, () => {
        elements.pinSetupBox.classList.add('hidden');
        alert('PIN berhasil disimpan!');
      });
    } else {
      alert('Masukkan 4 angka untuk PIN!');
    }
  });

  // Trigger Panic Button from popup
  elements.triggerPanicBtn.addEventListener('click', () => {
    chrome.tabs.query({ url: 'https://web.whatsapp.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_PANIC' }).catch(() => {});
      });
    });
  });
});
