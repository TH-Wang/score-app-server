'use strict';
const { decrypt } = require('../utils/crypt');

const reason = {
  0: '通过身份验证',
  '-1': '尊敬的用户，请您登录后再进行操作',
  '-2': '对不起用户，您的登录已超时，请您重新登录',
  '-3': '对不起用户，您的登录已失效，请重新登录后重试',
};

module.exports = options => {
  const { ignore, secret, expire } = options;
  return async function(ctx, next) {
    const { url, headers } = ctx;
    // 如果不在白名单内且未通过身份验证
    if (!ignore.test(url)) {
      let auth = headers.authorization;
      let state = 0;
      if (!auth) state = -1;
      else {
        auth = auth.replace(/^Bearer\s/, '');
        state = jwt(secret, expire, auth);
      }

      if (state < 0) {
        ctx.response.error(401, '未通过身份验证', reason[state]);
        return;
      }
    }
    await next();
  };
};

function jwt(secret, expire, token) {
  try {
    const payload = decrypt(secret, token);
    if (Date.now() - payload._sign > expire) return -2;
    if (!payload.userId) return -3;
    return 0;
  } catch (error) {
    return -3;
  }
}
