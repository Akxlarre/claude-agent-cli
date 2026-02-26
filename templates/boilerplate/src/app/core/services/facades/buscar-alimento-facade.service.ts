import { Injectable, inject } from '@angular/core';
import { FoodDatabaseService } from '../food-database.service';
import { FoodLogService } from '../food-log.service';
import { SavedMealService } from '../saved-meal.service';
import { NutritionCalculatorService } from '../nutrition-calculator.service';
import { ProductService } from '../product.service';
import type { Food, SavedMeal, OpenFoodFactsProduct } from '@core/models/nutrition.model';

/**
 * Facade para el diálogo de buscar/agregar alimento.
 * Agrupa FoodDatabaseService, FoodLogService, SavedMealService, NutritionCalculatorService y ProductService.
 */
@Injectable({
  providedIn: 'root',
})
export class BuscarAlimentoFacadeService {
  private foodDb = inject(FoodDatabaseService);
  private foodLog = inject(FoodLogService);
  private savedMealService = inject(SavedMealService);
  private calculator = inject(NutritionCalculatorService);
  private productService = inject(ProductService);

  async getRecentFoods(profileId: string, limit: number): Promise<{ data: Food[]; error: Error | null }> {
    return this.foodDb.getRecentFoods(profileId, limit);
  }

  async searchFoods(query: string, householdId: string, limit?: number): Promise<{ data: Food[]; error: Error | null }> {
    return this.foodDb.searchFoods(query, householdId, limit);
  }

  async searchOpenFoodFacts(queryOrBarcode: string): Promise<{ data: OpenFoodFactsProduct[]; error: Error | null }> {
    return this.foodDb.searchOpenFoodFacts(queryOrBarcode);
  }

  async importFromOpenFoodFacts(
    product: OpenFoodFactsProduct,
    householdId: string | null,
    createdBy: string | null
  ): Promise<{ data?: Food; error: Error | null }> {
    return this.foodDb.importFromOpenFoodFacts(product, householdId, createdBy);
  }

  async getFood(foodId: string): Promise<{ data: Food | null; error: Error | null }> {
    return this.foodDb.getFood(foodId);
  }

  async createLog(input: Parameters<FoodLogService['createLog']>[0]): Promise<ReturnType<FoodLogService['createLog']>> {
    return this.foodLog.createLog(input);
  }

  async getSavedMeals(profileId: string): Promise<{ data: SavedMeal[]; error: Error | null }> {
    return this.savedMealService.getSavedMeals(profileId);
  }

  async logSavedMeal(
    mealId: string,
    profileId: string,
    householdId: string,
    logDate: string,
    mealType: Parameters<SavedMealService['logSavedMeal']>[4],
    portions: number
  ): Promise<{ data?: number; error: Error | null }> {
    return this.savedMealService.logSavedMeal(mealId, profileId, householdId, logDate, mealType, portions);
  }

  scaleNutrients(
    nutrients: { calories: number; protein: number; carbs: number; fat: number },
    quantityG: number
  ): ReturnType<NutritionCalculatorService['scaleNutrients']> {
    return this.calculator.scaleNutrients(nutrients, quantityG);
  }

  async getProducts(filter: Parameters<ProductService['getProducts']>[0]): Promise<ReturnType<ProductService['getProducts']>> {
    return this.productService.getProducts(filter);
  }

  async updateProduct(
    id: string,
    updates: Parameters<ProductService['updateProduct']>[1]
  ): Promise<{ error: Error | null }> {
    return this.productService.updateProduct(id, updates);
  }
}
