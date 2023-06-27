const AppError = require("../utils/AppError");

class DishCreateService {
  constructor(dishesRepository) {
    this.dishesRepository = dishesRepository;
  }

  async execute({ name, description, price, ingredients, category_id }) {
    if (!name || !price || !category_id || !ingredients || ingredients.length == 0) {
      throw new AppError(
        "É obrigatório preencher todos os campos (Nome, Preço, Descrição, Categoria e ao menos 1 ingrediente)",
        400
      );
    }

    const dishExist = await this.dishesRepository.findByName(name);

    if (dishExist)
      throw new AppError("Já existe um prato cadastrado com este nome!", 400);

    const dish_id = await this.dishesRepository.create({
      name,
      category_id,
      price,
      description,
    });

    if (ingredients.length > 0) {
      const ingredientsInsert = ingredients.map((ingredient) => ({
        name: ingredient.trim(),
        dish_id,
      }));

      await this.dishesRepository.createDishIngredients(ingredientsInsert);
    }

    return { dish_id };
  }
}

module.exports = DishCreateService;
