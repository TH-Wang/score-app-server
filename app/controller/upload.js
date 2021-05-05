'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const { join } = require('../utils/joinPath');

class UploadController extends Controller {
  // 图片上传
  async index() {
    const { ctx } = this;
    try {
      const file = ctx.request.files[0];
      const stream = fs.readFileSync(file.filepath);
      const filename = Date.now() + '-' + file.filename;
      const filePath = path.join(__dirname, '../public/images', filename);
      fs.writeFileSync(filePath, stream);
      ctx.response.success({
        filename,
        filepath: join(filename),
      }, '上传成功');
    } catch (error) {
      console.log(error);
      ctx.response.fail(1001, '上传失败', '图片上传失败，请稍后再试');
    } finally {
      ctx.cleanupRequestFiles();
    }
  }
}

module.exports = UploadController;
