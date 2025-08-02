// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Указываем Vite, что корень вашего проекта находится в папке 'public'
  root: 'public',
  // Указываем Vite, куда выводить собранные файлы.
  // По умолчанию это dist, но если firebase.json ожидает другое, можно поменять.
  build: {
    outDir: '../dist' // Например, если хотите, чтобы папка dist была в корне проекта
  }
});