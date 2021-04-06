/* eslint-disable no-else-return */
'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {

  // 查询模板列表
  async index() {
    const { ctx } = this;
    const result = await ctx.service.project.findAllTemplate();
    ctx.response.success(result || [], '查询成功');
  }

  // 创建项目
  /**
   * @fail 1001 用户未注册
   * @fail 1002 模板已存在
   */
  async create() {
    const { ctx } = this;

    // 校验参数
    const rules = {
      userId: 'id',
      pname: 'string',
      isTemplate: [ '0', '1' ],
      needAuth: [ '0', '1' ],
    };
    ctx.validate(rules, ctx.request.body);

    const { userId, pname, isTemplate, needAuth } = ctx.request.body;

    // 验证用户id是否存在
    const existUser = await ctx.service.user.find(userId);
    if (!existUser) {
      ctx.response.fail(1001, '用户未注册', '当前用户未注册，请注册并登录后再创建项目');
      return;
    }

    // 如果是模板，查询是否已创建
    const existTem = await ctx.service.project.findTemByName(pname);
    if (existTem.length) {
      ctx.response.fail(1002, '模板已存在', `模板 '${pname}' 已经存在，请修改后重试`);
      return;
    }

    // 创建时间
    const datetime = ctx.helper.getTime();
    // 完整数据
    const data = {
      userId,
      pname,
      isTemplate,
      needAuth,
      createAt: datetime,
      updateAt: datetime,
    };

    // 插入数据库
    const result = await ctx.service.project.insert(data);
    ctx.response.success(result, '项目创建成功');
  }

  // 修改项目信息
  async update() {
    const { ctx } = this;

    const rules = {
      projectId: 'id',
      pname: 'string?',
      isTemplate: [ '0', '1' ],
      needAuth: [ '0', '1' ],
    };
    const { id } = ctx.params;
    const { pname, isTemplate, needAuth } = ctx.request.body;
    const data = { projectId: id, pname, isTemplate, needAuth };

    ctx.validate(rules, data);

    const result = await ctx.service.project.update(data);
    if (!result) {
      ctx.response.fail(1001, '修改失败', '项目信息修改失败，请稍后再试');
      return;
    }
    ctx.response.success(data, '修改成功');
  }

  // 删除项目
  /**
   * @fail 1001 已被删除
   * @fail 1002 没有权限
   * @fail 1003 删除失败
   */
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { userId } = ctx.request.body;

    const rules = {
      projectId: 'id',
      userId: 'id',
    };
    ctx.validate(rules, { projectId: id, userId });

    // 查询该项目是否已被删除
    const exist = await ctx.service.project.find(id);
    if (!exist) {
      ctx.response.fail(1001, '已被删除', '操作失败，该项目已被删除');
      return;
    }

    // 验证进行删除操作的用户是否是该项目的创建者
    const creatorId = await ctx.service.project.findCreator(id);
    if (Number(creatorId) !== Number(userId)) {
      ctx.response.fail(1002, '没有权限', '对不起，当前账号不是该项目的创建者，无法进行删除操作');
      return;
    } else {
      // 验证是否是管理员...
    }

    const result = await ctx.service.project.delete(id);
    result
      ? ctx.response.success(result, '删除成功')
      : ctx.response.fail(1003, '删除失败', '删除失败，请稍后再试');
  }
}

module.exports = ProjectController;
