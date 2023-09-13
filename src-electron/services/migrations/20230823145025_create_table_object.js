/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('object', function (table) {
      table.uuid('id').defaultTo(knex.fn.uuid()).primary();
      table.string('name', 255).notNullable();
      table.string('type', 255).notNullable();
      table.string('description', 1000).nullable();
      table.string('hint', 500).nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('object');
};
