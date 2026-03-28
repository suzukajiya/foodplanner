import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STATE_ID = 'default';

const normalizeGroceryField = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const getListState = async (req: Request, res: Response) => {
  try {
    const state = await prisma.groceryListState.findUnique({
      where: { id: STATE_ID },
      include: { entries: { include: { item: true } } }
    });
    if (!state) return res.json({ entries: [] });
    res.json({ entries: state.entries });
  } catch (error) {
    console.error('Error fetching list state:', error);
    res.status(500).json({ error: 'Failed to fetch list state' });
  }
};

export const saveListState = async (req: Request, res: Response) => {
  try {
    const { entries } = req.body as {
      entries: { itemId: string; quantity: number; note: string }[];
    };

    await prisma.$transaction(async (tx) => {
      await tx.groceryListState.upsert({
        where: { id: STATE_ID },
        create: { id: STATE_ID },
        update: {}
      });

      await tx.groceryListEntry.deleteMany({ where: { stateId: STATE_ID } });

      if (entries && entries.length > 0) {
        await tx.groceryListEntry.createMany({
          data: entries.map(e => ({
            stateId: STATE_ID,
            itemId: e.itemId,
            quantity: e.quantity,
            note: e.note ?? ''
          }))
        });
      }
    });

    const state = await prisma.groceryListState.findUnique({
      where: { id: STATE_ID },
      include: { entries: { include: { item: true } } }
    });

    res.json({ entries: state?.entries ?? [] });
  } catch (error) {
    console.error('Error saving list state:', error);
    res.status(500).json({ error: 'Failed to save list state' });
  }
};

export const resetListState = async (req: Request, res: Response) => {
  try {
    await prisma.groceryListEntry.deleteMany({ where: { stateId: STATE_ID } });
    res.json({ entries: [] });
  } catch (error) {
    console.error('Error resetting list state:', error);
    res.status(500).json({ error: 'Failed to reset list state' });
  }
};

export const getAllGroceryItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.groceryItem.findMany({
      orderBy: [{ name: 'asc' }, { size: 'asc' }]
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching grocery items:', error);
    res.status(500).json({ error: 'Failed to fetch grocery items' });
  }
};

export const getGroceryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.groceryItem.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ error: 'Grocery item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching grocery item:', error);
    res.status(500).json({ error: 'Failed to fetch grocery item' });
  }
};

export const createGroceryItem = async (req: Request, res: Response) => {
  try {
    const name = normalizeGroceryField(req.body.name);
    const size = normalizeGroceryField(req.body.size);
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const existing = await prisma.groceryItem.findFirst({
      where: { name, size }
    });

    if (existing) {
      return res.status(409).json({ error: 'A grocery item with this name and size already exists' });
    }

    const item = await prisma.groceryItem.create({
      data: { name, size }
    });
    res.status(201).json(item);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A grocery item with this name and size already exists' });
    }
    console.error('Error creating grocery item:', error);
    res.status(500).json({ error: 'Failed to create grocery item' });
  }
};

export const updateGroceryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name: incomingName, size: incomingSize } = req.body;

    const existing = await prisma.groceryItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Grocery item not found' });
    }

    const name = incomingName !== undefined ? normalizeGroceryField(incomingName) : existing.name;
    const size = incomingSize !== undefined ? normalizeGroceryField(incomingSize) : existing.size;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const duplicate = await prisma.groceryItem.findFirst({
      where: {
        name,
        size,
        NOT: { id }
      }
    });

    if (duplicate) {
      return res.status(409).json({ error: 'A grocery item with this name and size already exists' });
    }

    const item = await prisma.groceryItem.update({
      where: { id },
      data: {
        ...(incomingName !== undefined && { name }),
        ...(incomingSize !== undefined && { size })
      }
    });
    res.json(item);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A grocery item with this name and size already exists' });
    }
    console.error('Error updating grocery item:', error);
    res.status(500).json({ error: 'Failed to update grocery item' });
  }
};

export const deleteGroceryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.groceryItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Grocery item not found' });
    }
    await prisma.groceryItem.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting grocery item:', error);
    res.status(500).json({ error: 'Failed to delete grocery item' });
  }
};
