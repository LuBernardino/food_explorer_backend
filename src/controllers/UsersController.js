const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        if(!name || !email || !password) 
            throw new AppError("É obrigatório preencher todos os campos (Name, Email e Password)", 400);

        if(password.length < 6)
            throw new AppError("A senha deve conter no mínimo 6 digitos!", 400);

        const userExist = await knex("users").where({
           email: email
        }).first();

        if(userExist)
            throw new AppError("O email já esta sendo utilizado!", 400);

        const hashedPassword = await hash(password, 8);

        const newUser = { name, email, password: hashedPassword };
        const [userId] = await knex("users").insert(newUser);

        return response.status(201).json({ id: userId });
    }
}

module.exports = UsersController;