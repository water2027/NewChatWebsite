<template>
	<div class="flex w-screen h-screen p-1 bg-gray">
		<aside
			class="fixed h-screen transition-all duration-300 overflow-visible z-50 bg-slate-600"
			left="0"
			:style="{ width: asideWidth }"
		>
			<!-- 图标组 -->
			<div
				class="flex p-2 overflow-visible transition-all duration-300"
				:style="{
					width: asideStatus ? '100%' : '4.5rem',
					height: asideStatus ? '' : '4.5rem',
					flexDirection: isPC ? 'row' : 'column',
					justifyContent: isPC ? 'space-between' : 'center',
				}"
			>
				<Icon
					name="lets-icons:edit"
					@click="createNewChat"
					size="28"
					class="transition-transform z-20"
					hover="hover:text-blue-500 hover:scale-110"
				/>
				<!-- 收缩 -->
				<Icon
					v-if="!asideStatus"
					@click="change"
					name="icon-park-outline:expand-left"
					size="28"
					class="transition-transform z-20"
					hover="hover:text-blue-500 hover:scale-110"
				/>
				<!-- 展开 -->
				<Icon
					v-else
					@click="change"
					name="icon-park-outline:expand-right"
					size="28"
					class="transition-transform z-20"
					hover="hover:text-blue-500 hover:scale-110"
				/>
			</div>
			<div
				class="w-full"
				:style="{ overflow: asideStatus ? 'visible' : 'hidden' }"
				@click="clickEventHandler"
			>
				<SideBar :side-bar-list="prompts" />
				<hr />
				<SideBar :side-bar-list="chatHistory.reverse()" />
			</div>
		</aside>
		<main
			class="fixed h-screen transition-all duration-300"
			right="0"
			:style="{
				width: asideStatus ? '80%' : '100%',
				right: asideStatus ? '0' : '-10%',
			}"
		>
			<MyHeader v-model="model" />
			<ChatList :chats="currentChat" />
			<MessageEditor
				@message-handler="messageHandler"
				v-model="msg"
			/>
		</main>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import type { SideBarProp } from './components/SideBar.vue';
import type { Chat } from '~/components/ChatList.vue';

import { useMyHook } from '#imports';

import defaultPrompts from '~/assets/prompts.json';

interface Prompt extends SideBarProp {
	content: string;
}

interface ChatHistory extends SideBarProp {
	history: Chat[];
}

const prompts = ref<Prompt[]>(
	defaultPrompts.map((item) => ({ ...item, type: 0 }))
);
const chatHistory = ref<ChatHistory[]>([]);
const nextId = ref(0);
const currentChat = ref<Chat[]>([]);
const currentId = ref(0);
const msg = ref('');
const model = ref('');

// false表示没有展开，true表示已经展开
const asideStatus = ref(true);
const isPC = ref(true);

const change = () => {
	asideStatus.value = !asideStatus.value;
};

const asideWidth = computed<string>(() => {
	if (isPC.value) {
		return asideStatus.value ? '20%' : '0';
	} else {
		return asideStatus.value ? '80%' : '0';
	}
});

const widthChangeHandler = () => {
	const newStatus = window.innerWidth < 768 ? false : true;
	if (newStatus == isPC.value) {
		return;
	}
	isPC.value = newStatus;
	if (!isPC.value) {
		asideStatus.value = false;
	}
};
useMyHook(widthChangeHandler);
onMounted(() => {
	const storagePrompts = localStorage.getItem('prompts');
	storagePrompts && (prompts.value = JSON.parse(storagePrompts) as Prompt[]);
	const storageNextId = localStorage.getItem('nextId');
	storageNextId && (nextId.value = Number(storageNextId));
	const storageChatHistory = localStorage.getItem('chatHistory');
	storageChatHistory &&
		(chatHistory.value = JSON.parse(storageChatHistory) as ChatHistory[]);
});

/**
 *
 * @param type 0为prompt;1为chatHistory
 * @param id
 * @param name
 * @param prompt
 */
const editData = (
	type: 0 | 1,
	id: number,
	name: string | null,
	prompt: string | null
) => {
	switch (type) {
		case 0: {
			const index = prompts.value.findIndex((item) => item.id === id);
			if (index === -1) {
				return;
			}
			if (name) {
				prompts.value[index].name = name;
			}
			if (prompt) {
				prompts.value[index].content = prompt;
			}
			break;
		}
		case 1: {
			const index = chatHistory.value.findIndex((item) => item.id === id);
			if (index === -1) {
				return;
			}
			if (name) {
				chatHistory.value[index].name = name;
			}
			break;
		}
		default:
			break;
	}
};
const deleteData = (type: 0 | 1, id: number) => {
	switch (type) {
		case 0: {
			const index = prompts.value.findIndex((item) => item.id === id);
			if (index === -1) {
				return;
			}
			prompts.value.splice(index, 1);
			break;
		}
		case 1: {
			const index = chatHistory.value.findIndex((item) => item.id === id);
			if (index === -1) {
				return;
			}
			chatHistory.value.splice(index, 1);
			break;
		}
		default:
			break;
	}
};
const saveData = (type: 0 | 1 | 2) => {
	switch (type) {
		case 0: {
			localStorage.setItem('prompts', JSON.stringify(prompts.value));
			break;
		}
		case 1: {
			localStorage.setItem(
				'chatHistory',
				JSON.stringify(chatHistory.value)
			);
			break;
		}
		case 2: {
			localStorage.setItem('nextId', String(nextId.value));
			break;
		}
		default:
			break;
	}
};
// 显示输入框，填写数据
// 如果type为0，则显示两个输入框
// 如果type为1，则显示一个输入框
// 使用prompt弹窗获取数据，哪天想改了再改
const showEditor = (type: 0 | 1, id: number) => {
	switch (type) {
		case 0: {
			const newName = prompt('请输入名称');
			const newPrompt = prompt('请输入内容');
			editData(type, id, newName, newPrompt);
			break;
		}
		case 1: {
			const newName = prompt('请输入名称');
			editData(type, id, newName, null);
			break;
		}
		default:
			break;
	}
};
const changeCurrentChat = (type: 0 | 1, id: number) => {
	switch (type) {
		case 0: {
			createNewChat();
			const selectedPrompt = prompts.value.find((item) => item.id === id);
			if (!selectedPrompt) {
				return;
			}
			const systemMessage: Chat = {
				role: 'system',
				content: selectedPrompt.content,
			};
			currentChat.value.push(systemMessage);
			break;
		}
		case 1: {
			const selectedChat = chatHistory.value.find(
				(item) => item.id === id
			);
			if (!selectedChat) {
				return;
			}
			currentChat.value = selectedChat.history;
			break;
		}
		default:
			break;
	}
};
const clickEventHandler = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	console.log(target);
	// 匹配类名
	const type = Number(target.getAttribute('data-type')) as 0 | 1;
	const id = Number(target.getAttribute('data-id'));
	if (target.classList.contains('edit')) {
		showEditor(type, id);
		saveData(type);
		return;
	}
	if (target.classList.contains('delete')) {
		deleteData(type, id);
		saveData(type);
		return;
	}
	if (target.classList.contains('bar')) {
		changeCurrentChat(type, id);
		return;
	}
	return;
};

const createNewChat = () => {
	const newId = nextId.value++;
	currentChat.value = [];
	currentId.value = newId;
	chatHistory.value.push({
		type: 1,
		id: newId,
		name: `对话${newId}`,
		history: [],
	});
	saveData(2);
};
const sendMessageToAI = async () => {
	try {
		const resp = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: '*/*',
			},
			body: JSON.stringify({
				model: model.value || 'gpt-4',
				messages: currentChat.value,
			}),
		});
		if (!resp.ok) {
			throw new Error(`请求失败，疑似网络原因`);
		}
		return resp;
	} catch (e) {
		throw e;
	}
};
const pushMessage = (chat: Chat) => {
	currentChat.value.push(chat);
	chatHistory.value
		.find((item) => item.id === currentId.value)
		?.history.push(chat);
	saveData(1);
};
const messageHandler = async () => {
	try {
		if (!msg.value) {
			return;
		}
		pushMessage({
			role: 'user',
			content: msg.value,
		});
		const resp = await sendMessageToAI();
		const reader = resp.body
			?.pipeThrough(new TextDecoderStream())
			.getReader();
		while (true) {
			if (!reader) {
				throw new Error('reader未定义');
			}
			const { value, done } = await reader.read();
			if (done) break;
			msg.value += value;
		}
		pushMessage({
			role: 'assistant',
			content: msg.value,
		});
		msg.value = '';
	} catch (e) {
		console.error(e);
	}
};
</script>
<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
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
