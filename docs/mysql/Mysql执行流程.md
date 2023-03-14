### 1. Mysql内部结构

![image-20230307185153545](..\images\Mysql内部结构.png)

大体来说，MySQL 可以分为 Server 层和存储引擎层两部分。

#### 1.1 Server层

主要包括连接器、查询缓存、分析器、优化器、执行器等，涵盖 MySQL 的大多数核心服务功能，以及所有的内置函数 （如日期、时间、数学和加密函数等），所有跨存储引擎的功能都在这一层实现，比如存储过程、触发器、视图等。 

```sql
 CREATE TABLE `test` ( 
     `id` int(11) NOT NULL AUTO_INCREMENT, 
     `name` varchar(255) DEFAULT NULL, 
     PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
```

##### 1.1.1 连接器

我们知道由于MySQL是开源的，他有非常多种类的客户端：navicat,mysql front,jdbc,SQLyog等非常丰富的客户端,这些客户端要向mysql发起通信都必须先跟Server端建立通信连接，而建立连接的工作就是有连接器完成的。

* 连接到数据库，这个时候和客户端交互的就是连接器

  * 连接器负责跟客户端建立连接、获取权限、维持和管 理连接

    ```shell
    mysql ‐h host[数据库地址] ‐u root[用户] ‐p root[密码] ‐P 3306
    ```

    连接命令中的 mysql 是客户端工具，用来跟服务端建立连接。在完成经典的 TCP 握手后，连接器就要开始认证你的身份， 这个时候用的就是你输入的用户名和密码

  * 如果用户名或密码不对，你就会收到一个"Access denied for user"的错误，然后客户端程序结束执行

  * 如果用户名密码认证通过，连接器会到权限表里面查出你拥有的权限。之后，这个连接里面的权限判断逻辑，都将依赖于此时读到的权限。

    > 这就意味着，一个用户成功建立连接后，即使你用管理员账号对这个用户的权限做了修改，也不会影响已经存在连接的权限。修改完成后，只有再新建的连接才会使用新的权限设置。用户的权限表在系统表空间的mysql的user表中

* 基本操作

  ```sql
   CREATE USER 'username'@'host' IDENTIFIED BY 'password'; //创建新用户
   grant all privileges on *.* to 'username'@'%'; //赋权限,%表示所有(host)
   flush privileges //刷新数据库
   update user set password=password(”123456″) where user=’root’;//(设置用户名密码)
   show grants for root@"%"; //查看当前用户的权限
  ```

* 连接完成后，如果你没有后续的动作，这个连接就处于空闲状态，你可以在 show processlist 命令中看到它

  * 客户端如果长时间不发送command到Server端，连接器就会自动将它断开。这个时间是由参数 wait_timeout 控制的，默认值 是 8小时

  * 查看超时时间

    ```mysql
    show global variables like "wait_timeout";//查看等待超时时间
    set global wait_timeout=28800; //设置全局服务器关闭非交互连接之前等待活动的秒数
    ```

  * 连接被断开之后，客户端再次发送请求的话，就会收到一个错误提醒： Lost connection to MySQL server during query

* 数据库里面，长连接是指连接成功后，如果客户端持续有请求，则一直使用同一个连接。短连接则是指每次执行完很少的几次 查询就断开连接，下次查询再重新建立一个。

  * 开发当中我们大多数时候用的都是长连接,把连接放在Pool内进行管理

  * 长连接有些时候会导致 MySQL 占用内存涨得特别 快，这是因为 MySQL 在执行过程中临时使用的内存是管理在连接对象里面的，资源会在连接断开的时候才释放。所以如 果长连接累积下来，可能导致内存占用太大，被系统强行杀掉（OOM），从现象看就是 MySQL 异常重启了。

  * 如何解决长连接问题
    * 定期断开长连接。使用一段时间，或者程序里面判断执行过一个占用内存的大查询后，断开连接，之后要查询再重连。
    * 如果你用的是 MySQL 5.7 或更新版本，可以在每次执行一个比较大的操作后，通过执行 mysql_reset_connection 来重新初始化连接资 源。这个过程不需要重连和重新做权限验证，但是会将连接恢复到刚刚创建完时的状态

##### 1.1.2 查询缓存

* 常用操作

  ```sql
  show databases; //显示所有数据库
  use dbname； //打开数据库
  show tables; //显示数据库mysql中所有的表
  describe user; //显示表mysql数据库中user表的列信息）
  ```

* 连接建立完成后，你就可以执行 select 语句了。执行逻辑就会来到第二步：查询缓存。 

  * MySQL 拿到一个查询请求后，会先到查询缓存看看，之前是不是执行过这条语句
  * 之前执行过的语句及其结果可能会以 key-value 对的形式，被直接缓存在内存中。key 是查询的语句，value 是查询的结果
  * 如果你的查询能够直接在这个缓存中找 到 key，那么这个 value 就会被直接返回给客户端
  * 如果语句不在查询缓存中，就会继续后面的执行阶段。执行完成后，执行结果会被存入查询缓存中。你可以看到，如果查 询命中缓存，MySQL 不需要执行后面的复杂操作，就可以直接返回结果，这个效率会很高。 

* 大多数情况查询缓存就是个鸡肋，为什么呢？

  * 为查询缓存往往弊大于利。查询缓存的失效非常频繁，只要有对一个表的更新，这个表上所有的查询缓存都会被清空。对于更新压力大的数据库来说，查询缓存的命中率 会非常低

  * 一般建议大家在静态表（极少更新的表，比如系统配置表、字典表）里使用查询缓存

  * query_cache_type有3个值 0代表关闭查询缓存OFF，1代表开启ON，2（DEMAND）代表当sql语句中有SQL_CACHE 关键词时才缓存 ，可以在MySQL的配置文件中配置

    ```sql
     select SQL_CACHE * from test where ID=5；
    ```

  * 查看当前mysql实例是否开启缓存机制 

    ```mysql
     show global variables like "%query_cache_type%";
    ```

  * 检测缓存命中率

    ```mysql
     show status like'%Qcache%'; //查看运行的缓存信息
    ```

    * Qcache_free_blocks:表示查询缓存中目前还有多少剩余的blocks，如果该值显示较大，则说明查询缓存中的内存碎片 过多了，可能在一定的时间进行整理。

    * Qcache_free_memory:查询缓存的内存大小，通过这个参数可以很清晰的知道当前系统的查询内存是否够用，是多 了，还是不够用，DBA可以根据实际情况做出调整

    * Qcache_hits:表示有多少次命中缓存。我们主要可以通过该值来验证我们的查询缓存的效果。数字越大，缓存效果越 理想。

    * Qcache_inserts: 表示多少次未命中然后插入，意思是新来的SQL请求在缓存中未找到，不得不执行查询处理，执行 查询处理后把结果insert到查询缓存中。这样的情况的次数，次数越多，表示查询缓存应用到的比较少，效果也就不理想。当然系统刚启动后，查询缓存是空的，这很正常。 

    * Qcache_lowmem_prunes:该参数记录有多少条查询因为内存不足而被移除出查询缓存。通过这个值，用户可以适当的 调整缓存大小。

    * Qcache_not_cached: 表示因为query_cache_type的设置而没有被缓存的查询数量。

    * Qcache_queries_in_cache:当前缓存中缓存的查询数量

    * Qcache_total_blocks:当前缓存的block数量。

  * mysql8.0已经移除了查询缓存功能  

##### 1.1.3 分析器

如果没有命中查询缓存，就要开始真正执行语句了，首先，MySQL 需要知道你要做什么，因此需要对 SQL 语句做解析。

分析器先会做“词法分析”。你输入的是由多个字符串和空格组成的一条 SQL 语句，MySQL 需要识别出里面的字符串分别是 什么，代表什么

**词法分析器原理**

词法分析器分成6个主要步骤完成对sql语句的分析 

1. 词法分析 
2. 语法分析 
3. 语义分析 
4. 构造执行树 
5. 生成执行计划 
6. 计划的执行

![image-20230307192555391](..\images\Mysql词法分析.png)

SQL语句的分析分为词法分析与语法分析，mysql的词法分析由MySQLLex[MySQL自己实现的]完成，语法分析由Bison生 成。关于语法树大家如果想要深入研究可以参考这篇wiki文章：https://en.wikipedia.org/wiki/LR_parser。那么除了Bison 外，Java当中也有开源的词法结构分析工具例如Antlr4，ANTLR从语法生成一个解析器，可以构建和遍历解析树，可以在IDEA 工具当中安装插件：**antlr v4 grammar plugin。插件使用详见课程** 经过bison语法分析之后，会生成一个这样的语法树 

![image-20230307192745777](..\images\Mysql-语法分析树.png)

##### 1.1.4 优化器

优化器是在表里面有多个索引的时候，决定使用哪个索引；或者在一个语句有多表关联（join）的时候，决定各个表的连接 顺序

##### 1.1.5 执行器

开始执行的时候，要先判断一下你对这个表 T 有没有执行查询的权限，如果没有，就会返回没有权限的错误，如下所示 (在工程实现上，如果命中查询缓存，会在查询缓存返回结果的时候，做权限验证。查询也会在优化器之前调用 precheck 验证权限)。

##### 1.1.6 binlog归档

* binlog是Server层实现的二进制日志,他会记录我们的cud操作。Binlog有以下几个特点

  * Binlog在MySQL的Server层实现（引擎共用）

  * Binlog为逻辑日志,记录的是一条语句的原始逻辑

  * Binlog不限大小,追加写入,不会覆盖以前的日志

* 开启binlog日志

  * 配置my.cnf 

    ```shell
    # 配置开启binlog 
     log‐bin=/usr/local/mysql/data/binlog/mysql‐bin
     #注意5.7以及更高版本需要配置本项：server‐id=123454（自定义,保证唯一性）; 
     #binlog格式，有3种statement,row,mixed 
     binlog‐format=ROW 
     #表示每1次执行写入就与硬盘同步，会影响性能，为0时表示，事务提交时mysql不做刷盘操作，由系统决定 
     sync‐binlog=1
    ```

  * binlog命令

    ```mysql
    show variables like '%log_bin%'; #查看bin‐log是否开启
    flush logs; #会多一个最新的bin‐log日志
    show master status; #查看最后一个bin‐log日志的相关信息
    reset master; #清空所有的bin‐log日志
    ```

  * 查看binlog内容 

    ```mysql
    /usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults /usr/local/mysql/data/binlog/mysql‐bin. 000001 #查看binlog内容
    ```

binlog里的内容不具备可读性，所以需要我们自己去判断恢复的逻辑点位，怎么观察呢？看重点信息，比如begin,commit这种 关键词信息，只要在binlog当中看到了，你就可以理解为begin-commit之间的信息是一个完整的事务逻辑,然后再根据位置 position判断恢复即可

**数据归档操作**

```mysql
 从bin‐log恢复数据 2 恢复全部数据 3 /usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults /usr/local/mysql/data/binlog/mysql‐bin.000001 |mysql ‐uroot ‐p tuling(数据库名) 4 恢复指定位置数据 5 /usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults ‐‐start‐position="408" ‐‐stop‐position="731" /usr/local/mysql/data/binlog/mysql‐bin.000001 |mysql ‐uroot ‐p tuling(数据库) 6 恢复指定时间段数据 7 /usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults /usr/local/mysql/data/binlog/mysql‐bin.000001 ‐‐stop‐date= "2018‐03‐02 12:00:00" ‐‐start‐date= "2019‐03‐02 11:55:00"|mysql ‐uroot ‐p test(数 据库)
```

**归档测试**

1. 定义一个存储过程，写入数据

   ```mysql
   drop procedure if exists tproc; 
   delimiter $$ 
   create procedure tproc(i int) 
   begin
   	declare s int default 1; 
   	declare c char(50) default repeat('a',50); 
   	while s<=i do 
       	start transaction; 
       	insert into test values(null,c); 
         	commit; 
         	set s=s+1; 
       end while; 
   end$$ 
   delimiter ;
   ```

2. 删除数据

   ```mysql
    truncate test;
   ```

3. 利用binlog归档

   ```mysql
    /usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults /usr/local/mysql/data/binlog/mysql‐ bin.000001 |mysql ‐uroot ‐p tuling(数据库名)
   ```

#### 1.2 Store层

存储引擎层负责数据的存储和提取。其架构模式是插件式的，支持 InnoDB、MyISAM、Memory 等多个存储引擎。现在 最常用的存储引擎是 InnoDB，它从 MySQL 5.5.5 版本开始成为了默认存储引擎。也就是说如果我们在create table时不指定 表的存储引擎类型,默认会给你设置存储引擎为InnoDB。

