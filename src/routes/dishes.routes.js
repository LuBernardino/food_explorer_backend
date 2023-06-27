const { Router } = require("express");
const uploadConfig = require("../configs/upload");
const multer = require("multer");

const upload = multer(uploadConfig.MULTER);

const DishesController = require("../controllers/DishesController");
const DishesImagesController = require("../controllers/DishesImagesController");

const dishesRoutes = Router();

const dishesController = new DishesController();
const dishImageController = new DishesImagesController();

dishesRoutes.post("/", dishesController.create);
dishesRoutes.put('/:id', dishesController.update);
dishesRoutes.delete('/:id', dishesController.delete);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get('/:id', dishesController.show);

dishesRoutes.patch(
  "/image/:id",
  upload.single("image"),
  dishImageController.update
);

module.exports = dishesRoutes;