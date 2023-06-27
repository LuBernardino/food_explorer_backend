const AppError = require("../utils/AppError");

class DishUpdateService {
  constructor(dishesRepository) {
    this.dishesRepository = dishesRepository;
  }

  async execute({ id, name, description, price, ingredients, category_id }) {
    if (
      !name ||
      !price ||
      !category_id ||
      !ingredients ||
      ingredients.length == 0
    ) {
      throw new AppError(
        "É obrigatório preencher todos os campos (Nome, Preço, Descrição, Categoria e ao menos 1 ingrediente)",
        400
      );
    }

    const dish = await this.dishesRepository.findById(id);

    if (!dish) {
      throw new AppError("Prato não encontrado");
    }

    dish.name = name ?? dish.name;
    dish.category_id = category_id ?? dish.category_id;
    dish.price = price ?? dish.price;
    dish.description = description ?? dish.description;

    await this.dishesRepository.update(dish);

    ingredients = ingredients ?? [];

    if (ingredients.length > 0) {
      const oldIngredients = await this.dishesRepository
        .getIngredients(id)
        .then((data) => data.map((ingredients) => ingredients.name));

      // remove os ingredients anteriores
      const remove = oldIngredients.filter(
        (ingredient) => !ingredients.includes(ingredient)
      );

      await this.dishesRepository.removeIngredients({ dish_id: id, remove });

      // insere ingredientes novos
      const newIngredients = ingredients
        .filter((ingredient) => !oldIngredients.includes(ingredient))
        .map((ingredient) => ({
          name: ingredient.trim(),
          dish_id: id,
        }));

      if (newIngredients.length !== 0) {
        await this.dishesRepository.createDishIngredients(newIngredients);
      }
    } else {
      await this.dishesRepository.removeAllIngredients(id);
    }
  }
}

module.exports = DishUpdateService;
