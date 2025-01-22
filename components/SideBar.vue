<!-- UnoCSS -->
<template>
	<ul class="w-full overflow-visible">
		<li
			v-for="item in sideBarList"
			:key="item.id"
			class="flex justify-between overflow-visible"
			hover=" bg-slate"
			active="bg-slate"
			p="2"
			m="1"
			rounded="lg"
		>
			<!-- 每行最右边应该有个省略号 -->
			<span>{{ item.name }}</span>
			<div class="group position-relative overflow-visible">
				<Icon name="lucide:ellipsis" />
				<div
					class="z-10 hidden position-absolute -translate-x-2/3"
					group-hover="block bg-dark text-gray"
					group-active="block bg-dark text-gray"
					w="16"
					p="2"
					rounded="lg"
				>
					<div
						class="event flex cursor-pointer"
						hover="text-blue"
						active="text-blue"
					>
						<Icon name="material-symbols:edit" />
						编辑
					</div>
					<hr />
					<div
						class="event flex cursor-pointer"
						hover="text-red"
						active="text-red"
					>
						<Icon name="ic:baseline-delete-forever" />
						删除
					</div>
				</div>
			</div>
		</li>
	</ul>
</template>

<script setup lang="ts">
export interface SideBarProp {
	type: string;
	id: string;
	name: string;
}
defineProps<{
	sideBarList: SideBarProp[];
}>();
</script>
