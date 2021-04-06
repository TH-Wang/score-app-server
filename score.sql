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

 Date: 06/04/2021 14:31:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `projectId` int(11) NULL DEFAULT NULL COMMENT '关联projects表的项目id',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标题',
  `type` int(1) NOT NULL COMMENT '评分方式，只能是以下4个值\r\n0: 打分\r\n1: 单选\r\n2: 多选\r\n3: 文本输入',
  `sort` int(255) NULL DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of items
-- ----------------------------
INSERT INTO `items` VALUES (10, 3, '是否尊重学生', 2, 1);
INSERT INTO `items` VALUES (11, 3, '是否尊重学生', 2, 2);
INSERT INTO `items` VALUES (17, 3, '是否尽职尽责', 1, 3);
INSERT INTO `items` VALUES (18, 3, '是否尽职尽责', 1, 4);

-- ----------------------------
-- Table structure for options
-- ----------------------------
DROP TABLE IF EXISTS `options`;
CREATE TABLE `options`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `itemId` int(11) NULL DEFAULT NULL COMMENT '关联items表的评分项id',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '选项名称',
  `value` int(1) NULL DEFAULT NULL COMMENT '选项值(用于前端匹配结果)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of options
-- ----------------------------

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `userId` int(11) NULL DEFAULT NULL COMMENT '关联users表的用户id',
  `pname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '项目名称',
  `isTemplate` int(1) NOT NULL DEFAULT 0 COMMENT '是否是模板，[0: 不是]，[1: 是]',
  `needAuth` int(1) NULL DEFAULT 0 COMMENT '打分是否需要权限，[0: 不需要]，[1: 需要]',
  `createAt` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updateAt` datetime(0) NULL DEFAULT NULL COMMENT '上次修改时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO `projects` VALUES (3, 1, '2021年下半学期融智学院辅导员评测', 1, 0, '2021-04-05 16:41:57', '2021-04-05 16:41:57');
INSERT INTO `projects` VALUES (5, 1, '重庆某企业内部年度高管评分', 1, 0, '2021-04-05 17:18:18', '2021-04-05 17:18:18');

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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of results
-- ----------------------------

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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'wyl', '12345678', '13788889999', NULL, NULL, NULL);
INSERT INTO `users` VALUES (2, 'test', '12345678', NULL, NULL, NULL, NULL);
INSERT INTO `users` VALUES (3, 'Tina', 'gy123456', NULL, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;