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
			>
				<SideBar :side-bar-list="prompts" />
				<hr />
				<SideBar :side-bar-list="chatHistory" />
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
			<MyHeader />
			<ChatList :chats="chats" />
			<MessageEditor v-model="msg" />
		</main>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import type { SideBarProp } from './components/SideBar.vue';
import type { Chat } from '~/components/ChatList.vue';

import { useMyHook } from '#imports';

const prompts: SideBarProp[] = [
	{
		name: 'test1',
		id: '1',
		type: 'test',
	},
];
const chatHistory: SideBarProp[] = [
	{
		name: 'test2',
		id: '2',
		type: 'test',
	},
];
const chats: Chat[] = [
	{
		role: 'assistant',
		content:
			'```js\nconsole.log("hello")',
	},
	{
		role: 'user',
		content: 'I have a problem with my account.',
	},
	{
		role: 'assistant',
		content: 'What seems to be the problem?',
	},
	{
		role: 'user',
		content: 'I have a problem with my account.',
	},
	{
		role: 'assistant',
		content: 'What seems to be the problem?',
	},
	{
		role: 'user',
		content: 'I have a problem with my account.',
	},
	{
		role: 'assistant',
		content: 'What seems to be the problem?',
	},
];
const msg = ref('');

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

onMounted(() => {
	widthChangeHandler();
	if (!isPC.value) {
		asideStatus.value = false;
	}
});

const widthChangeHandler = () => {
	const newStatus = window.innerWidth < 768 ? false : true;
	if (newStatus == isPC.value) {
		return;
	}
	isPC.value = newStatus;
};
useMyHook(widthChangeHandler);
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
