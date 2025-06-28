<!-- UnoCSS -->
<script setup lang="ts">
export interface SideBarProp {
  id: number
  name: string
  type: 0 | 1
}
defineProps<{
  sideBarList: SideBarProp[]
}>()
</script>

<template>
  <ul class="w-full overflow-visible">
    <li
      v-for="item in sideBarList"
      :key="item.id"
      :data-type="item.type"
      :data-id="item.id"
      class="bar flex justify-between overflow-visible"
      hover=" bg-slate"
      active="bg-slate"
      p="2"
      m="1"
      rounded="lg"
    >
      <!-- 每行最右边应该有个省略号 -->
      <span class="pointer-events-none">{{ item.name }}</span>
      <div class="group position-relative overflow-visible">
        <Icon name="lucide:ellipsis" />
        <div
          class="position-absolute z-10 hidden -translate-x-2/3"
          group-hover="block bg-dark text-gray"
          group-active="block bg-dark text-gray"
          w="16"
          p="2"
          rounded="lg"
        >
          <div
            class="edit flex cursor-pointer"
            hover="text-blue"
            active="text-blue"
            :data-type="item.type"
            :data-id="item.id"
          >
            <Icon name="material-symbols:edit" />
            编辑
          </div>
          <hr>
          <div
            class="delete flex cursor-pointer"
            hover="text-red"
            active="text-red"
            :data-type="item.type"
            :data-id="item.id"
          >
            <Icon name="ic:baseline-delete-forever" />
            删除
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
