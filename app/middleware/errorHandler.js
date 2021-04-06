'use strict';

module.exports = () => {
  return async function validator(ctx, next) {
    try {
      await next();
    } catch (err) {
      if (err.status === 422) {
        ctx.response.error(422, err.errors, '参数错误');
      } else {
        console.log(err);
        ctx.response.error(500, 'error', err.errors);
      }
    }
  };
};
