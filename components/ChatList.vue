<template>
	<div class="overflow-auto mt-8 h-[75vh]" @click="clickHandler">
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
				class="flex flex-col items-start w-2/3"
			>
				<div class="flex items-center">
					<span class="ml-2 text-white">Assistant</span>
				</div>
				<MarkdownContainer
					:markdownContent="chat.content"
					class="p-2 bg-slate-500 rounded-lg"
				/>
			</div>
			<div
				v-else-if="chat.role === 'user'"
				class="flex flex-col items-end w-4/5"
				m="l-a r-12"
			>
				<div class="flex items-center">
					<span class="mr-2 text-white">User</span>
				</div>
				<div class="p-2 bg-slate-500 rounded-lg">
					{{ chat.content }}
				</div>
			</div>
			<div
				v-else
				class="flex flex-col items-center w-4/5"
			>
				<div class="p-2 bg-slate-500 rounded-lg">
					system:{{ chat.content }}
				</div>
			</div>
		</div>
		<div
            v-if="nextMsg"
			class="flex flex-col items-start w-2/3"
		>
			<div class="flex items-center">
				<span class="ml-2 text-white">Assistant</span>
			</div>
			<MarkdownContainer
				:markdownContent="nextMsg"
				class="p-2 bg-slate-500 rounded-lg"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
export interface Chat {
	role: 'assistant' | 'user' | 'system';
	content: string;
}
defineProps<{
	chats: Chat[];
	nextMsg:string;
}>();

const createHeart = (e:MouseEvent) => {
	const x = e.clientX;
	const y = e.clientY;
	const heart = document.createElement('b');
	heart.style.left = `${x}px`;
	heart.style.top = `${y}px`;
	heart.style.zIndex = '9999';
	heart.style.position = 'absolute';
	heart.innerHTML = '复制成功';
	document.body.appendChild(heart);
	heart.animate(
		[
			{ top: `${y}px`, opacity: 1 },
			{ top: `${y - 100}px`, opacity: 0 },
		],
		{
			duration: 1500,
			easing: 'ease',
		}
	);
	setTimeout(() => {
		heart.remove();
	}, 1500);
};
// 适配复制功能
// 如果新的API支持，则返回新的API的函数
// 否则返回旧的API的函数
const copyCreator = () => {
	if (navigator&&navigator.clipboard) {
		return async (text: string) => {
			try {
				await navigator.clipboard.writeText(text);
				console.log('复制成功');
			} catch (e) {
				console.error('复制失败', e);
			}
		};
	} else {
		return (text: string) => {
			const input = document.createElement('input');
			input.value = text;
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			document.body.removeChild(input);
		};
	}
}
const copyHandler = copyCreator();
const clickHandler = (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	if (target.tagName === 'PRE' && target.children[0].tagName === 'CODE') {
		const code = target.children[0] as HTMLElement;
		copyHandler(code.innerText);
		createHeart(e);
	}
};
</script>
