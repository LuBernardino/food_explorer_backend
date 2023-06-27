const knex = require('../database/knex');

class CategoriesRepository {
    async getAll() {
        const categories = await knex("categories");
        return categories;
    }
}

module.exports = CategoriesRepository;