/* eslint-disable quotes */
/* eslint-disable brace-style */
'use strict';

const Service = require('egg').Service;

class ResultService extends Service {

  // 保存结果
  async insert(data) {

    const conn = await this.app.mysql.beginTransaction();
    let result = null;
    let affectedRows = null;

    try {
      result = await conn.insert('results', data);
      affectedRows = result.affectedRows;
      // 如果未全部插入，则抛出错误，全部回滚
      if (affectedRows !== data.length) {
        throw new Error('insert failed');
      }
      await conn.commit();
    } catch (error) {
      console.log(error);
      await conn.rollback();
      return { finish: false, insertRows: affectedRows };
    }

    return { finish: true, insertRows: affectedRows };
  }

  // 根据itemId查询结果 (查询某单个评分项的所有结果)
  async findByItemId(itemId) {
    return await this.app.mysql.select('results', {
      where: { itemId },
      orders: [[ 'createAt' ]],
    });
  }

  // 查询某个项目的所有结果
  async findAllByProjectId(projectId) {
    const conn = await this.app.mysql.beginTransaction();
    const result = [];

    try {
      // 1. 查询该项目所有评分项
      const itemIds = await conn.select('items', {
        where: { projectId },
        orders: [[ 'sort' ]],
      });

      // 2. 逐一查询每个评分项的统计结果

      // 平均数查询
      const meanSql = 'SELECT AVG(result) AS average FROM results WHERE itemId = ?';

      for (let i = 0; i < itemIds.length; i++) {

        const { id, type, title, sort } = itemIds[i];
        const item = { id, type, title, sort };

        // 查询结果列表
        item.list = await conn.select('results', { where: { itemId: id } });
        // 查询选项
        if (item.type === 1 || item.type === 2) {
          item.options = await conn.select('options', { where: { itemId: id } });
        }

        // 如果是打分
        if (type === 0) {
          // 分组查询
          const sql = `
            SELECT result, COUNT(*) AS people FROM results
            WHERE itemId = ?
            GROUP BY result
            ORDER BY result
          `;
          // 获得所有打分结果并排序，之后算出 [平均分] 和 [中位数]
          const all = await conn.query(sql, [ id ]);
          item.all = all;
          // 计算平均数
          const mean = await conn.query(meanSql, [ id ]);
          item.mean = mean[0].average;
        }

        // 如果是单选或多选
        else if (type === 1 || type === 2) {
          // 获得每个选项，以及各自选择的人数
          const res = await conn.select('results', {
            columns: [ 'result' ],
            where: { itemId: id },
          });
          // 初始化收集结果的数据结构
          const hash = {};
          item.options.forEach(option => {
            hash[option.value] = 0;
          });

          // 单选直接收集
          if (type === 1) {
            res.forEach(item => { hash[item.result]++; });
          }
          // 多选先解析，再收集
          else {
            res.forEach(item => {
              JSON.parse(item.result).forEach(val => { hash[val]++; });
            });
          }
          item.all = Object.entries(hash)
            .map(([ key, value ]) => ({ result: key, people: value }));
        }

        // 将该评分项的统计结果添加到 result 中
        result.push(item);
      }

      await conn.commit();

    } catch (error) {
      await conn.rollback();
      console.log(error);
      return { success: false, result: null };
    }

    return { success: true, result };
  }
}

module.exports = ResultService;
