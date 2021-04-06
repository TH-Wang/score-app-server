'use strict';

module.exports = {

  // 成功响应
  success(data, message) {
    this.status = 200;
    this.body = { data, message, success: true };
  },

  // 失败响应
  fail(code, error, message) {
    this.status = 200;
    this.body = { code, error, message, success: false };
  },

  // 错误响应
  error() {
    const params = Array.prototype.slice.call(arguments);
    if (params.length === 3) {
      const [ status, error, message ] = params;
      this.status = status;
      this.body = { error, message };
    } else if (params.length === 2) {
      const [ error, message ] = params;
      this.body = { error, message };
    } else if (params.length === 1) {
      const error = params;
      this.body = { error };
    } else throw new Error('at least one paramter');
  },
};
