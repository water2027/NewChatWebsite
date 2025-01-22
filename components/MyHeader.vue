<template>
	<header class="position-fixed flex justify-between overflow-visible *:overflow-visible"
	top="2"
	right="0"
	w="4/5"
	>
		
		<select
			class="h-6 w-32 bg-white border border-gray-300 rounded-md shadow-sm"
			m="l-2"
			focus="outline-none border-blue-500"
			v-model="model"
			@change="() => $emit('changeModel', model)"
		>
			<option
				v-for="(item, i) in models"
				:key="i"
				:value="item"
			>
				{{ item }}
			</option>
		</select>
		<div class="group position-relative" m="r-2">
			<img
				class="w-16 h-16 object-fill rounded-full"
				src="/head.webp"
				alt="我"
			/>
			<div
				class="z-10 hidden position-absolute -translate-x-1/2"
				group-hover="block bg-dark text-gray"
				group-active="block bg-dark text-gray"
				w="20"
				p="2"
				rounded="lg"
			>
				<div class="my-1">
					<a
						href="https://www.w4ter.com"
						target="_blank"
						class="text-gray"
						hover="text-blue"
						>我的博客</a
					>
				</div>
				<hr />
				<div class="my-1">
					<a
						href="https://www.w4ter.com"
						target="_blank"
						class="text-gray"
						hover="text-blue"
						>支持一下</a
					>
				</div>
			</div>
		</div>
	</header>
</template>
<script setup lang="ts">
import models from '~/assets/models.json';

const emit = defineEmits(['changeModel']);
const model = ref(models[0]);
const sendModel = () => emit('changeModel', model.value);
onMounted(() => {
	sendModel();
});
</script>
