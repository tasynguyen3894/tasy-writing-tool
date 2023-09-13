/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('character_extra', function (table) {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table.uuid('character_id').notNullable();
        table.string('key', 255).notNullable();
        table.string('value', 1000).nullable();
      }
    )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('character_extra');
};
