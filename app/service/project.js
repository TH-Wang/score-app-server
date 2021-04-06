'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {

  // 添加项目
  async insert(data) {
    const { ctx, app } = this;
    const result = await app.mysql.insert('projects', data);
    if (result.affectedRows !== 1) {
      ctx.response.error(500, 'sql error', 'failed to insert user info into database');
    }
    return result.insertId;
  }

  // 通过id查询项目信息
  async find(id) {
    return await this.app.mysql.get('projects', { id });
  }

  // 通过userId查询项目列表
  async findProjectByUser(userId) {
    return await this.app.mysql.select('projects', {
      where: { userId },
    });
  }

  // 通过userId，查询该用户参与过的项目
  async findUserJoin(userId) {
    const sql = `
      SELECT 
        DISTINCT r.userId, p.id, p.pname, p.isTemplate, p.needAuth, 
        p.hits, p.createAt, p.updateAt, p.userId AS creator 
      FROM results r LEFT JOIN projects p ON r.projectId = p.id
      WHERE r.userId = ?
    `;
    const result = await this.app.mysql.query(sql, [ userId ]);
    result.forEach(item => {
      item.isOwnCreate = item.creator === Number(userId);
      delete item.userId;
      delete item.creator;
    });
    return result;
  }

  // 查询所有模板
  async findAllTemplate() {
    return await this.app.mysql.select('projects', {
      where: { isTemplate: 1 },
    });
  }

  // 根据名称查询模板
  async findTemByName(pname) {
    return await this.app.mysql.select('projects', {
      where: { isTemplate: 1, pname },
    });
  }

  // 修改项目信息
  async update(data) {
    const { id, ...rest } = data;
    const result = await this.app.mysql.update('projects', rest, {
      where: { id },
    });
    if (result.affectedRows !== 1) return null;
    return data;
  }

  // 查询项目的创建者id
  async findCreator(id) {
    const result = await this.app.mysql.get('projects', { id });

    if (!result) return null;
    return result.userId;
  }

  // 删除项目
  async delete(id) {
    const result = await this.app.mysql.delete('projects', { id });
    return result.affectedRows === 1;
  }

  // 增加点击量
  async addHits(id) {
    const result = await this.app.mysql.beginTransactionScope(async conn => {
      const { hits } = await conn.get('projects', { id });
      const newHits = hits ? hits + 1 : 1;
      await conn.update('projects', { hits: newHits }, { where: { id } });
      return newHits;
    }, this.ctx);
    return result;
  }
}

module.exports = ProjectService;
