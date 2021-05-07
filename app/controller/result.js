'use strict';

const Controller = require('egg').Controller;

class ResultController extends Controller {

  // 提交结果(一次性提交)
  async create() {
    const { ctx } = this;

    const rules = {
      projectId: 'id',
      userId: 'id',
      values: {
        type: 'array',
        itemType: 'object',
        rule: {
          itemId: 'number',
          // result: /[\s\S]+/,
        },
      },
    };

    ctx.validate(rules, ctx.request.body);

    const { projectId, userId, values } = ctx.request.body;
    // 自定义校验所有 result, 并整理所有数据
    const now = ctx.helper.getTime();
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      if (!Object.prototype.hasOwnProperty.call(item, 'result')) {
        ctx.response.error(422, "every item in values must have a 'result' attribute", '参数错误');
        return;
      }
      if (Array.isArray(item.result)) {
        item.result = JSON.stringify(item.result);
      }
      item.projectId = projectId;
      item.userId = userId;
      item.createAt = now;
    }

    // 插入数据
    const { finish, insertRows } = await ctx.service.result.insert(values);
    if (!finish) {
      const message = `有${values.length - insertRows}项结果提交失败，请检查或稍等后重试`;
      ctx.response.fail(1001, '提交失败', message);
    } else {
      ctx.response.success(null, '提交成功');
    }
  }

  // 查询某个项目的所有结果
  async index() {
    const { ctx } = this;
    const { projectId } = ctx.params;
    ctx.validate({ projectId: 'id' }, { projectId });

    const { success, result } = await ctx.service.result.findAllByProjectId(projectId);
    if (success) {
      ctx.response.success(result, '查询成功');
    } else {
      ctx.response.fail(1001, '查询失败', '对不起，统计结果查询失败，请稍后再试');
    }
  }

  // 查询某个评分项的所有结果列表
  async queryByItemId() {
    const { ctx } = this;
    const { itemId } = ctx.params;

    ctx.validate({ itemId: 'id' }, { itemId });

    const result = await ctx.service.result.findByItemId(itemId);

    ctx.response.success(result, '查询成功');
  }
}

module.exports = ResultController;
