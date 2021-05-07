/*
 Navicat MySQL Data Transfer

 Source Server         : myconn
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost:3306
 Source Schema         : score

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : 65001

 Date: 07/05/2021 15:26:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for companies
-- ----------------------------
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `userId` int(11) NOT NULL COMMENT '关联user表的主键id',
  `cname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '公司或组织的名称',
  `telphone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '官方邮箱',
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '公司或组织办公地址',
  `site` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '官网链接',
  `business` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '公司主营业务或组织的工作范围',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of companies
-- ----------------------------

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `projectId` int(11) NULL DEFAULT NULL COMMENT '关联projects表的项目id',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标题',
  `type` int(1) NOT NULL COMMENT '评分方式，只能是以下4个值\r\n0: 打分\r\n1: 单选\r\n2: 多选\r\n3: 文本输入',
  `sort` int(11) NULL DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of items
-- ----------------------------
INSERT INTO `items` VALUES (10, 3, '讲课是否生动形象', 0, 1);
INSERT INTO `items` VALUES (11, 3, '是否尊重学生', 0, 2);
INSERT INTO `items` VALUES (17, 3, '是否善于解答问题', 0, 4);
INSERT INTO `items` VALUES (18, 3, '是否尽职尽责', 0, 3);
INSERT INTO `items` VALUES (20, 3, '是否善于解答问题', 1, 5);
INSERT INTO `items` VALUES (26, 7, '测试项目', 0, 1);
INSERT INTO `items` VALUES (27, 7, '测试评分项', 1, 2);
INSERT INTO `items` VALUES (28, 7, '惺惺惜惺惺', 2, 3);
INSERT INTO `items` VALUES (29, 7, 'ask佛阿呆民', 2, 4);
INSERT INTO `items` VALUES (30, 8, '测试模板标题asdasd', 0, 1);
INSERT INTO `items` VALUES (31, 8, '阿三大苏打', 0, 2);
INSERT INTO `items` VALUES (32, 8, '按此执行测试的', 2, 3);

-- ----------------------------
-- Table structure for options
-- ----------------------------
DROP TABLE IF EXISTS `options`;
CREATE TABLE `options`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `itemId` int(11) NULL DEFAULT NULL COMMENT '关联items表的评分项id',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '选项名称',
  `value` int(11) NULL DEFAULT NULL COMMENT '选项值(用于前端匹配结果)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of options
-- ----------------------------
INSERT INTO `options` VALUES (1, 20, '否', 0);
INSERT INTO `options` VALUES (2, 20, '是', 1);
INSERT INTO `options` VALUES (5, 27, '满意', 0);
INSERT INTO `options` VALUES (6, 27, '不满意', 1);
INSERT INTO `options` VALUES (7, 28, '多选1', 0);
INSERT INTO `options` VALUES (8, 28, '多选2', 1);
INSERT INTO `options` VALUES (9, 28, '多选3', 2);
INSERT INTO `options` VALUES (10, 29, '选项1', 0);
INSERT INTO `options` VALUES (11, 29, '选项2', 1);
INSERT INTO `options` VALUES (12, 29, '选项3', 2);
INSERT INTO `options` VALUES (13, 32, '阿松大', 0);
INSERT INTO `options` VALUES (14, 32, '消车主', 1);
INSERT INTO `options` VALUES (15, 32, '学容', 2);

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `userId` int(11) NULL DEFAULT NULL COMMENT '关联users表的用户id',
  `pname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '项目名称',
  `cover` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '项目封面',
  `isTemplate` int(1) NOT NULL DEFAULT 0 COMMENT '是否是模板，[0: 不是]，[1: 是]',
  `needAuth` int(1) NULL DEFAULT 0 COMMENT '打分是否需要权限，[0: 不需要]，[1: 需要]',
  `hits` int(11) NULL DEFAULT NULL COMMENT '点击量',
  `closing` datetime(0) NULL DEFAULT NULL COMMENT '截止日期',
  `createAt` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updateAt` datetime(0) NULL DEFAULT NULL COMMENT '上次修改时间',
  `tag` int(2) NULL DEFAULT NULL COMMENT '项目标签(类别)，\r\n[1: 员工打分]，\r\n[2: 教学评价]，\r\n[3: 问卷调查], \r\n[4: 投票评选]',
  `state` int(2) NULL DEFAULT NULL COMMENT '项目状态，[0: 待提交]，[1: 进行中]',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO `projects` VALUES (3, 1, '2021年下半学期融智学院辅导员评测', NULL, 1, 0, 2, NULL, '2021-04-05 16:41:57', '2021-04-05 16:41:57', NULL, 0);
INSERT INTO `projects` VALUES (5, 3, '重庆某企业内部年度高管评分', NULL, 1, 0, NULL, NULL, '2021-04-05 17:18:18', '2021-04-05 17:18:18', NULL, 0);
INSERT INTO `projects` VALUES (6, 3, '2021学院学生会主席评选', NULL, 0, 0, 5, '2021-05-15 13:14:14', '2021-05-05 13:14:24', '2021-05-05 13:14:32', NULL, 0);
INSERT INTO `projects` VALUES (7, 1, '测试项目zxcxc', '1620229108114-health4.png', 0, 0, NULL, '2021-05-14 12:00:00', '2021-05-05 23:38:30', '2021-05-07 00:21:56', NULL, 1);
INSERT INTO `projects` VALUES (8, 1, '测试模板', '1620353518496-health2.jpg', 1, 0, NULL, '2021-05-20 00:00:00', '2021-05-07 10:12:03', '2021-05-07 10:12:03', 2, 1);

-- ----------------------------
-- Table structure for results
-- ----------------------------
DROP TABLE IF EXISTS `results`;
CREATE TABLE `results`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `itemId` int(11) NULL DEFAULT NULL COMMENT '关联items表的评分项id',
  `userId` int(11) NULL DEFAULT NULL COMMENT '关联users表的评分人id',
  `projectId` int(11) NULL DEFAULT NULL COMMENT '关联projects表的项目id',
  `result` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '打分结果',
  `createAt` datetime(0) NULL DEFAULT NULL COMMENT '提交时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 69 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of results
-- ----------------------------
INSERT INTO `results` VALUES (41, 10, 3, 3, '1', '2021-04-06 22:12:55');
INSERT INTO `results` VALUES (42, 11, 3, 3, '1', '2021-04-06 22:12:55');
INSERT INTO `results` VALUES (43, 17, 3, 3, '1', '2021-04-06 22:12:55');
INSERT INTO `results` VALUES (44, 18, 3, 3, '1', '2021-04-06 22:12:55');
INSERT INTO `results` VALUES (45, 10, 1, 3, '0', '2021-04-06 22:13:21');
INSERT INTO `results` VALUES (46, 11, 1, 3, '0', '2021-04-06 22:13:21');
INSERT INTO `results` VALUES (47, 17, 1, 3, '0', '2021-04-06 22:13:21');
INSERT INTO `results` VALUES (48, 18, 1, 3, '0', '2021-04-06 22:13:21');
INSERT INTO `results` VALUES (49, 10, 1, 3, '1', '2021-04-06 22:25:58');
INSERT INTO `results` VALUES (50, 11, 1, 3, '1', '2021-04-06 22:25:58');
INSERT INTO `results` VALUES (51, 17, 1, 3, '0', '2021-04-06 22:25:58');
INSERT INTO `results` VALUES (52, 18, 1, 3, '0', '2021-04-06 22:25:58');
INSERT INTO `results` VALUES (53, 10, 1, 3, '1', '2021-04-06 22:26:01');
INSERT INTO `results` VALUES (54, 11, 1, 3, '1', '2021-04-06 22:26:01');
INSERT INTO `results` VALUES (55, 17, 1, 3, '0', '2021-04-06 22:26:01');
INSERT INTO `results` VALUES (56, 18, 1, 3, '0', '2021-04-06 22:26:01');
INSERT INTO `results` VALUES (57, 10, 3, 5, '1', '2021-04-07 01:31:55');
INSERT INTO `results` VALUES (58, 11, 3, 5, '1', '2021-04-07 01:31:55');
INSERT INTO `results` VALUES (59, 17, 3, 5, '0', '2021-04-07 01:31:55');
INSERT INTO `results` VALUES (60, 18, 3, 5, '0', '2021-04-07 01:31:55');
INSERT INTO `results` VALUES (61, 26, 1, 7, '4', '2021-05-07 11:18:59');
INSERT INTO `results` VALUES (62, 27, 1, 7, '0', '2021-05-07 11:18:59');
INSERT INTO `results` VALUES (63, 28, 1, 7, '0', '2021-05-07 11:18:59');
INSERT INTO `results` VALUES (64, 29, 1, 7, '0', '2021-05-07 11:18:59');
INSERT INTO `results` VALUES (65, 26, 1, 7, '4', '2021-05-07 11:25:56');
INSERT INTO `results` VALUES (66, 27, 1, 7, '0', '2021-05-07 11:25:56');
INSERT INTO `results` VALUES (67, 28, 1, 7, '[0,1,2]', '2021-05-07 11:25:56');
INSERT INTO `results` VALUES (68, 29, 1, 7, '[0,1]', '2021-05-07 11:25:56');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号码',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户邮箱',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户头像',
  `belongId` int(11) NULL DEFAULT NULL COMMENT '属于某个上级用户的id',
  `isCompany` int(1) NOT NULL DEFAULT 0 COMMENT '是否企业账号，0:否，1:是',
  `companyId` int(11) NULL DEFAULT NULL COMMENT '关联companies表的id',
  `official` int(1) NOT NULL DEFAULT 0 COMMENT '是否官方账号，0:否，1:是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'wyl', '12345678', '13788889999', NULL, NULL, NULL, 0, NULL, 0);
INSERT INTO `users` VALUES (2, 'test', '12345678', NULL, NULL, NULL, NULL, 0, NULL, 0);
INSERT INTO `users` VALUES (3, 'Tina', 'gy123456', NULL, NULL, NULL, NULL, 0, NULL, 0);

SET FOREIGN_KEY_CHECKS = 1;
