---
description: Project Specification
---

# Pokedex & AI Team Builder - Project Specification

## 1. Project Overview

Aplikasi Pokedex mobile-first berbasis web yang mereplikasi fungsionalitas DataDex, dilengkapi dengan fitur Team Builder dan integrasi AI (Groq) untuk memberikan rekomendasi komposisi tim, moveset, dan item.

## 2. Tech Stack

- Frontend: React.js menggunakan Vite.
- Styling: Tailwind CSS.
- Animation: Framer Motion.
- State Management: Zustand.
- Database: IndexedDB via Dexie.js.
- Data Fetching & Caching: TanStack Query (React Query).
- API Data: PokeAPI.
- AI Integration: Groq API.

## 3. Minimum Viable Product (MVP) Features

- DataDex (Pokedex): Menampilkan daftar Pokemon menggunakan PokeAPI dengan filter lengkap.
- Data Caching: Mengimplementasikan sistem caching pada respons PokeAPI agar performa aplikasi tidak lambat saat menangani data besar.
- Team Builder: Fitur menyusun tim yang disimpan secara lokal di dalam IndexedDB.
- AI Team Suggestions: Fitur chat untuk mendapatkan saran tim dengan AI menggunakan sistem BYOK (Groq).

## 4. UI/UX & Styling Guidelines

- Layout: Mobile apps.
- Gaya Visual: Light apps dengan simple style dan light animation.
- Color Palette: FF0000, BBD5DA, DFF1F1, F5F5F5.
- Icons: Dilarang menggunakan SVG/emojis, gunakan alternatif seperti Font Awesome.
- Notifications: Dilarang menggunakan basic js alert, gunakan toast untuk pesan atau notifikasi.

## 5. Coding Guidelines

- Dilarang menggunakan emoji di dalam kode.
- Jangan menggunakan komentar yang terlalu banyak (too much comment).
- Gunakan kata-kata sederhana dalam bahasa Indonesia untuk memberikan perintah atau komentar.
- Setiap kode harus didokumentasikan.
- Gunakan struktur best practices untuk penamaan file dan folder.
