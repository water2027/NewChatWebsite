<template>
	<div class="overflow-auto mt-8 h-[75vh]">
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
</script>
