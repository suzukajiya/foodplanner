<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-4xl">Grocery List</h1>
      <button @click="showAddModal = true" class="btn-primary">
        <i class="bi bi-plus-circle mr-2"></i>Add Item
      </button>
    </div>

    <!-- Two-column layout -->
    <div class="grid lg:grid-cols-3 gap-6">

      <!-- Left: Item catalogue -->
      <div class="lg:col-span-2 space-y-2">
        <div class="mb-4 flex items-center gap-3">
          <div class="relative flex-1">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Search items..."
              class="w-full rounded-md border border-primary/20 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder-ink/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <span class="text-sm text-ink/50 whitespace-nowrap">
            {{ selectedIds.size }} selected
          </span>
        </div>

        <div v-if="loading" class="bg-white p-12 text-center shadow-soft rounded-md">
          <i class="bi bi-hourglass-split text-3xl text-primary/50"></i>
          <p class="mt-4 text-ink/60">Loading items...</p>
        </div>

        <div v-else-if="error" class="bg-white p-8 shadow-soft rounded-md">
          <p class="text-sm text-red-600">
            <i class="bi bi-exclamation-triangle mr-2"></i>{{ error }}
          </p>
        </div>

        <div v-else-if="filteredItems.length === 0 && !search" class="bg-white p-12 text-center shadow-soft rounded-md">
          <i class="bi bi-cart text-4xl text-primary/50"></i>
          <p class="mt-4 text-lg text-ink/70">No grocery items yet</p>
          <p class="mt-2 text-sm text-ink/50">Click "Add Item" to build your list</p>
        </div>

        <div v-else-if="filteredItems.length === 0 && search" class="bg-white p-8 text-center shadow-soft rounded-md">
          <p class="text-ink/50">No items match "{{ search }}"</p>
        </div>

        <template v-else>
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div
              v-for="item in filteredItems"
              :key="item.id"
              class="rounded-md border bg-white shadow-sm transition-all"
              :class="isSelected(item.id)
                ? 'border-primary/40 ring-1 ring-primary/20'
                : 'border-primary/10 hover:border-primary/25'"
            >
              <!-- Item row -->
              <div class="flex items-center gap-3 px-4 py-3">
                <button
                  @click="toggleItem(item)"
                  class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border-2 transition-colors"
                  :class="isSelected(item.id)
                    ? 'border-primary bg-primary text-white'
                    : 'border-ink/30 hover:border-primary'"
                >
                  <i v-if="isSelected(item.id)" class="bi bi-check text-sm leading-none"></i>
                </button>

                <div class="flex-1 min-w-0">
                  <p class="font-medium text-ink" :class="{ 'line-through text-ink/50': isSelected(item.id) }">
                    {{ item.name }}
                  </p>
                  <p v-if="item.size" class="text-xs text-ink/50 mt-0.5">{{ item.size }}</p>
                </div>

                <!-- Quantity selector — visible only when selected -->
                <div v-if="isSelected(item.id)" class="flex items-center gap-2">
                  <label class="text-xs text-ink/50 whitespace-nowrap">Qty</label>
                  <select
                    :value="getSelection(item.id)!.quantity"
                    @change="updateQuantity(item.id, +($event.target as HTMLSelectElement).value)"
                    class="rounded border border-primary/30 bg-white px-2 py-1 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option v-for="n in 20" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>

                <!-- Item actions -->
                <div class="flex items-center gap-1">
                  <button
                    v-if="isSelected(item.id)"
                    @click="toggleNote(item.id)"
                    class="rounded p-1.5 transition"
                    :class="getSelection(item.id)!.noteOpen
                      ? 'bg-primary/10 text-primary'
                      : 'text-ink/40 hover:bg-primary/10 hover:text-primary'"
                    title="Toggle note"
                  >
                    <i class="bi bi-chat-right-text text-sm"></i>
                  </button>
                  <button
                    @click="openEdit(item)"
                    class="rounded p-1.5 text-ink/40 transition hover:bg-primary/10 hover:text-primary"
                    title="Edit"
                  >
                    <i class="bi bi-pencil text-sm"></i>
                  </button>
                  <button
                    @click="handleDelete(item)"
                    :disabled="deletingId === item.id"
                    class="rounded p-1.5 text-ink/40 transition hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <i class="bi bi-trash text-sm"></i>
                  </button>
                </div>
              </div>

              <!-- Notes field — toggled by note button -->
              <div v-if="isSelected(item.id) && getSelection(item.id)!.noteOpen" class="border-t border-primary/10 px-4 py-2">
                <input
                  type="text"
                  placeholder="Add a note for this item (optional)..."
                  :value="getSelection(item.id)!.note"
                  @input="updateNote(item.id, ($event.target as HTMLInputElement).value)"
                  class="w-full rounded border border-transparent bg-primary/5 px-3 py-1.5 text-sm text-ink placeholder-ink/40 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Right: Generated list panel -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 rounded-md border border-primary/20 bg-white shadow-soft">
          <div class="border-b border-primary/10 px-5 py-4 flex items-center justify-between">
            <h2 class="font-heading text-lg text-ink">Shopping List</h2>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {{ selectedIds.size }} items
            </span>
          </div>

          <div class="px-5 py-4">
            <div v-if="selectedIds.size === 0" class="py-8 text-center">
              <i class="bi bi-cart3 text-3xl text-primary/30"></i>
              <p class="mt-3 text-sm text-ink/50">Check items on the left to build your list</p>
            </div>

            <div v-else class="space-y-1">
              <p
                v-for="line in generatedLines"
                :key="line"
                class="text-sm text-ink/80 font-mono leading-relaxed"
              >
                {{ line }}
              </p>
            </div>

            <div v-if="selectedIds.size > 0" class="mt-5 space-y-2 border-t border-primary/10 pt-4">
              <button
                @click="copyToClipboard"
                class="w-full rounded-md border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
              >
                <i class="bi bi-clipboard mr-2"></i>
                {{ copied ? 'Copied!' : 'Copy to Clipboard' }}
              </button>
              <button
                @click="clearSelection"
                class="w-full rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink/80"
              >
                <i class="bi bi-x-circle mr-2"></i>Clear Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModals"></div>
        <div class="relative w-full max-w-md rounded-xl bg-white shadow-xl">
          <div class="border-b border-primary/10 px-6 py-4 flex items-center justify-between">
            <h3 class="font-heading text-xl text-ink">
              {{ showEditModal ? 'Edit Item' : 'Add Grocery Item' }}
            </h3>
            <button @click="closeModals" class="text-ink/40 transition hover:text-ink/70">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-ink/70 mb-1">
                Item Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="e.g. Coke"
                required
                class="w-full rounded-md border border-primary/20 px-3 py-2 text-sm text-ink placeholder-ink/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-ink/70 mb-1">Size / Volume</label>
              <input
                v-model="form.size"
                type="text"
                placeholder="e.g. 1.5 Liter, 500 gram"
                class="w-full rounded-md border border-primary/20 px-3 py-2 text-sm text-ink placeholder-ink/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p class="mt-1 text-xs text-ink/40">The size or weight of each unit</p>
            </div>

            <!-- Preview -->
            <div v-if="form.name" class="rounded-md bg-primary/5 px-3 py-2 text-xs text-ink/60">
              <span class="font-medium text-ink/80">Preview: </span>{{ previewLine }}
            </div>

            <div v-if="formError" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              <i class="bi bi-exclamation-triangle mr-1"></i>{{ formError }}
            </div>

            <div class="flex justify-end gap-3 pt-1">
              <button type="button" @click="closeModals" class="btn-secondary">Cancel</button>
              <button type="submit" :disabled="saving" class="btn-primary">
                <i v-if="saving" class="bi bi-hourglass-split mr-2 animate-spin"></i>
                {{ saving ? 'Saving...' : (showEditModal ? 'Save Changes' : 'Add Item') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { groceryApi } from '@/services/api'
import type { GroceryItem, GroceryListSelection } from '@/types/grocery.types'

const items = ref<GroceryItem[]>([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const deletingId = ref<string | null>(null)
const copied = ref(false)

const showAddModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const formError = ref('')
const editingId = ref<string | null>(null)

const form = ref({ name: '', size: '' })

const selections = ref<Map<string, GroceryListSelection>>(new Map())
const selectedIds = computed(() => new Set(selections.value.keys()))

const filteredItems = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return items.value
  return items.value.filter(i => i.name.toLowerCase().includes(q))
})

const generatedLines = computed(() => {
  return Array.from(selections.value.values()).map(sel => {
    const parts: string[] = [sel.item.name]
    parts.push(String(sel.quantity))
    if (sel.item.size) parts.push(sel.item.size)
    const line = parts.join(' - ')
    return sel.note ? `${line}  (${sel.note})` : line
  })
})

const previewLine = computed(() => {
  const parts: string[] = [form.value.name, '1']
  if (form.value.size) parts.push(form.value.size)
  return parts.join(' - ')
})

const isSelected = (id: string) => selections.value.has(id)
const getSelection = (id: string) => selections.value.get(id)

const toggleItem = (item: GroceryItem) => {
  if (selections.value.has(item.id)) {
    selections.value.delete(item.id)
  } else {
    selections.value.set(item.id, { item, quantity: 1, note: '', noteOpen: false })
  }
}

const toggleNote = (id: string) => {
  const sel = selections.value.get(id)
  if (sel) selections.value.set(id, { ...sel, noteOpen: !sel.noteOpen })
}

const updateQuantity = (id: string, quantity: number) => {
  const sel = selections.value.get(id)
  if (sel) selections.value.set(id, { ...sel, quantity })
}

const updateNote = (id: string, note: string) => {
  const sel = selections.value.get(id)
  if (sel) selections.value.set(id, { ...sel, note })
}

const clearSelection = () => {
  selections.value.clear()
}

const copyToClipboard = async () => {
  const text = generatedLines.value.join('\n')
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}

const openEdit = (item: GroceryItem) => {
  editingId.value = item.id
  form.value = { name: item.name, size: item.size || '' }
  showEditModal.value = true
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingId.value = null
  form.value = { name: '', size: '' }
  formError.value = ''
}

const handleSave = async () => {
  formError.value = ''
  saving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      size: form.value.size.trim() || undefined
    }
    if (showEditModal.value && editingId.value) {
      const res = await groceryApi.update(editingId.value, payload)
      const idx = items.value.findIndex(i => i.id === editingId.value)
      if (idx !== -1) items.value[idx] = res.data
      const sel = selections.value.get(editingId.value!)
      if (sel) selections.value.set(editingId.value!, { ...sel, item: res.data })
    } else {
      const res = await groceryApi.create(payload)
      items.value.push(res.data)
      items.value.sort((a, b) => a.name.localeCompare(b.name))
    }
    closeModals()
  } catch (err: any) {
    formError.value = err.response?.data?.error || 'Failed to save item'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (item: GroceryItem) => {
  if (!confirm(`Delete "${item.name}"?`)) return
  deletingId.value = item.id
  try {
    await groceryApi.delete(item.id)
    items.value = items.value.filter(i => i.id !== item.id)
    selections.value.delete(item.id)
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to delete item'
  } finally {
    deletingId.value = null
  }
}

const fetchItems = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await groceryApi.getAll()
    items.value = res.data
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load grocery items'
  } finally {
    loading.value = false
  }
}

onMounted(fetchItems)
</script>
