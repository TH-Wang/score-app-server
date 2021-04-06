'use strict';

const Controller = require('egg').Controller;
const unPwdRules = {
  username: 'string',
  password: { type: 'string', min: 8, max: 18, required: true },
};

class UserController extends Controller {

  // 查询用户列表
  async index() {
    const { ctx } = this;
    const { pageNum, pageSize } = ctx.query;
    const users = await ctx.service.user.list(pageSize, pageNum);
    ctx.body = users;
  }

  // 用户注册(通过用户名密码)
  async registerByUsername() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    ctx.validate(unPwdRules, { username, password });

    // 查询是否已经注册
    const registered = await ctx.service.user.findByName(username);
    if (registered) {
      ctx.response.fail(1001, '用户已注册', `用户名 '${username}' 已经被注册`);
      return;
    }

    // 插入用户数据
    const insertId = await ctx.service.user.insert({ username, password });
    ctx.response.success(insertId, '注册成功');
  }

  // 用户登录(通过用户名密码)
  async loginByPassword() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    ctx.validate(unPwdRules, { username, password });

    // 验证用户信息是否匹配
    const { valid, result } = await ctx.service.user.validate({ username, password });
    if (valid) {
      ctx.response.success(result, '登录成功');
    } else {
      ctx.response.fail(1001, '登录失败', '用户名或密码错误');
    }
  }

  // 查询用户详情
  /**
   * @fail 1001 未找到
   */
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await ctx.service.user.find(id);
    if (result) {
      ctx.response.success(result, '查询成功');
    } else {
      ctx.response.fail(1001, '未找到', '对不起，该用户信息未找到');
    }

  }
}

module.exports = UserController;
