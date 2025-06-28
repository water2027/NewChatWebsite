<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import mk from 'markdown-it-katex'
import Prism from 'prismjs'
import { computed, nextTick, useTemplateRef } from 'vue'
import 'prismjs/plugins/autoloader/prism-autoloader'
import 'github-markdown-css'
import 'prismjs/themes/prism-tomorrow.css'

const { markdownContent } = defineProps<{
  markdownContent: string
}>()

const content = useTemplateRef<HTMLDivElement>('content')

Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/'

const md: MarkdownIt = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  xhtmlOut: true,
  langPrefix: 'language-',
}).use(mk, {
  throwOnError: false,
  errorColor: '#cc0000',
  strict: false,
  macros: {},
  // 块级公式的显示模式
  displayMode: true,
  // 行内公式的显示模式
  inlineMode: false,
  // 禁用错误处理
  trust: true,
})

/**
 * @description 安全的html，会自动去掉script和iframe之类的标签
 */
const safeHTML = computed(() => {
  if (!markdownContent) {
    return ''
  }

  const rendered = md.render(markdownContent)
  nextTick(() => {
    Prism.highlightAllUnder(content.value!)
  })

  return rendered
})
</script>

<template>
  <div
    ref="content"
    class="markdown-body w-full"
    data-theme="light"
    v-html="safeHTML"
  />
</template>

<style scoped>
:deep(.katex-html) {
  display: none;
}

.markdown-body {
  color: var(--color-text);
  background-color: var(--color-bg);
}

:deep(pre) {
  padding: 10px;
  position: relative;
  overflow: auto;
}

:deep(pre code) {
  display: block;
  position: relative;
}

:deep(pre code)::after {
  content: '';
  background-image: url('/PhCopy.webp');
  background-size: cover;
  display: block;
  position: sticky;
  filter: invert(1);
  z-index: 10;
  width: 20px;
  height: 20px;
  bottom: calc(100% - 20px);
  left: calc(100% - 20px);
  margin-top: -20px;
  cursor: pointer;
  pointer-events: auto;
}
</style>
