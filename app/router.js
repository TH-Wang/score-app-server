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
  router.get('/project/public', controller.project.indexOfPublic);
  router.get('/project/user/:userId', controller.project.indexOfUser);
  router.get('/project/join/:userId', controller.project.indexOfJoin);
  router.get('/project/:id', controller.project.show);
  router.post('/project', controller.project.create);
  router.post('/project/release/:id', controller.project.release);
  router.post('/project/hits/:id', controller.project.hits);
  router.put('/project/:id', controller.project.update);
  router.delete('/project/:id', controller.project.delete);

  router.get('/items/:projectId', controller.items.index);
  router.post('/items/save', controller.items.save);
  router.post('/items/create', controller.items.create);
  router.put('/items/:id', controller.items.update);
  router.delete('/items/:id', controller.items.delete);

  router.get('/result/item/:itemId', controller.result.queryByItemId);
  router.get('/result/project/:projectId', controller.result.index);
  router.post('/result', controller.result.create);

  router.post('/upload', controller.upload.index);
};
