-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1:3306
-- 生成日期： 2018-12-29 07:31:17
-- 服务器版本： 5.7.23
-- PHP 版本： 5.6.38

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `math`
--
CREATE DATABASE IF NOT EXISTS `math` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `math`;

-- --------------------------------------------------------

--
-- 表的结构 `question`
--

DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `q_id` int(11) NOT NULL AUTO_INCREMENT,
  `q_No` varchar(32) CHARACTER SET utf8 NOT NULL COMMENT '试题编号',
  `q_content` varchar(512) CHARACTER SET utf8 DEFAULT NULL COMMENT '试题内容',
  `q_state` int(1) NOT NULL DEFAULT '0' COMMENT '试题推送状态',
  `q_time` date NOT NULL COMMENT '试题时间',
  `q_board` varchar(20000) CHARACTER SET utf8 DEFAULT NULL COMMENT '试题画板',
  `q_other` varchar(1024) CHARACTER SET utf8 DEFAULT NULL COMMENT '试题其他',
  PRIMARY KEY (`q_id`),
  KEY `q_state` (`q_state`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `question`
--

INSERT INTO `question` (`q_id`, `q_No`, `q_content`, `q_state`, `q_time`, `q_board`, `q_other`) VALUES
(22, '006666666', '∈≈≈≈≈βαα∞＝∈∩÷aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa⊙≈∈∈', 0, '2018-12-02', 'aaaa', 'aaaa'),
(23, '333333333333333', '＝＝＝＝⊙∩∩∩AAAAAAAAAAAAAAAAAAA∩＝', 0, '2018-12-02', 'ASASA', 'SASAS'),
(24, '222222333333', '1411', 0, '2018-12-02', '456416546', 'awwwwwwwwwwww'),
(27, '666', '666', 0, '2018-12-03', '5555', ''),
(28, '6661', '666', 0, '2018-12-03', '5555', ''),
(29, '6662233', '666', 0, '2018-12-03', '5555', ''),
(30, '666223', '666', 0, '2018-12-03', '5555', ''),
(31, '66623', '666', 0, '2018-12-03', '5555', ''),
(32, '6623', '666', 0, '2018-12-03', '5555', ''),
(34, '010417100', '1+1＝？', 0, '2018-12-19', 'painting is interesting', ''),
(35, '1312312313', '1312312313', 0, '2018-12-28', '&t=0.3617391866528792', ''),
(36, '423423424', '423423424', 1, '2018-12-28', '&t=0.8196924567543913', ''),
(37, '1231231231232', '1231231231232', 0, '2018-12-28', '&t=0.9958316211805309', ''),
(38, '123123113', '123123113', 0, '2018-12-28', '&t=0.36153261262408365', '');

-- --------------------------------------------------------

--
-- 表的结构 `teacher`
--

DROP TABLE IF EXISTS `teacher`;
CREATE TABLE IF NOT EXISTS `teacher` (
  `t_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `t_No` char(32) CHARACTER SET utf8 NOT NULL COMMENT '教师编号',
  `t_name` char(32) CHARACTER SET utf8 NOT NULL COMMENT '教师名称',
  `t_password` char(32) CHARACTER SET utf8 NOT NULL COMMENT '教师密码',
  PRIMARY KEY (`t_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `teacher`
--

INSERT INTO `teacher` (`t_id`, `t_No`, `t_name`, `t_password`) VALUES
(1, '0010', 'abc', '123456'),
(2, '0022', '333', '123456'),
(3, '0033', '456', '123456');
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
