
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");
const DishesRepository = require("../repositories/DishesRepository");
const dishesRepository = new DishesRepository();

class DishesImagesController {
    async update(request, response) {
        const dish_id = request.params.id;
        const imageFileName = request.file.filename;
    
        const diskStorage = new DiskStorage();
    
        const dish = await dishesRepository.findById(dish_id);
    
        if (!dish) {
          throw new AppError('Prato não encontrado', 404);
        }
    
        if (dish.image) {
          await diskStorage.deleteFile(dish.image);
        }
    
        const filename = await diskStorage.saveFile(imageFileName);
    
        dish.image = filename;
        
        await dishesRepository.update(dish)
    
        return response.json(dish);
    }
}

module.exports = DishesImagesController;