'use strict';

const Service = require('egg').Service;

class ItemsService extends Service {

  // 添加单个评分项
  async insert({ projectId, title, type, ...rest }) {
    const { ctx, app } = this;
    const conn = await app.mysql.beginTransaction();
    let result = null;
    let sort = null;

    try {
      // 如果没有传入sort，则寻找出最大的sort值
      const sql = 'SELECT MAX(sort) AS value FROM items WHERE projectId=?';
      const max = await conn.query(sql, [ projectId ]);
      const value = max[0].value;
      if (!rest.sort || rest.sort <= value) {
        sort = Number(value) + 1;
      } else sort = rest.sort;

      // 插入所有数据
      result = await conn.insert('items', { projectId, title, type, sort });

      // 如果有options，则插入到options表
      if (rest.options && rest.options.length) {
        const { insertId } = result;
        const options = rest.options.map(i => (Object.assign(i, { itemId: insertId })));
        await conn.insert('options', options);
      }
      // 提交事务
      await conn.commit();
    } catch (error) {
      console.log(error);
      // 捕获异常后回滚事务
      await conn.rollback();
      ctx.response.error(500, 'sql error', error.message);
    }

    // console.log(result);

    if (result.affectedRows === 1) {
      const res = { id: result.insertId, projectId, title, type, sort };
      if (rest.options) res.options = rest.options;
      return res;
    }
    return null;
  }

  // 插入所有评分项
  async insertAll(projectId, items) {
    const datas = items.map(i => Object.assign(i, { projectId }));
    return await this.app.mysql.insert('items', datas);
  }

  // 查询某个项目的所有评分项
  async findAll(projectId) {
    const result = await this.app.mysql.beginTransactionScope(async conn => {
      const items = await conn.select('items', {
        where: { projectId },
        orders: [[ 'sort' ]],
      });
      items.forEach(async item => {
        item.options = await conn.select('options', {
          where: { itemId: item.id },
        });
      });
      return items;
    });
    return result;
  }

  // 修改
  async update(data) {
    const { ctx, app } = this;
    const result = await app.mysql.beginTransactionScope(async conn => {
      let itemData = data;
      // 如果传了 options，更新所有options
      if (data.options) {
        const { options, ...rest } = data;
        options.forEach(async option => {
          if (option.id) {
            await conn.update('options', option);
          } else {
            await conn.insert('options', Object.assign({ itemId: rest.id }, option));
          }
        });
        itemData = rest;
      }
      // 更新 items
      return await conn.update('items', itemData);
    }, ctx);

    return result.affectedRows === 1;
  }

  // 删除
  async delete(id) {
    const result = await this.app.mysql.delete('items', { id });
    return result.affectedRows === 1;
  }
}

module.exports = ItemsService;
