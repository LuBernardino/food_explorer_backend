const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DishesRepository = require("../repositories/DishesRepository");
const DishCreateService = require("../services/DishCreateService");
const DishUpdateService = require("../services/DishUpdateService");

const dishesRepository = new DishesRepository();
const dishCreateService = new DishCreateService(dishesRepository);
const dishUpdateService = new DishUpdateService(dishesRepository);

class DishesController {
  async index(request, response) {
    const { search } = request.query;

    const dishes = await dishesRepository.findByNameOrIngredients(search);

    return response.json(dishes);
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await dishesRepository.findById(id);

    if (!dish) {
      throw new AppError("Prato não encontrado");
    }

    const dishIngredients = await dishesRepository.getIngredients(id);

    return response.json({ ...dish, ingredients: dishIngredients });
  }

  async create(request, response) {
    const { dish_id } = await dishCreateService.execute(request.body);
    return response.status(201).json({ id: dish_id });
  }

  async update(request, response) {
    const { id } = request.params;
    await dishUpdateService.execute({ id, ...request.body });
    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params;
    await dishesRepository.remove(id);
    return response.json();
  }
}

module.exports = DishesController;
