<template>
	<div
		class="items-center position-fixed bottom-2 w-4/5"
        flex="~ row"
	>
		<textarea
			v-model="msg"
			class="bg-slate-500 rounded-lg overflow-auto resize-none"
			m="l-1"
            w="11/12"
            h="24"
            p="2"
		></textarea>
		<button
			@click="sendMsg"
			class="bg-blue rounded-lg cursor-pointer"
            w="1/12"
            p="2"
            m="2"
			hover="bg-blue-500"
		>
			Send
		</button>
	</div>
</template>
<script setup lang="ts">
const msg = defineModel({
	type: String,
});
const sendMsg = () => {
	console.log(msg);
};
</script>
