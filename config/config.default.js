/* eslint valid-jsdoc: "off" */

'use strict';

// const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1617535504500_3184';

  // close csrf token
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // jwt config
  config.jwt = {
    ignore: /(login|register|template|public|auth)/g,
    // 密钥
    secret: '1545asd1z5cvsdf456a4sd8a5s1',
    // 过期事件，毫秒
    expire: 24 * 60 * 60 * 1000,
  };

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'jwt' ];

  // mysql connect config
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'score',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // cors config
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  exports.multipart = {
    mode: 'file',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
