/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('chapter', function (table) {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table.string('title', 255).notNullable();
        table.string('description', 1000).nullable();
        table.string('status', 255).notNullable().defaultTo('draft');
        table.string('tags', 1000).nullable();
        table.text('content').nullable();
        table.uuid('parent_id').nullable();
        table.integer('order').nullable();
      }
    )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('chapter');
};
