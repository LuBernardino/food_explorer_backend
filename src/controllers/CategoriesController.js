
const CategoriesRepository = require("../repositories/CategoriesRepository");

const categoriesRepository = new CategoriesRepository();

class CategoriesController {
    async index(request, response) {
        const categories = await categoriesRepository.getAll();
        return response.status(200).json(categories);
    }
}

module.exports = CategoriesController;