export interface INutritionData {
  calories: string;
  protein: string;
  carbohydrates_total: string;
  carbohydrates_sugars?: string; 
  carbohydrates_fiber?: string; 
  fat_total: string;
}

export interface IApiResponse {
    food_name: string;
    serving_size?: string; 
    nutrition: INutritionData;
}