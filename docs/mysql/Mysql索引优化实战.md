### 1.数据准备

**创建表**

```sql
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(24) NOT NULL DEFAULT '' COMMENT '姓名',
  `age` int NOT NULL DEFAULT '0' COMMENT '年龄',
  `position` varchar(20) NOT NULL DEFAULT '' COMMENT '职位',
  `hire_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入职时间',
  PRIMARY KEY (`id`),
  KEY `idx_name_age_position` (`name`,`age`,`position`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='员工记录表';
```

**初始化数据**

```mysql
INSERT INTO employees(name,age,position,hire_time) VALUES('LiLei',22,'manager',NOW());
INSERT INTO employees(name,age,position,hire_time) VALUES('HanMeimei', 23,'dev',NOW());
INSERT INTO employees(name,age,position,hire_time) VALUES('Lucy',23,'dev',NOW());
```

**初始化10000条数据**

```sql
--  插入100000条示例数据
drop procedure if exists insert_emp;
delimiter ;;
create procedure insert_emp()
begin
	declare i int;
	set i=1;
	while(i<=100000)do
		insert into employees(name,age,position) values(CONCAT('zhuge',i),i,'dev');
		set i=i+1;
	end while;
end;;
delimiter ;
call insert_emp();
```

### 2.简单例子

* 联合索引第一个字段用范围不会走索引 `idx_name_age_position` (`name`,`age`,`position`)

  ```mysql
  EXPLAIN SELECT * FROM employees WHERE name > 'LiLei' AND age = 22 AND position ='manager';
  ```

  这里如果根据联合idx_name_age_position，只能命中name字段，结果集很大，考虑到 `select * `,获取到的结果集会回表，最终选择全表扫描

  ```Mysql
  EXPLAIN SELECT * FROM employees WHERE name <'LiLei' AND age = 23 AND position ='manager'; 
  EXPLAIN SELECT name FROM employees WHERE name > 'LiLei' AND age = 22 AND position ='manager';
  ```

  第一条结果集小，回表的效率高，这里也会命中索引

  第二条索引值包含结果集，不需要回表，直接命中索引

* 强制走索引

  ```sql
  EXPLAIN SELECT * FROM employees force index(idx_name_age_position) WHERE name > 'LiLei' AND age = 22 AND position ='manager';
  ```

* 覆盖索引优化

  * 覆盖索引：索引字段包含了需要返回的结果集，无需回表操作

  ```mysql
  EXPLAIN SELECT name,age,position FROM employees WHERE name > 'LiLei' AND age = 22 AND position ='manager';
  ```

* in和or在表数据量比较大的情况会走索引，在表记录不多的情况下会选择全表扫描

  优化器会对比回表和全表扫描的，优化器根据算法决定走索引还是全表扫描

* `like KK% `一般情况都会走索引

  ```mysql
  SELECT * FROM employees WHERE name like 'LiLei%'AND age = 22 AND position ='manager'
  ```

  * **索引下推**:对于辅助的联合索引(name,age,position)，正常情况按照最左前缀原则,这种情况只会走name字段索引，因为根据name字段过滤完，得到的索引行里的age和position是无序的，无法很好的利用索引。
  * 在MySQL5.6之前的版本，这个查询只能在联合索引里匹配到名字是 **'LiLei' 开头**的索引，然后拿这些索引对应的主键逐个回表，到主键索引上找出相应的记录，再比对**age**和**position**这两个字段的值是否符合
  * MySQL 5.6引入了索引下推优化，**可以在索引遍历过程中，对索引中包含的所有字段先做判断，过滤掉不符合条件的记录之后再回表，可以有效的减少回表次数**
  * 使用了索引下推优化后，上面那个查询在联合索引里匹配到名字是 **'LiLei' 开头**的索引之后，同时还会在索引里过滤**age**和**position**这两个字段，拿着过滤完剩下的索引对应的主键id再回表查整行数据。

### 3. 常见sql深入优化

* **Order by与Group by优化**

  * MySQL支持两种方式的排序filesort和index，Using index是指MySQL扫描索引本身完成排序。index效率高，filesort效率低。
  * order by满足两种情况会使用Using index。
    *  order by语句使用索引最左前列
    *  使用where子句与order by子句条件列组合满足索引最左前列
  * 尽量在索引列上完成排序，遵循索引建立（索引创建的顺序）时的最左前缀法则
  * 如果order by的条件不在索引列上，就会产生Using filesort
  * 能用覆盖索引尽量用覆盖索引
  * group by与order by很类似，其实质是先排序后分组，遵照索引创建顺序的最左前缀法则
  * 对于groupby的优化如果不需要排序的可以加上**order by null禁止排序**
  * where高于having，能写在where中的限定条件就不要去having限定了

* **Using filesort文件排序原理详解**

  ```mysql
  explain select * from employees where name='zhuge' ORDER BY position
  ```

  * **filesort文件排序方式**
    * 单路排序：是一次性取出满足条件行的所有字段，然后在sort buffer中进行排序；用trace工具可以看到sort_mode信息里显示< sort_key, additional_fields >或者< sort_key,packed_additional_fields >
      1. 从索引name找到第一个满足 name = ‘zhuge’ 条件的主键 id
      2. 根据主键 id 取出整行，**取出所有字段的值，存入 sort_buffer 中**
      3. 从索引name找到下一个满足 name = ‘zhuge’ 条件的主键 id
      4. 重复步骤 2、3 直到不满足 name = ‘zhuge’
      5. 对 sort_buffer 中的数据按照字段 position 进行排序
      6. 返回结果给客户端
    * 双路排序（又叫**回表**排序模式）：是首先根据相应的条件取出相应的**排序字段**和**可以直接定位行**数据的行 ID，然后在 sort buffer 中进行排序，排序完后需要再次取回其它需要的字段；用trace工具可以看到sort_mode信息里显示< sort_key, rowid >
      1. 从索引 name 找到第一个满足 name = ‘zhuge’ 的主键id
      2. 根据主键 id 取出整行，**把排序字段 position 和主键 id 这两个字段放到 sort buffer 中**
      3. 从索引 name 取下一个满足 name = ‘zhuge’ 记录的主键 id
      4. 重复 3、4 直到不满足 name = ‘zhuge’
      5. . 对 sort_buffer 中的字段 position 和主键 id 按照字段 position 进行排序
      6. 遍历排序好的 id 和字段 position，按照 id 的值**回到原表**中取出 所有字段的值返回给客户端
    * MySQL 通过比较系统变量 max_length_for_sort_data(**默认1024字节**) 的大小和需要查询的字段总大小来判断使用哪种排序模式。
    * 如果 字段的总长度小于max_length_for_sort_data ，那么使用 单路排序模式；
    * 如果 字段的总长度大于max_length_for_sort_data ，那么使用 双路排序模∙式。

  > 如果全部使用sort_buffer内存排序一般情况下效率会高于磁盘文件排序，但不能因为这个就随便增大sort_buffer(默认1M)，mysql很多参数设置都是做过优化的，不要轻易调整

### 4. 索引设计原则

* **代码先行，索引后上**

* **联合索引尽量覆盖条件**

* **不要在小基数字段上建立索引**

* **长字符串我们可以采用前缀索引**

* **where与order by冲突时优先where**

* **基于慢sql查询做优化**

### 5.分页查询

```mysql
 select * from employees limit 10000,10;
```

表示从表 employees 中取出从 10001 行开始的 10 行记录。看似只查询了 10 条记录，实际这条 SQL 是先读取 10010条记录，然后抛弃前 10000 条记录，然后读到后面 10 条想要的数据。因此要查询一张大表比较靠后的数据，执行效率是非常低的。

* **根据自增且连续的主键排序的分页查询**

  ```mysql
   select * from employees where id > 90000 limit 5;
  ```

  * 主键自增且连续
  * 结果是按照主键排序的

* **根据非主键字段排序的分页查询**

  ```mysql
  EXPLAIN select * from employees ORDER BY name limit 90000,5;
  ```

  * 扫描整个索引并查找到没索引的行(可能要遍历多个索引树)的成本比扫描全表的成本更高，所以优化器放弃使用索引

  * 关键是**让排序时返回的字段尽可能少**

  * 优化

    ```mysql
    EXPLAIN  select * from employees e inner join (select id from employees order by name limit 90000,5) ed on e.id = ed.id;
    ```

    原 SQL 使用的是 filesort 排序，而优化后的 SQL 使用的是索引排序,查询时间在100万数据的基础上减少了一半以上

### 6. join关联查询优化

创建表

```sql
-- 新建表t1
CREATE TABLE `t1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `a` int DEFAULT NULL,
  `b` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_a` (`a`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- 插入10000条数据到t1
drop procedure if exists insert_t1;
delimiter ;;
create procedure insert_t1()
begin
	declare i int;
	set i=1;
	while(i<=10000)do
		insert into t1(a,b) values(i,i);
		set i=i+1;
	end while;
end;;
delimiter ;
call insert_t1();
-- 新建表t2
create table t2 like t1;
-- 插入100条数据到t2
drop procedure if exists insert_t2;
delimiter ;;
create procedure insert_t2()
begin
	declare i int;
	set i=1;
	while(i<=100)do
		insert into t2(a,b) values(i,i);
		set i=i+1;
	end while;
end;;
delimiter ;
call insert_t2();
```

* **Nested-Loop Join**（NLJ） 算法（嵌套循环链接）

  ```mysql
  EXPLAIN select * from t1 inner join t2 on t1.a= t2.a;
  ```

  * 一次一行循环地从第一张表（称为**驱动表**）中读取行，在这行数据中取到关联字段，根据关联字段在另一张表（**被驱动表**）里取出满足条件的行，然后取出两张表的结果合集
  * 看执行计划
    * 驱动表是 t2，被驱动表是 t1。先执行的就是驱动表(执行计划结果的id如果一样则按从上到下顺序执行sql)；
    * 优化器一般会优先选择**小表做驱动表**。**所以使用 inner join 时，排在前面的表并不一定就是驱动表**
    * 当使用left join时，左表是驱动表，右表是被驱动表
    * 当使用right join时，右表时驱动表，左表是被驱动表
    * 当使用join时，mysql会选择数据量比较小的表作为驱动表，大表作为被驱动表
  * 使用了 NLJ算法。一般 join 语句中，如果执行计划 Extra 中未出现 **Using join buffer** 则表示使用的 join 算法是 NLJ
  * 流程：
    * 从表 t2 中读取一行数据（如果t2表有查询过滤条件的，会从过滤结果里取出一行数据）
    * 从第 1 步的数据中，取出关联字段 a，到表 t1 中查找
    * 取出表 t1 中满足条件的行，跟 t2 中获取到的结果合并，作为结果返回给客户端
    * 重复上面 3 步
  * 整个过程会读取 t2 表的所有数据(**扫描100行**)，然后遍历这每行数据中字段 a 的值，根据 t2 表中 a 的值索引扫描 t1 表中的对应行(**扫描100次 t1 表的索引，1次扫描可以认为最终只扫描 t1 表一行完整数据，也就是总共 t1 表也扫描了100行**)。因此整个过程扫描了 **200 行**。
  * 如果被驱动表的关联字段没索引，**使用NLJ算法性能会比较低(下面有详细解释)**，mysql会选择Block Nested-Loop Join算法。

* **Block Nested-Loop Join(**BNL)（基于块的嵌套循环连接）

  ```mysql
  EXPLAIN select * from t1 inner join t2 on t1.b= t2.b;
  ```

  * 把**驱动表**的数据读入到 join_buffer 中，然后扫描**被驱动表**，把**被驱动表**每一行取出来跟 join_buffer 中的数据做对比

  * 流程：

    *  把 t2 的所有数据放入到 **join_buffer** 中
    * 把表 t1 中每一行取出来，跟 join_buffer 中的数据做对比
    * 返回满足 join 条件的数据

  * 整个过程对表 t1 和 t2 都做了一次全表扫描，因此扫描的总行数为10000(表 t1 的数据总量) + 100(表 t2 的数据总量) =**10100**

  * join_buffer 里的数据是无序的，因此对表 t1 中的每一行，都要做 100 次判断，所以内存中的判断次数是100 * 10000= **100 万次**

  * join_buffer 的大小是由参数 join_buffer_size 设定的，默认值是 256k。如果放不下表 t2 的所有数据话，策略很简单，就是**分段放**
  
* 没有索引关联的时候一般会选择BNL,有索引是使用NLJ
  
* **对于关联sql的优化**
  
  * **关联字段加索引**，让mysql做join操作时尽量选择NLJ算法
  * **小表驱动大表**，写多表连接sql时如果**明确知道**哪张表是小表可以用straight_join写法固定连接驱动方式，省去mysql优化器自己判断的时间
    * **straight_join解释：straight_join**功能同join类似，但能让左边的表来驱动右边的表，能改表优化器对于联表查询的执行顺序。
    * **straight_join**只适用于inner join，并不适用于left join，right join。（因为left join，right join已经代表指定了表的执行顺序）
    * 尽可能让优化器去判断，因为大部分情况下mysql优化器是比人要聪明的。使用**straight_join**一定要慎重，因为部分情况下人为指定的执行顺序并不一定会比优化引擎要靠谱。
  
* **对于小表定义的明确**

  * 在决定哪个表做驱动表的时候，应该是两个表按照各自的条件过滤，**过滤完成之后**，计算参与 join 的各个字段的总数据量，**数据量小的那个表，就是“小表”**，应该作为驱动表

* **in和exsits优化**

  * 原则：**小表驱动大表**，即小的数据集驱动大的数据集

  * 当B表的数据集小于A表的数据集时，in优于exists

    ```mysql
    select * from A where id in (select id from B)
    ```

    等价于

    > for(select id from B){
    >
    > ​	select * from A where A.id = B.id
    >
    > }

  * 当A表的数据集小于B表的数据集时，exists优于in

    ```mysql
    select * from A where exists (select 1 from B where B.id = A.id)
    ```

    等价于

    > for(select * from A){
    >
    > ​     select * from B where B.id = A.id
    >
    > }

  * EXISTS (subquery)只返回TRUE或FALSE,因此子查询中的SELECT * 也可以用SELECT 1替换,官方说法是实际执行时会忽略SELECT清单,因此没有区别

  * EXISTS子查询的实际执行过程可能经过了优化而不是我们理解上的逐条对比

  * EXISTS子查询往往也可以用JOIN来代替，何种最优需要具体问题具体分析


### 7. count(*)查询优化

```sql
-- 临时关闭mysql查询缓存，为了查看sql多次执行的真实时间
set global query_cache_size=0;
set global query_cache_type=0;
-- sql1 
 EXPLAIN select count(1) from employees;
-- sql2
 EXPLAIN select count(id) from employees;
-- sql3 
EXPLAIN select count(name) from employees;
-- sql4 
 EXPLAIN select count(*) from employees;
```

以上4条sql只有根据某个字段count不会统计字段为null值的数据行四个sql的执行计划一样，说明这四个sql执行效率应该差不多

* 字段有索引
  * **count(\*)≈count(1)>count(字段)>count(主键 id)**
* 字段无索引
  * **count(\*)≈count(1)>count(主键 id)>count(字段)**
* count(1)跟count(字段)执行过程类似，不过count(1)不需要取出字段统计，就用常量1做统计，count(字段)还需要取出字段，所以理论上count(1)比count(字段)会快一点
* count(*) 是例外，mysql并不会把全部字段取出来，而是专门做了优化，不取值，按行累加，效率很高，所以不需要用count(列名)或count(常量)来替代 count(*)。
* 为什么对于count(id)，mysql最终选择辅助索引而不是主键聚集索引？因为二级索引相对主键索引存储数据更少，检索性能应该更高，mysql内部做了点优化(应该是在5.7版本才优化)

* 常见优化方法

  * 查询mysql自己维护的总行数
    * 对于**myisam存储引擎**的表做不带where条件的count查询性能是很高的，因为myisam存储引擎的表的总行数会被mysql存储在磁盘上，查询不需要计算
    * 对于**innodb存储引擎**的表mysql不会存储表的总记录行数(因为有MVCC机制，后面会讲)，查询count需要实时计算

  * show table status

    * 如果只需要知道表总行数的估计值可以用如下sql查询，性能很高

      ```mysql
      show table status like 'employees'
      ```

  * 将总数维护到Redis里
    * 插入或删除表数据行的时候同时维护redis里的表总行数key的计数值(用incr或decr命令)，但是这种方式可能不准，很难保证表操作和redis操作的事务一致性
  * 增加数据库计数表
    * 插入或删除表数据行的时候同时维护计数表，让他们在同一个事务里操作

### 8. Mysql规范解读

**MySQL数据类型选择**

* 确定合适的大类型：数字、字符串、时间、二进制；

* 确定具体的类型：有无符号、取值范围、变长定长等。

* 数值类型

  | 类型         | 大小                    | 范围（有符号）                 | 范围（无符号）     | 用途         |
  | ------------ | ----------------------- | ------------------------------ | ------------------ | ------------ |
  | TINYINT      | 1 字节                  | (-128, 127)                    | (0, 255)           | 小整数值     |
  | SMALLINT     | 2 字节                  | (-32 768, 32 767)              | (0, 65 535)        | 大整数值     |
  | MEDIUMINT    | 3 字节                  | (-8 388 608, 8 388 607)        | (0, 16 777 215)    | 大整数值     |
  | INT或INTEGER | 4 字节                  | (-2 147 483 648, 2 147483 647) | (0, 4 294 967 295) | 大整数值     |
  | BIGINT       | 8 字节                  |                                |                    | 极大整数值   |
  | FLOAT        | 4 字节                  |                                |                    | 单精度浮点数 |
  | DOUBLE       | 8 字节                  |                                |                    | 双进度浮点数 |
  | DECIMAL(M,D) | 如果M>D，为M+2否则为D+2 |                                |                    | 小数值       |

  * 如果整形数据没有负数，如ID号，建议指定为UNSIGNED无符号类型，容量可以扩大一倍
  * 建议使用TINYINT代替ENUM、BITENUM、SET
  * 避免使用整数的显示宽度(参看文档最后)，也就是说，不要用INT(10)类似的方法指定字段显示宽度，直接用INT。
  *  DECIMAL最适合保存准确度要求高，而且用于计算的数据，比如价格。但是在使用DECIMAL类型的时候，注意长度设置。
  * 建议使用整形类型来运算和存储实数，方法是，实数乘以相应的倍数后再操作
  * 整数通常是最佳的数据类型，因为它速度快，并且能使用AUTO_INCREMENT

* **日期和时间**

  | 类型     | 大小 | 范围                                       | 格式                | 用途                     |
  | -------- | ---- | ------------------------------------------ | ------------------- | ------------------------ |
  | DATE     | 3    | 1000-01-01 到 9999-12-31                   | YYYY-MM-DD          | 日期值                   |
  | TIME     | 3    | -838:59:59' 到 '838:59:59'                 | HH:MM:SS            | 时间值或持续时间         |
  | YEAR     | 1    | 1901 到 2155                               | YYYY                | 年份值                   |
  | DATETIME | 8    | 1000-01-01 00:00:00 到 9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
  | TIMESTAM | 4    | 1970-01-01 00:00:00 到 2038-01-19 03:14:07 | YYYYMMDDhhmmss      | 混合日期和时间值，时间戳 |

  * MySQL能存储的最小时间粒度为秒
  * 建议用DATE数据类型来保存日期。MySQL中默认的日期格式是yyyy-mm-dd
  * 用MySQL的内建类型DATE、TIME、DATETIME来存储时间，而不是使用字符串
  * 当数据格式为TIMESTAMP和DATETIME时，可以用CURRENT_TIMESTAMP作为默认（MySQL5.6以后），MySQL会自动返回记录插入的确切时间。
  * TIMESTAMP是UTC时间戳，与时区相关
  *  DATETIME的存储格式是一个YYYYMMDD HH:MM:SS的整数，与时区无关，你存了什么，读出来就是什么
  * 除非有特殊需求，一般的公司建议使用TIMESTAMP，它比DATETIME更节约空间，但是像阿里这样的公司一般会用DATETIME，因为不用考虑TIMESTAMP将来的时间上限问题。
  * 有时人们把Unix的时间戳保存为整数值，但是这通常没有任何好处，这种格式处理起来不太方便，我们并不推荐它

* 字符串

  | 类型       | 大小                | 用途                                                         |
  | ---------- | ------------------- | ------------------------------------------------------------ |
  | CHAR       | 0-255字节           | 定长字符串，char(n)当插入的字符串实际长度不足n时，插入空格进行补充保存。在进行检索时，尾部的空格会被去掉。 |
  | VARCHAR    | 0-65535 字节        | 变长字符串，varchar(n)中的n代表最大列长度，插入的            |
  | TINYBLOB   | 0-255字节           | 字符串实际长度不足n时不会补充空格不超过 255 个字符的二进制字符串 |
  | TINYTEXT   | 0-255字节           | 短文本字符串                                                 |
  | BLOB       | 0-65 535字节        | 二进制形式的长文本数据                                       |
  | TEXT       | 0-65 535字节        | 长文本数据                                                   |
  | MEDIUMBLOB | 0-16 777 215字节    | 二进制形式的中等长度文本数据                                 |
  | MEDIUMTEXT | 0-16 777 215字节    | 中等长度文本数据                                             |
  | LONGBLOB   | 0-4 294 967 295字节 | 二进制形式的极大文本数据                                     |
  | LONGTEXT   | 0-4 294 967 295字节 | 极大文本数据                                                 |

  * 字符串的长度相差较大用VARCHAR；字符串短，且所有值都接近一个长度用CHAR。
  * . CHAR和VARCHAR适用于包括人名、邮政编码、电话号码和不超过255个字符长度的任意字母数字组合。那些要用来计算的数字不要用VARCHAR类型保存，因为可能会导致一些与计算相关的问题。换句话说，可能影响到计算的准确性和完整性。
  * 尽量少用BLOB和TEXT，如果实在要用可以考虑将BLOB和TEXT字段单独存一张表，用id关联
  * BLOB系列存储二进制字符串，与字符集无关。TEXT系列存储非二进制字符串，与字符集相关
  *  BLOB和TEXT都不能有默认值











  

