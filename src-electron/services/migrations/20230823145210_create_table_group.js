/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('group', function (table) {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table.string('title', 255).notNullable();
        table.string('description', 1000).nullable();
        table.uuid('parent_id').nullable();
      }
    )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('group');
};
