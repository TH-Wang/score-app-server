'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.prefix('/api/v1');

  router.get('/user', controller.user.index);
  router.get('/user/:id', controller.user.show);
  router.post('/user/register/un', controller.user.registerByUsername);
  router.post('/user/login/pwd', controller.user.loginByPassword);

  router.get('/project/template', controller.project.index);
  router.post('/project', controller.project.create);
  router.put('/project/:id', controller.project.update);
  router.delete('/project/:id', controller.project.delete);

  router.post('/items/save', controller.items.save);
  router.post('/items/create', controller.items.create);
};
