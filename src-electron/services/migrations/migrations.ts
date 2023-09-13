import knex, { Knex } from 'knex';

export type MigrationFunction = (knex: Knex) => Promise<void>;

export interface Migration {
  name: string
  up: MigrationFunction
  down: MigrationFunction
}

export const migrations: Migration[] = [
  {
    name: '20230823144838_create_table_character.js',
    up(knex: Knex) {
      return knex.schema
        .createTable('character', function (table) {
          table.uuid('id').defaultTo(knex.fn.uuid()).primary();
          table.string('name', 255).notNullable();
          table.string('alias', 255).notNullable;
          table.string('description', 1000).nullable();
          table.string('hint', 500).nullable();
          table.unique(['alias']);
        });
    },
    down(knex: Knex) {
      return knex.schema.dropTableIfExists('character');
    }
  },
  {
    name: '20230823144957_create_table_character_extra.js',
    up(knex: Knex) {
      return knex.schema
        .createTable('character_extra', function (table) {
            table.uuid('id').defaultTo(knex.fn.uuid()).primary();
            table.uuid('character_id').notNullable();
            table.string('key', 255).notNullable();
            table.string('value', 1000).nullable();
          }
        )
    },
    down(knex: Knex) {
      return knex.schema.dropTable('character_extra');
    }
  },
  {
    name: '20230823145025_create_table_object.js',
    up(knex: Knex) {
      return knex.schema
        .createTable('object', function (table) {
          table.uuid('id').defaultTo(knex.fn.uuid()).primary();
          table.string('name', 255).notNullable();
          table.string('type', 255).notNullable();
          table.string('description', 1000).nullable();
          table.string('hint', 500).nullable();
        });
    },
    down(knex: Knex) {
      return knex.schema.dropTable('object');
    }
  },
  {
    name: '20230823145048_create_table_object_extra.js',
    up(knex: Knex) {
      return knex.schema
        .createTable('object_extra', function (table) {
          table.uuid('id').defaultTo(knex.fn.uuid()).primary();
          table.uuid('object_id').notNullable();
          table.string('key', 255).notNullable();
          table.string('value', 1000).nullable();
        }
      )
    },
    down(knex: Knex) {
      return knex.schema.dropTable('object_extra');
    }
  },
  {
    name: '20230823145116_create_table_config.js',
    up(knex: Knex) {
      return knex.schema
        .createTable('config', function (table) {
            table.uuid('id').defaultTo(knex.fn.uuid()).primary();
            table.string('key', 255).notNullable();
            table.string('title', 255).notNullable();
            table.string('value', 1000).nullable();
          }
        )
    },
    down(knex: Knex) {
      return knex.schema.dropTable('config');
    }
  },
  {
    name: '20230823145150_create_table_chapter.js',
    up(knex: Knex) {
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
    },
    down(knex: Knex) {
      return knex.schema.dropTable('chapter');
    }
  },
  {
    name: '20230823145210_create_table_group.js',
    up(knex: Knex) {
      return knex.schema
        .createTable('group', function (table) {
            table.uuid('id').defaultTo(knex.fn.uuid()).primary();
            table.string('title', 255).notNullable();
            table.string('description', 1000).nullable();
            table.uuid('parent_id').nullable();
          }
        )
    },
    down(knex: Knex) {
      return knex.schema.dropTable('group');
    }
  },
];

export function createMigrationTable(knex: Knex): Promise<void> {
  return new Promise((resolve, reject) => {
    knex.schema.hasTable('knex_migrations').then(function(exists) {
      if(!exists) {
        knex.schema
        .createTable('knex_migrations', function (table) {
          table.increments('id');
          table.string('name', 255).notNullable();
          table.timestamp('migration_time', { precision: 6 }).defaultTo(knex.fn.now());
        }).then(() => {
          resolve();
        }).catch(error => reject(error));
      } else {
        resolve();
      }
    }).catch(error => reject(error));
  })
}
