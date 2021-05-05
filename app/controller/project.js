/* eslint-disable no-else-return */
'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {

  // 查询模板列表
  async index() {
    const { ctx } = this;
    const rules = {
      page: /\d+/,
      size: /\d+/,
    };
    if (ctx.query.tag) {
      rules.tag = [ '1', '2', '3', '4', 1, 2, 3, 4, null, undefined ];
    }
    ctx.validate(rules, ctx.query);

    const { tag, keyword, page, size } = ctx.query;

    const result = await ctx.service.project.findTemplates({
      tag: tag || null,
      keyword,
      page,
      size,
    });
    ctx.response.success(result || {}, '查询成功');
  }

  // 查询公开评分项目
  async indexOfPublic() {
    const { ctx } = this;
    const rules = {
      page: /\d+/,
      size: /\d+/,
    };
    ctx.validate(rules, ctx.query);
    const result = await ctx.service.project.findPublicProject(ctx.query);
    ctx.response.success(result || {}, '查询成功');
  }

  // 查询用户创建的项目
  async indexOfUser() {
    const { ctx } = this;
    const { userId } = ctx.params;
    ctx.validate({ userId: 'id' }, { userId });

    const result = await ctx.service.project.findProjectByUser(userId);
    ctx.response.success(result, '查询成功');
  }

  // 查询用户参与过的项目
  async indexOfJoin() {
    const { ctx } = this;
    const { userId } = ctx.params;
    ctx.validate({ userId: 'id' }, { userId });

    const result = await ctx.service.project.findUserJoin(userId);
    ctx.response.success(result, '查询成功');
  }

  // 创建项目
  /**
   * @fail 1001 用户未注册
   * @fail 1002 模板已存在
   */
  async create() {
    const { ctx } = this;
    const body = ctx.request.body;

    // 校验参数
    const rules = {
      userId: 'number',
      pname: 'string',
      isTemplate: [ '0', '1', 0, 1 ],
      needAuth: [ '0', '1', 0, 1 ],
    };
    if (body.tag) {
      rules.tag = [ '1', '2', '3', '4', 1, 2, 3, 4, null, undefined ];
    }
    ctx.validate(rules, ctx.request.body);

    // 验证用户id是否存在
    const existUser = await ctx.service.user.find(body.userId);
    if (!existUser) {
      ctx.response.fail(1001, '用户未注册', '当前用户未注册，请注册并登录后再创建项目');
      return;
    }

    // 如果是模板，查询是否已创建
    // const existTem = await ctx.service.project.findTemByName(pname);
    // if (existTem.length) {
    //   ctx.response.fail(1002, '模板已存在', `模板 '${pname}' 已经存在，请修改后重试`);
    //   return;
    // }

    // 创建时间
    const datetime = ctx.helper.getTime();
    // 完整数据
    const data = Object.assign({}, body, {
      createAt: datetime,
      updateAt: datetime,
    });

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
      tag: [ '1', '2', '3', '4', 1, 2, 3, 4, null, undefined ],
    };
    const { id } = ctx.params;
    const body = ctx.request.body;
    if (body.isTemplate) rules.isTemplate = [ '0', '1' ];
    if (body.needAuth) rules.needAuth = [ '0', '1' ];
    const data = Object.assign(body, { id });

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

  // 增加项目点击量
  async hits() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.validate({ id: 'id' }, { id });

    const result = await ctx.service.project.addHits(id);
    ctx.response.success(result, '点击量+1');
  }
}

module.exports = ProjectController;
