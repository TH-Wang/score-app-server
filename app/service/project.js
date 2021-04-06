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
    const { projectId, ...rest } = data;
    const result = await this.app.mysql.update('projects', rest, {
      where: { id: projectId },
    });
    if (result.affectedRows !== 1) return null;
    return data;
  }

  // 查询项目的创建用户id
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
}

module.exports = ProjectService;
