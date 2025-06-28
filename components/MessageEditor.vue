<script setup lang="ts">
const emit = defineEmits(['messageHandler'])
const msg = ref('')
function sendMessage() {
  emit('messageHandler', msg.value)
  msg.value = ''
}
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    if (!event.shiftKey && !event.ctrlKey) {
      event.preventDefault()
      sendMessage()
    }
  }
}
</script>

<template>
  <div
    class="w-4/5 items-center"
    flex="~ row"
  >
    <textarea
      v-model="msg"
      class="resize-none overflow-auto rounded-lg bg-slate-500 text-xl text-white"
      m="l-1"
      w="11/12"
      h="24"
      p="2"
      @keydown="handleKeydown"
    />
    <button
      class="cursor-pointer rounded-lg bg-blue"
      w="1/12"
      p="2"
      m="2"
      hover="bg-blue-500"
      @click="sendMessage"
    >
      <Icon name="ri:send-plane-line" />
    </button>
  </div>
</template>
