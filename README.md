# Pokédex AI Edition

Sebuah aplikasi Pokédex modern, interaktif, dan dilengkapi asisten AI. Dibangun menggunakan teknologi web modern untuk performa tinggi, animasi yang mulus, dan manajemen *state* yang canggih. Data Pokémon diambil secara *real-time* dan efisien menggunakan [PokeAPI](https://pokeapi.co/) (REST dan GraphQL).

## Fitur Utama

* **Pencarian & Filter Tingkat Lanjut**: Cari berdasarkan nama, tipe, generasi, versi game, *Growth Rate*, *Egg Group*, EV Yield, *Ability*, hingga *Move*.
* **Batch Fetching via GraphQL**: Menghindari masalah "N+1 Query" dengan memanggil data ribuan Pokémon secara paralel menggunakan *endpoint* GraphQL Beta dari PokeAPI.
* **Detail Lengkap**: Melihat statistik dasar (dengan kalkulasi BST), tipe kelemahan (termasuk *multiplier* 0.25x hingga 4x), rantai evolusi, dan daftar Move.
* **UI/UX Modern & Animasi Mulus**: Desain responsif bergaya aplikasi *native* dengan dukungan mode gelap (*Dark Mode*) dan transisi menggunakan `framer-motion`.
* **Sistem Manajemen Tim**: Buat dan atur tim Pokémon impian Anda, datanya disimpan secara persisten di lokal (*IndexedDB* menggunakan `dexie`).
* **Asisten Chat AI**: Terintegrasi untuk memberikan saran tentang formasi tim, strategi, maupun fakta unik Pokémon. Chat yang sudah tersimpan tetap ada meskipun halaman dimuat ulang.

## Teknologi & *Dependencies*

Proyek ini dibangun di atas **React 19** dan dikemas menggunakan **Vite 8**. 

### Dependensi Utama (Dependencies)
* **`react`** & **`react-dom`** (v19.2.5) - *Library* UI inti.
* **`react-router-dom`** (^7.15.0) - *Routing* navigasi antar halaman (Home, Detail, Tim, Chat AI).
* **`zustand`** (^5.0.13) - Manajemen *state* untuk Filter, Tema (Dark Mode), Tim, dan Histori Chat yang ringan dan cepat.
* **`@tanstack/react-query`** (^5.100.9) - Pengambilan data (*data fetching*), *caching*, sinkronisasi, dan pengelolaan *state* dari PokeAPI.
* **`framer-motion`** (^12.38.0) - *Library* animasi komponen yang sangat kuat.
* **`dexie`** (^4.4.2) - *Wrapper* IndexedDB untuk penyimpanan data offline di browser (misal: data Tim).
* **`react-icons`** (^5.6.0) - Kumpulan ikon untuk UI.
* **`react-hot-toast`** (^2.6.0) - Notifikasi *toast* yang ringan dan elegan.
* **`react-markdown`** (^10.1.0) - Konversi format Markdown ke HTML untuk fitur *Chat AI*.

### *Development Dependencies*
* **`vite`** (^8.0.10) & **`@vitejs/plugin-react`** (^6.0.1) - *Build tool* dan bundler super cepat.
* **`tailwindcss`** (^4.3.0) & **`@tailwindcss/vite`** (^4.3.0) - *Framework* CSS utilitas utama.
* **`eslint`** (^10.2.1) - *Linter* kode JavaScript dan React.
* **`postcss`** (^8.5.14) & **`autoprefixer`** (^10.5.0) - Pemrosesan CSS (*bundling*).

## Panduan Menjalankan Proyek (*Development*)

Proyek ini menggunakan *Node.js* dan *npm* / *yarn* / *pnpm*.

1. **Instalasi Dependensi**
   Jalankan perintah berikut di terminal:
   ```bash
   npm install
   ```

2. **Menjalankan Development Server**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

3. **Membangun versi Production**
   ```bash
   npm run build
   ```
   Perintah ini akan membuat *bundle* statis siap *deploy* di dalam folder `dist`.

4. **Menjalankan Linter**
   ```bash
   npm run lint
   ```

## Catatan
- Aplikasi ini mengambil data secara ekstensif dari `pokeapi.co` dan versi betanya di `beta.pokeapi.co/graphql/v1beta`. Pastikan Anda terkoneksi ke internet saat pertama kali mengakses (setelah itu *react-query* akan melakukan *caching*).
- Beberapa Pokémon varian regional/baru mungkin memiliki metadata tambahan atau tidak memiliki metadata standar (seperti versi spesifik *flavor text*). Semua sudah dikelola oleh lapisan utilitas secara aman.
