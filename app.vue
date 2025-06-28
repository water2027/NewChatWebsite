<script setup lang="ts">
import type { SideBarProp } from './components/SideBar.vue'

import type { Chat } from '~/components/ChatList.vue'
import { useMyHook } from '#imports'

import { computed, reactive, ref } from 'vue'

import defaultPrompts from '~/assets/prompts.json'

interface Prompt extends SideBarProp {
  content: string
}

interface ChatHistory extends SideBarProp {
  history: Chat[]
}

const prompts = reactive<Prompt[]>(
  defaultPrompts.map(item => ({ ...item, type: 0 })),
)
const chatHistory = reactive<ChatHistory[]>([])
const nextId = ref(0)
const currentChat = reactive<Chat[]>([])
const currentId = ref(0)
const model = ref('')
const nextMsg = ref('')

// false表示没有展开，true表示已经展开
const asideStatus = ref(true)
const isPC = ref(true)

function change() {
  asideStatus.value = !asideStatus.value
}
function changeModel(newModel: string) {
  model.value = newModel
}

const asideWidth = computed<string>(() => {
  if (isPC.value) {
    return asideStatus.value ? '20%' : '0'
  }
  else {
    return asideStatus.value ? '80%' : '0'
  }
})

function widthChangeHandler() {
  const newStatus = !(window.innerWidth < 768)
  if (newStatus === isPC.value) {
    return
  }
  isPC.value = newStatus
  if (!isPC.value) {
    asideStatus.value = false
  }
}
useMyHook(widthChangeHandler)
onMounted(() => {
  const storagePrompts = localStorage.getItem('prompts')
  storagePrompts && (Object.assign(prompts, JSON.parse(storagePrompts) as Prompt[]))
  const storageNextId = localStorage.getItem('nextId')
  storageNextId && (nextId.value = Number(storageNextId))
  const storageChatHistory = localStorage.getItem('chatHistory')
  storageChatHistory && (Object.assign(chatHistory, JSON.parse(storageChatHistory) as ChatHistory[]))
  createNewChat()
})

/**
 *
 * @param type 0为prompt;1为chatHistory
 * @param id
 * @param name
 * @param prompt
 */
function editData(type: 0 | 1, id: number, name: string | null, prompt: string | null) {
  switch (type) {
    case 0: {
      const index = prompts.findIndex(item => item.id === id)
      if (index === -1) {
        return
      }
      if (name) {
        prompts[index].name = name
      }
      if (prompt) {
        prompts[index].content = prompt
      }
      break
    }
    case 1: {
      const index = chatHistory.findIndex(item => item.id === id)
      if (index === -1) {
        return
      }
      if (name) {
        chatHistory[index].name = name
      }
      break
    }
    default:
      break
  }
}
function deleteData(type: 0 | 1, id: number) {
  switch (type) {
    case 0: {
      const index = prompts.findIndex(item => item.id === id)
      if (index === -1) {
        return
      }
      prompts.splice(index, 1)
      break
    }
    case 1: {
      const index = chatHistory.findIndex(item => item.id === id)
      if (index === -1) {
        return
      }
      chatHistory.splice(index, 1)
      break
    }
    default:
      break
  }
}
function saveData(type: 0 | 1 | 2) {
  switch (type) {
    case 0: {
      localStorage.setItem('prompts', JSON.stringify(prompts))
      break
    }
    case 1: {
      localStorage.setItem(
        'chatHistory',
        JSON.stringify(chatHistory),
      )
      break
    }
    case 2: {
      localStorage.setItem('nextId', String(nextId.value))
      break
    }
    default:
      break
  }
}
// 显示输入框，填写数据
// 如果type为0，则显示两个输入框
// 如果type为1，则显示一个输入框
// 使用prompt弹窗获取数据，哪天想改了再改
function showEditor(type: 0 | 1, id: number) {
  switch (type) {
    case 0: {
      const newName = prompt('请输入名称')
      const newPrompt = prompt('请输入内容')
      editData(type, id, newName, newPrompt)
      break
    }
    case 1: {
      const newName = prompt('请输入名称')
      editData(type, id, newName, null)
      break
    }
    default:
      break
  }
}
function changeCurrentChat(type: 0 | 1, id: number) {
  switch (type) {
    case 0: {
      createNewChat()
      const selectedPrompt = prompts.find(item => item.id === id)
      if (!selectedPrompt) {
        return
      }
      const systemMessage: Chat = {
        role: 'system',
        content: selectedPrompt.content,
      }
      currentChat.push(systemMessage)
      break
    }
    case 1: {
      const selectedChat = chatHistory.find(
        item => item.id === id,
      )
      if (!selectedChat) {
        return
      }
      Object.assign(currentChat, selectedChat.history)
      break
    }
    default:
      break
  }
}
function clickEventHandler(event: MouseEvent) {
  const target = event.target as HTMLElement
  // 匹配类名
  const type = Number(target.getAttribute('data-type')) as 0 | 1
  const id = Number(target.getAttribute('data-id'))
  if (target.classList.contains('edit')) {
    showEditor(type, id)
    saveData(type)
    return
  }
  if (target.classList.contains('delete')) {
    deleteData(type, id)
    saveData(type)
    return
  }
  if (target.classList.contains('bar')) {
    changeCurrentChat(type, id)
  }
}

function createNewChat() {
  const newId = nextId.value++
  currentChat.splice(0, currentChat.length)
  currentId.value = newId
  chatHistory.push({
    type: 1,
    id: newId,
    name: `对话${newId}`,
    history: [],
  })
  saveData(2)
}
async function sendMessageToAI() {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify({
      model: model.value || 'gpt-4',
      messages: currentChat,
    }),
  })
  if (!resp.ok) {
    throw new Error(`请求失败，疑似网络原因`)
  }
  return resp
}
function pushMessage(chat: Chat) {
  try {
    currentChat.push(chat)
    chatHistory
      .find(item => item.id === currentId.value)
      ?.history
      .push(chat)
    saveData(1)
  }
  catch (e) {
    console.error(e)
  }
}
async function messageHandler(msg: string) {
  try {
    if (!msg) {
      return
    }
    pushMessage({
      role: 'user',
      content: msg,
    })
    const resp = await sendMessageToAI()
    const reader = resp.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader()
    while (true) {
      if (!reader) {
        throw new Error('reader未定义')
      }
      const { value, done } = await reader.read()
      if (done)
        break
      nextMsg.value += value
    }
    pushMessage({
      role: 'assistant',
      content: nextMsg.value,
    })
    nextMsg.value = ''
  }
  catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="h-screen w-screen flex bg-gray">
    <aside
      class="z-50 h-screen overflow-visible bg-slate-600 transition-all duration-300"
      left="0"
      :style="{ width: asideWidth }"
    >
      <!-- 图标组 -->
      <div
        class="flex p-2 transition-all duration-300"
        :style="{
          width: asideStatus ? '100%' : '4.5rem',
          height: asideStatus ? '' : '4.5rem',
          flexDirection: isPC ? 'row' : 'column',
          justifyContent: isPC ? 'space-between' : 'center',
        }"
      >
        <Icon
          name="lets-icons:edit"
          size="28"
          class="z-20 transition-transform"
          hover="hover:text-blue-500 hover:scale-110"
          @click="createNewChat"
        />
        <!-- 收缩 -->
        <Icon
          v-if="!asideStatus"
          name="icon-park-outline:expand-left"
          size="28"
          class="z-20 transition-transform"
          hover="hover:text-blue-500 hover:scale-110"
          @click="change"
        />
        <!-- 展开 -->
        <Icon
          v-else
          name="icon-park-outline:expand-right"
          size="28"
          class="z-20 transition-transform"
          hover="hover:text-blue-500 hover:scale-110"
          @click="change"
        />
      </div>
      <div
        class="w-full"
        :style="{ overflow: asideStatus ? 'visible' : 'hidden' }"
        @click="clickEventHandler"
      >
        <SideBar :side-bar-list="prompts" />
        <hr>
        <SideBar :side-bar-list="[...chatHistory].reverse()" />
      </div>
    </aside>
    <main
      class="h-screen flex flex-col transition-all duration-300"
      right="0"
      :style="{
        width: asideStatus ? '80%' : '100%',
        right: asideStatus ? '0' : '-10%',
      }"
    >
      <MyHeader @change-model="changeModel" />
      <ChatList
        :chats="currentChat"
        :next-msg="nextMsg"
      />
      <MessageEditor class="mx-a mb-2 mt-a" @message-handler="messageHandler" />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  overflow: hidden;
}
a {
  text-decoration: none;
}
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
