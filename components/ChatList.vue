<script setup lang="ts">
export interface Chat {
  role: 'assistant' | 'user' | 'system'
  content: string
}
defineProps<{
  chats: Chat[]
  nextMsg: string
}>()

function createHeart(e: MouseEvent) {
  const x = e.clientX
  const y = e.clientY
  const heart = document.createElement('b')
  heart.style.left = `${x}px`
  heart.style.top = `${y}px`
  heart.style.zIndex = '9999'
  heart.style.position = 'absolute'
  heart.innerHTML = '复制成功'
  document.body.appendChild(heart)
  heart.animate(
    [
      { top: `${y}px`, opacity: 1 },
      { top: `${y - 100}px`, opacity: 0 },
    ],
    {
      duration: 1500,
      easing: 'ease',
    },
  )
  setTimeout(() => {
    heart.remove()
  }, 1500)
}
// 适配复制功能
// 如果新的API支持，则返回新的API的函数
// 否则返回旧的API的函数
function copyCreator() {
  if (navigator && navigator.clipboard) {
    return async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        console.log('复制成功')
      }
      catch (e) {
        console.error('复制失败', e)
      }
    }
  }
  else {
    return (text: string) => {
      const input = document.createElement('input')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
  }
}
const copyHandler = copyCreator()
function clickHandler(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'PRE' && target.children[0].tagName === 'CODE') {
    const code = target.children[0] as HTMLElement
    copyHandler(code.textContent || '')
    createHeart(e)
  }
}
</script>

<template>
  <div class="h-[75vh] w-full overflow-auto" @click="clickHandler">
    <div
      v-for="chat, index in chats"
      :key="index + chat.content.slice(0, 10)"
      class="flex"
      p="2"
      m="1"
      rounded="lg"
      bg="bg-slate"
    >
      <div
        v-if="chat.role === 'assistant'"
        class="w-2/3 flex flex-col items-start"
      >
        <div class="flex items-center">
          <span class="ml-2 text-white">Assistant</span>
        </div>
        <MarkdownContainer
          :markdown-content="chat.content"
          class="rounded-lg bg-slate-500 p-2"
        />
      </div>
      <div
        v-else-if="chat.role === 'user'"
        class="w-4/5 flex flex-col items-end"
        m="l-a r-12"
      >
        <div class="flex items-center">
          <span class="mr-2 text-white">User</span>
        </div>
        <div class="rounded-lg bg-slate-500 p-2">
          {{ chat.content }}
        </div>
      </div>
      <div
        v-else
        class="w-4/5 flex flex-col items-center"
      >
        <div class="rounded-lg bg-slate-500 p-2">
          system:{{ chat.content }}
        </div>
      </div>
    </div>
    <div
      v-if="nextMsg"
      class="w-2/3 flex flex-col items-start"
    >
      <div class="flex items-center">
        <span class="ml-2 text-white">Assistant</span>
      </div>
      <MarkdownContainer
        :markdown-content="nextMsg"
        class="rounded-lg bg-slate-500 p-2"
      />
    </div>
  </div>
</template>
