import { Knex } from 'knex';

export class BaseApi {
  protected connection: Knex | null = null;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  destroy() {
    if(this.connection) {
      this.connection.destroy()
    }
  }
}
