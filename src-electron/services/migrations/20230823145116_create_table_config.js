/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('config', function (table) {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table.string('key', 255).notNullable();
        table.string('title', 255).notNullable();
        table.string('value', 1000).nullable();
      }
    )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('config');
};
