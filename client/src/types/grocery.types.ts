export interface GroceryItem {
  id: string
  name: string
  size?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateGroceryItemRequest {
  name: string
  size?: string
}

export interface GroceryListSelection {
  item: GroceryItem
  quantity: number
  note: string
  noteOpen: boolean
}
