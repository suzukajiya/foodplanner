import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
