<script setup lang="ts">
import { useTemplateRef } from 'vue'

const emit = defineEmits<{
  messageHandler: [msg: string]
}>()

const formRef = useTemplateRef<HTMLFormElement>('form')

function sendMessage(msg: string) {
  emit('messageHandler', msg)
}
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    if (!event.shiftKey && !event.ctrlKey) {
      event.preventDefault()
      formRef.value?.submit()
    }
  }
}

function handleSubmit(event: Event) {
  const el = event.target as HTMLFormElement
  if (!el) return
  const form = new FormData(el)
  const msg = form.get('message') as string
  sendMessage(msg)
  el.reset()
}
</script>

<template>
  <form
    ref="form"
    class="w-4/5 items-center"
    flex="~ row"
    @submit.prevent.stop="handleSubmit"
  >
    <textarea
      id="message"
      name="message"
      class="resize-none overflow-auto rounded-lg bg-slate-500 text-xl text-white"
      m="l-1"
      w="11/12"
      h="24"
      p="2"
      @keydown="handleKeydown"
    />
    <button
      class="cursor-pointer rounded-lg bg-blue"
      type="submit"
      w="1/12"
      p="2"
      m="2"
      hover="bg-blue-500"
    >
      <Icon name="ri:send-plane-line" />
    </button>
  </form>
</template>
