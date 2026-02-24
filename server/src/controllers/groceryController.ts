import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STATE_ID = 'default';

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
      orderBy: { name: 'asc' }
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
    const { name, size } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const item = await prisma.groceryItem.create({
      data: { name, size: size || null }
    });
    res.status(201).json(item);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A grocery item with this name already exists' });
    }
    console.error('Error creating grocery item:', error);
    res.status(500).json({ error: 'Failed to create grocery item' });
  }
};

export const updateGroceryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, size } = req.body;

    const existing = await prisma.groceryItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Grocery item not found' });
    }

    const item = await prisma.groceryItem.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(size !== undefined && { size: size || null })
      }
    });
    res.json(item);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A grocery item with this name already exists' });
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
