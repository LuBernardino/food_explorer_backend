/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("ingredients", (table) => {
    table.increments("id");
    table.text("name").notNullable();
    table.integer("dish_id").references("id").inTable("dishes").onUpdate('CASCADE').onDelete('CASCADE');
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("ingredients");