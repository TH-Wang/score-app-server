'use strict';

const Controller = require('egg').Controller;

class ItemsController extends Controller {

  // 查询所有评分项
  async index() {
    const { ctx } = this;
    const { projectId } = ctx.params;
    ctx.validate({ projectId: 'id' }, { projectId });

    const result = await ctx.service.items.findAll(projectId);
    ctx.response.success(result, '查询成功');
  }

  // 上传单个评分项
  /**
   * @fail 1001 项目不存在
   * @fail 1002 保存失败
   */
  async create() {
    const { ctx } = this;
    const data = ctx.request.body;
    const rules = {
      projectId: 'number',
      title: 'string',
      type: [ 0, 1, 2, 3, '0', '1', '2', '3' ],
      sort: { type: 'string', rule: /^\d+$/, required: false },
    };
    // 如果是单选或者多选
    if (data.type === 1 || data.type === 2) {
      rules.options = {
        type: 'array',
        itemType: 'object',
        rule: {
          label: 'string',
          value: 'number',
        },
      };
    }
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

  // 修改单个评分项
  async update() {
    const { ctx } = this;
    const rules = {
      id: 'id',
      title: 'string?',
      type: [ undefined, null, 0, 1, 2, 3, '0', '1', '2', '3' ],
    };

    const { id } = ctx.params;
    const body = ctx.request.body;
    const data = Object.assign(body, { id });
    if (data.options) {
      rules.options = {
        type: 'array',
        itemType: 'object',
        rule: {
          id: 'number?',
          label: 'string',
          value: 'number',
        },
      };
    }
    ctx.validate(rules, data);

    const result = await ctx.service.items.update(data);
    if (result) ctx.response.success(data, '修改成功');
    else ctx.response.fail(1001, '修改失败', '修改失败，请稍后再试');
  }

  // 删除单个评分项
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.validate({ id: 'id' }, { id });

    const result = await ctx.service.items.delete(id);
    if (result) ctx.response.success(null, '删除成功');
    else ctx.response.fail(1001, '删除失败', '删除失败，请稍后再试');
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
