'use strict';
const jwtConfig = require('../../config/config.default')({ name: '' }).jwt;
const { encrypt, decrypt } = require('../utils/crypt');

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
      const token = encrypt(jwtConfig.secret, {
        userId: result.id,
        _sign: Date.now(),
      });
      ctx.response.success(Object.assign(result, { token }), '登录成功');
    } else {
      ctx.response.fail(1001, '登录失败', '对不起，用户名或密码错误，请重试');
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

  // 验证用户token是否过期
  async auth() {
    try {
      const { ctx } = this;
      const { secret, expire } = jwtConfig;
      ctx.validate({ token: 'string' }, ctx.request.body);

      const { token } = ctx.request.body;
      const { _sign } = decrypt(secret, token);
      if (Date.now() - _sign > expire) {
        ctx.response.fail(1001, '登录过期', '对不起用户，您的登录已失效，请重新登录后重试');
      }
    } catch (error) {
      this.ctx.response.fail(1002, '身份不合法', '对不起用户，请检查是否已登录');
    }

  }

  // 申请企业用户
  async applyCompany() {
    const { ctx } = this;
    const rules = {
      userId: 'id',
      cname: 'string',
      telphone: 'string',
      email: 'string',
      address: 'string',
      site: 'string?',
      business: 'string?',
    };

    ctx.validate(rules, ctx.request.body);

    const res = await ctx.service.user.createCompany(ctx.request.body);
    ctx.response.success(res, '申请成功');
  }

  // 批量添加用户
  async addUsers() {
    const { ctx } = this;
    await ctx.service.user.addUsers(ctx.request.body);
    ctx.response.success(null, '添加成功');
  }
}

module.exports = UserController;
