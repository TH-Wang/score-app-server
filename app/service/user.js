'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  // 查询 users 列表
  async list(limit, page) {
    const users = await this.app.mysql.select('users', {
      // order: [ 'id', 'desc' ],
      limit,
      offset: (page - 1) * limit,
    });
    return users;
  }

  // 根据 id 查找用户信息
  async find(id) {
    return await this.app.mysql.get('users', { id });
  }

  async findByName(name) {
    return await this.app.mysql.get('users', { username: name });
  }

  async validate(fields) {
    const result = await this.app.mysql.get('users', fields);
    if (!result) return { valid: false, result };
    return { valid: true, result };
  }

  async insert(data) {
    const { ctx, app } = this;
    const result = await app.mysql.insert('users', data);
    if (result.affectedRows !== 1) {
      ctx.response.error(500, 'sql error', 'failed to insert user info into database');
    }
    return result.insertId;
  }
}

module.exports = UserService;
