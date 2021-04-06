'use strict';

const Controller = require('egg').Controller;

class ItemsController extends Controller {

  // 上传单个评分项
  /**
   * @fail 1001 项目不存在
   * @fail 1002 保存失败
   */
  async create() {
    const { ctx } = this;
    const data = ctx.request.body;
    const rules = {
      projectId: 'id',
      title: 'string',
      type: [ 0, 1, 2, 3, '0', '1', '2', '3' ],
      sort: /^\d+$/,
    };
    ctx.validate(rules, data);

    // 验证是否存在该项目
    const existProject = await ctx.service.project.find(data.projectId);
    if (!existProject) {
      ctx.response.fail(1001, '项目不存在', '该评分项目不存在，若出现错误，则尽快联系管理员');
      return;
    }

    const result = await ctx.service.items.insert(data);
    if (!result) {
      ctx.response.fail(1002, '保存失败', '当前评分项插入失败，请稍后再试');
    } else {
      ctx.response.success(result, '保存成功');
    }
  }

  // 保存项目的所有评分项
  async save() {
    const { ctx } = this;
    const { projectId, items } = ctx.request.body;

    const rules = {
      projectId: 'number',
      items: {
        type: 'array',
        itemType: 'object',
        rule: {
          title: 'string',
          type: [ 0, 1, 2, 3 ],
          sort: 'number',
        },
      },
    };
    ctx.validate(rules, { projectId, items });

    try {
      await ctx.service.items.insertAll(projectId, items);
    } catch (error) {
      ctx.response.fail(1001, '保存失败', '批量保存时出现错误，请稍后再试');
      return;
    }

    ctx.response.success(null, '保存成功');
  }
}

module.exports = ItemsController;
