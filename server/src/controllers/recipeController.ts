import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateRecipeDto, UpdateRecipeDto } from '../types/recipe.types';

const prisma = new PrismaClient();

export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

export const createRecipe = async (req: Request, res: Response) => {
  try {
    const data: CreateRecipeDto = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        name: data.name,
        description: data.description,
        author: data.author,
        comment: data.comment,
        servingSize: data.servingSize || 1,
        type: data.type,
        difficulty: data.difficulty,
        cost: data.cost,
        seasons: data.seasons,
        timings: data.timings,
        recipeIngredients: {
          create: await Promise.all(
            data.ingredients.map(async (ing) => {
              let ingredient = await prisma.ingredient.findUnique({
                where: { name: ing.name }
              });

              if (!ingredient) {
                ingredient = await prisma.ingredient.create({
                  data: {
                    name: ing.name,
                    defaultUnit: ing.unit
                  }
                });
              }

              return {
                quantity: ing.quantity,
                unit: ing.unit,
                ingredient: {
                  connect: { id: ingredient.id }
                }
              };
            })
          )
        }
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: UpdateRecipeDto = req.body;

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id }
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (data.ingredients) {
      await prisma.recipeIngredient.deleteMany({
        where: { recipeId: id }
      });
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.comment !== undefined && { comment: data.comment }),
        ...(data.servingSize !== undefined && { servingSize: data.servingSize }),
        ...(data.type && { type: data.type }),
        ...(data.difficulty && { difficulty: data.difficulty }),
        ...(data.cost && { cost: data.cost }),
        ...(data.seasons && { seasons: data.seasons }),
        ...(data.timings && { timings: data.timings }),
        ...(data.ingredients && {
          recipeIngredients: {
            create: await Promise.all(
              data.ingredients.map(async (ing) => {
                let ingredient = await prisma.ingredient.findUnique({
                  where: { name: ing.name }
                });

                if (!ingredient) {
                  ingredient = await prisma.ingredient.create({
                    data: {
                      name: ing.name,
                      defaultUnit: ing.unit
                    }
                  });
                }

                return {
                  quantity: ing.quantity,
                  unit: ing.unit,
                  ingredient: {
                    connect: { id: ingredient.id }
                  }
                };
              })
            )
          }
        })
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    });

    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id }
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await prisma.recipe.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};
