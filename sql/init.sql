-- 创建数据库
CREATE DATABASE IF NOT EXISTS exam_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE exam_system;

-- 用户表（管理员和考生）
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `role` VARCHAR(20) NOT NULL COMMENT '角色：ADMIN-管理员，STUDENT-考生',
    `name` VARCHAR(50) NOT NULL COMMENT '真实姓名',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_username (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 题库表
CREATE TABLE IF NOT EXISTS `question` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(20) NOT NULL COMMENT '题型：SINGLE-单选，MULTIPLE-多选',
    `content` TEXT NOT NULL COMMENT '题目内容',
    `option_a` VARCHAR(255) NOT NULL COMMENT '选项A',
    `option_b` VARCHAR(255) NOT NULL COMMENT '选项B',
    `option_c` VARCHAR(255) NOT NULL COMMENT '选项C',
    `option_d` VARCHAR(255) NOT NULL COMMENT '选项D',
    `answer` VARCHAR(10) NOT NULL COMMENT '正确答案，如A或ABD',
    `score` INT NOT NULL DEFAULT 10 COMMENT '题目分数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_type (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题库表';

-- 试卷表
CREATE TABLE IF NOT EXISTS `exam_paper` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL COMMENT '考生ID',
    `total_score` INT NOT NULL DEFAULT 0 COMMENT '试卷总分',
    `question_count` INT NOT NULL COMMENT '题目数量',
    `status` VARCHAR(20) NOT NULL DEFAULT 'UNFINISHED' COMMENT '状态：UNFINISHED-未完成，FINISHED-已完成',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `submit_time` DATETIME NULL COMMENT '提交时间',
    INDEX idx_student_id (`student_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='试卷表';

-- 试卷题目关联表
CREATE TABLE IF NOT EXISTS `paper_question` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `paper_id` BIGINT NOT NULL COMMENT '试卷ID',
    `question_id` BIGINT NOT NULL COMMENT '题目ID',
    `student_answer` VARCHAR(10) NULL COMMENT '考生答案',
    `is_correct` TINYINT(1) NULL COMMENT '是否正确：0-错误，1-正确',
    `sort_order` INT NOT NULL COMMENT '题目顺序',
    INDEX idx_paper_id (`paper_id`),
    INDEX idx_question_id (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='试卷题目关联表';

-- 成绩表
CREATE TABLE IF NOT EXISTS `score` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL COMMENT '考生ID',
    `paper_id` BIGINT NOT NULL UNIQUE COMMENT '试卷ID',
    `total_score` INT NOT NULL COMMENT '试卷总分',
    `student_score` INT NOT NULL COMMENT '考生得分',
    `correct_count` INT NOT NULL COMMENT '正确题数',
    `wrong_count` INT NOT NULL COMMENT '错误题数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_student_id (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成绩表';

-- 错题本表
CREATE TABLE IF NOT EXISTS `wrong_question` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL COMMENT '考生ID',
    `question_id` BIGINT NOT NULL COMMENT '题目ID',
    `paper_id` BIGINT NOT NULL COMMENT '试卷ID',
    `student_answer` VARCHAR(10) NOT NULL COMMENT '考生答案',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_student_id (`student_id`),
    INDEX idx_question_id (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='错题本表';

-- 插入测试数据：管理员账户
INSERT INTO `user` (`username`, `password`, `role`, `name`) VALUES 
('admin', '123456', 'ADMIN', '系统管理员');

-- 插入测试数据：考生账户
INSERT INTO `user` (`username`, `password`, `role`, `name`) VALUES 
('student1', '123456', 'STUDENT', '张三'),
('student2', '123456', 'STUDENT', '李四');

-- 插入测试数据：单选题
INSERT INTO `question` (`type`, `content`, `option_a`, `option_b`, `option_c`, `option_d`, `answer`, `score`) VALUES 
('SINGLE', 'Java中，以下哪个是正确的主方法签名？', 'public static void main(String args)', 'public static void main(String[] args)', 'public void main(String[] args)', 'static void main(String args[])', 'B', 10),
('SINGLE', '以下哪个不是Java的基本数据类型？', 'int', 'String', 'boolean', 'char', 'B', 10),
('SINGLE', 'Java中，用于实现接口的关键字是？', 'extends', 'implements', 'interface', 'abstract', 'B', 10),
('SINGLE', '以下哪个集合是有序且允许重复的？', 'HashSet', 'HashMap', 'ArrayList', 'TreeSet', 'C', 10),
('SINGLE', 'Java中，finally块的作用是？', '处理异常', '定义需要执行的代码，无论是否发生异常', '捕获异常', '抛出异常', 'B', 10),
('SINGLE', '以下哪个访问修饰符的访问范围最广？', 'private', 'protected', 'default', 'public', 'D', 10),
('SINGLE', 'Java中，创建线程的方式不包括以下哪个？', '继承Thread类', '实现Runnable接口', '实现Callable接口', '实现Thread接口', 'D', 10),
('SINGLE', '以下哪个是Java的编译命令？', 'java', 'javac', 'jar', 'javadoc', 'B', 10);

-- 插入测试数据：多选题
INSERT INTO `question` (`type`, `content`, `option_a`, `option_b`, `option_c`, `option_d`, `answer`, `score`) VALUES 
('MULTIPLE', '以下哪些是Java的访问修饰符？', 'public', 'private', 'static', 'protected', 'ABD', 10),
('MULTIPLE', '以下哪些是Java的集合接口？', 'List', 'Set', 'Map', 'Array', 'ABC', 10),
('MULTIPLE', '以下哪些是面向对象的基本特征？', '封装', '继承', '多态', '递归', 'ABC', 10),
('MULTIPLE', '以下哪些是Java中的关键字？', 'this', 'super', 'null', 'sizeof', 'ABC', 10);
