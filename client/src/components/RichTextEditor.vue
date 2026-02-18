<template>
  <div class="rich-text-editor">
    <div v-if="editor" class="flex flex-wrap items-center gap-1 border-b border-primary/15 bg-surface/50 px-3 py-2">
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('bold') }"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary"
        title="Bold"
      >
        <i class="bi bi-type-bold"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('italic') }"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary"
        title="Italic"
      >
        <i class="bi bi-type-italic"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('strike') }"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary"
        title="Strikethrough"
      >
        <i class="bi bi-type-strikethrough"></i>
      </button>

      <div class="mx-1 h-5 w-px bg-primary/20"></div>

      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('bulletList') }"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary"
        title="Bullet List"
      >
        <i class="bi bi-list-ul"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('orderedList') }"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary"
        title="Numbered List"
      >
        <i class="bi bi-list-ol"></i>
      </button>

      <div class="mx-1 h-5 w-px bg-primary/20"></div>

      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('heading', { level: 3 }) }"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary"
        title="Heading"
      >
        <i class="bi bi-type-h3"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('blockquote') }"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary"
        title="Quote"
      >
        <i class="bi bi-quote"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary"
        title="Horizontal Rule"
      >
        <i class="bi bi-hr"></i>
      </button>

      <div class="mx-1 h-5 w-px bg-primary/20"></div>

      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary disabled:opacity-30"
        title="Undo"
      >
        <i class="bi bi-arrow-counterclockwise"></i>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="rounded p-1.5 text-ink/70 transition hover:bg-primary/10 hover:text-primary disabled:opacity-30"
        title="Redo"
      >
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>

    <EditorContent
      :editor="editor"
      class="prose prose-sm max-w-none border border-t-0 border-primary/15 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'outline-none min-h-[360px] max-h-[400px] overflow-y-auto'
    }
  },
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  }
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (!isSame) {
    editor.value?.commands.setContent(value, { emitUpdate: false })
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.ProseMirror {
  outline: none;
}

.ProseMirror p {
  margin: 0.5em 0;
}

.ProseMirror ul,
.ProseMirror ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.ProseMirror li {
  margin: 0.25em 0;
}

.ProseMirror h3 {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0.75em 0 0.5em;
}

.ProseMirror blockquote {
  border-left: 3px solid #f83f6b;
  padding-left: 1em;
  margin: 0.5em 0;
  color: #666;
}

.ProseMirror hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1em 0;
}
</style>
