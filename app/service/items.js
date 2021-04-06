'use strict';

const Service = require('egg').Service;

class ItemsService extends Service {

  async insert({ projectId, title, type, ...rest }) {
    const { ctx, app } = this;
    const conn = await app.mysql.beginTransaction();
    let result = null;

    try {
      let sort = null;
      // 如果没有传入sort，则寻找出最大的sort值
      const sql = 'SELECT MAX(sort) AS value FROM items WHERE projectId=?';
      const max = await conn.query(sql, [ projectId ]);
      const value = max[0].value;
      if (!rest.sort || rest.sort <= value) {
        sort = Number(value) + 1;
      } else sort = rest.sort;
      // 插入所有数据
      result = await conn.insert('items', { projectId, title, type, sort });
      await conn.commit();
    } catch (error) {
      // 捕获异常后回滚事务
      await conn.rollback();
      ctx.response.error(500, 'sql error', error.message);
    }

    console.log(result);

    if (result.affectedRows === 1) return result.insertId;
    return null;
  }

  // 插入所有评分项
  async insertAll(projectId, items) {
    const datas = items.map(i => Object.assign(i, { projectId }));
    return await this.app.mysql.insert('items', datas);
  }
}

module.exports = ItemsService;
