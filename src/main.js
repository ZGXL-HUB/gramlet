import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/utils/limits.js'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  return { app }
}
