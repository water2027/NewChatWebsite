import { onMounted, onUnmounted } from 'vue'

export function useMyHook(callback: () => void) {
  onMounted(() => {
    callback()
    window.addEventListener('click', callback)
  })

  onUnmounted(() => {
    window.removeEventListener('click', callback)
  })
}
