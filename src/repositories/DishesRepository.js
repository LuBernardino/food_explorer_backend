const knex = require("../database/knex");

class DishesRepository {
  async create({ name, description, price, category_id }) {
    const newDish = { name, description, price, category_id };
    const [id] = await knex("dishes").insert(newDish);
    return id;
  }

  async update(dish) {
    const updated_at = knex.fn.now();

    await knex("dishes")
      .update({ ...dish, updated_at })
      .where({ id: dish.id });
  }

  async createDishIngredients(ingredients) {
    await knex("ingredients").insert(ingredients);
  }

  async findByName(name) {
    const dish = await knex("dishes").where({ name }).first();
    return dish;
  }

  async findById(id) {
    const dish = await knex("dishes").where({ id }).first();
    return dish;
  }

  async findByNameOrIngredients(search) {
    return await knex
      .select("d.*")
      .from("dishes as d")
      .join("ingredients as i", "d.id", "i.dish_id")
      .whereLike("d.name", `%${search}%`)
      .orWhereLike("i.name", `%${search}%`)
      .groupBy("d.id");
  }

  async remove(id) {
    await knex('dishes').delete().where({ id });
  }

  async removeIngredients({ dish_id, remove }) {
    await knex("ingredients")
      .delete()
      .where({ dish_id })
      .whereIn("name", remove);
  }

  async removeAllIngredients(dish_id) {
    await knex("ingredients").delete().where({ dish_id });
  }

  async getIngredients(dish_id) {
    return await knex("ingredients").where({ dish_id }).orderBy("name");
  }
}

module.exports = DishesRepository;
