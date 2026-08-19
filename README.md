# 🙈 KangWATutupin - WhatsApp Web Privacy & Security Guard

<p align="center">
  <img src="icons/icon128.png" width="100" height="100" alt="KangWATutupin Logo" />
</p>

<p align="center">
  <b>Ekstensi Google Chrome Open-Source untuk melindungi privasi WhatsApp Web dari intipan orang di sekitar Anda.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-brightgreen?style=flat-square" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Version-2.0.0-blue?style=flat-square" alt="Version 2.0.0" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=flat-square" alt="License MIT" />
  <img src="https://img.shields.io/badge/Maintained%20by-bapakstack-teal?style=flat-square" alt="bapakstack" />
</p>

---

## 🌟 Fitur Utama

- **🛡️ Auto-Mask & Blur Panel**: Menyembunyikan daftar chat (panel kiri), pesan aktif (panel kanan), foto profil, media (foto, video, stiker), dan pratinjau pesan secara default.
- **👁️ Hover Reveal**: Arahkan kursor mouse ke area tertentu untuk melihat isi percakapan secara mulus dan instan.
- **🚨 Panic Button / Boss Key (`Alt + P` / Double `Esc`)**: Munculkan layar penutup *Layar Terkunci* dalam sekejap saat ada orang mendekat.
- **🎨 3 Pilihan Efek Visual**:
  - **Blur**: Gaussian blur halus standar.
  - **Pixelate**: Efek kotak piksel matrix retro.
  - **Blackout**: Penutup warna solid 100% tanpa bayangan teks.
- **🔐 PIN Lock Protection**: Kunci menu popup ekstensi dengan 4-digit PIN agar pengaturan tidak bisa diubah sembarangan oleh orang lain.
- **🔒 Auto-Lock on Tab Switch**: Otomatis mengunci dan menyembunyikan tampilan saat Anda berpindah ke tab atau aplikasi lain.
- **⏱️ Hover Delay Slider (0ms – 1000ms)**: Mengatur delay waktu sebelum pesan terbuka saat mouse diarahkan, mencegah pesan terbuka saat kursor melintas tidak sengaja.

---

## 📥 Cara Instalasi (Tanpa Chrome Web Store)

Anda tidak perlu menunggu persetujuan toko ekstensi. Cukup ikuti 4 langkah mudah berikut:

### 1. Download Ekstensi
Download file ZIP rilis terbaru:
👉 **[Download KangWATutupin-v2.0.0.zip](https://github.com/bapakstack/KangWATutupin/releases/latest)**

### 2. Ekstrak File ZIP
Ekstrak file `KangWATutupin-v2.0.0.zip` ke salah satu folder di komputer Anda.

### 3. Pasang di Google Chrome
1. Buka browser **Google Chrome**.
2. Masuk ke halaman ekstensi dengan mengetik: `chrome://extensions/` di address bar.
3. Aktifkan toggle **Developer mode** (Mode Pengembang) di pojok kanan atas.
4. Klik tombol **Load unpacked** (Muat yang tidak dikemas) di pojok kiri atas.
5. Pilih folder hasil ekstrak tadi.

### 4. Selesai! 🎉
Buka **[WhatsApp Web](https://web.whatsapp.com)** dan ekstensi **KangWATutupin** akan langsung aktif menjaga privasi Anda.

---

## ⌨️ Pintasan Keyboard (Shortcuts)

| Shortcut | Fungsi |
| :--- | :--- |
| **`Alt + P`** | Mengaktifkan / Menonaktifkan Panic Screen instan |
| **`Esc` (tekan 2x)** | Alternatif cepat untuk memicu Panic Screen |

---

## 🛠️ Struktur Project

```
KangWATutupin/
├── manifest.json       # Konfigurasi Manifest V3
├── popup/
│   ├── popup.html      # UI Pengaturan Popup
│   ├── popup.css       # Styling Dark Emerald
│   └── popup.js        # Handler State, PIN & Event Listener
├── content/
│   ├── content.css     # Filter CSS Blur, Pixelate & Blackout
│   └── content.js      # Integrasi DOM & Keyboard Listener
└── icons/              # Aset Ikon (16x16, 48x48, 128x128)
```

---

## 🤝 Kontribusi & Dukungan

Proyek ini bersifat **Open-Source**. Jika Anda memiliki ide fitur baru, perbaikan bug, atau ingin berkontribusi:

1. **Fork** repositori ini
2. Buat branch fitur baru (`git checkout -b feature/FiturKeren`)
3. Commit perubahan (`git commit -m 'feat: Tambah Fitur Keren'`)
4. Push ke branch (`git push origin feature/FiturKeren`)
5. Buat **Pull Request**

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

Dibuat dengan ❤️ oleh [@bapakstack](https://github.com/bapakstack).
