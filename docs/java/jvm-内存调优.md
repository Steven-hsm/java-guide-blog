# jvm-内存调优

### 1. jvm内置命令

* jps 列出正在运行的jvm虚拟机进程，并显示虚拟机执行朱磊名称以及这些进程的本地虚拟机唯一ID
  * -q : 仅输出进程id
  * -m : 输出main方法的参数
  * -l :  输出完整的包名（应用主类名）
  * -v ：输出jvm参数
  * -V : 输出通过flag文件传递到JVM中的参数
  * -Joption : 传递参数到vm
* jmap 用来查看内存信息、实例个数以及占用内存大小
  * jmap -histo id 打印java堆对象内存大小
  * jmap -heap id 打印java堆对象汇总
  * jmap -dump:fromat=b,file=heap.hporf id 打印堆内存数据到文件。（可以通过jvisualvm命令工具导入该dump文件分析）
* jstack 用于生成虚拟机当前时刻的线程快照
  * jstack -F id 当正常输出的请求不被响应时，强制输出线程堆栈
  * jstack -m id 如果调用到本地方法的话，可以显示C/C++的堆栈
  * jstakc -l id 除堆栈外，显示关于锁的附加信息，在发生死锁时可以用jstack -l pid来观察锁持有情况
  * 分析java进程的内存情况
    * top -p pid 显示java进程的内存情况
    * 按H,获取每个线程的内存情况
    * jstack pid | grep -A 10 threadId 得到线程推展信息线程所在行的后10行
* jinfo 查看正在运行的java应用程序的扩展参数
  * jinfo -flags pid 查看jvm参数
  * jinfo -sysprops pid 查看java系统参数
* jstat 查看堆内存各部分的使用量，以及加载类的数量
  * jstat [-命令选项] [vmid] [间隔时间(毫秒)] [查询次数]
  * **jstat -gc pid 最常用**，可以评估程序内存使用及GC压力整体情况
    * S0C：第一个幸存区的大小，单位KB
    * S1C：第二个幸存区的大小
    * S0U：第一个幸存区的使用大小
    * S1U：第二个幸存区的使用大小
    * EC：伊甸园区的大小
    * EU：伊甸园区的使用大小
    * OC：老年代大小
    * OU：老年代使用大小
    * MC：方法区大小(元空间)
    * MU：方法区使用大小
    * CCSC:压缩类空间大小
    * CCSU:压缩类空间使用大小
    * YGC：年轻代垃圾回收次数
    * YGCT：年轻代垃圾回收消耗时间，单位s
    * FGC：老年代垃圾回收次数
    * FGCT：老年代垃圾回收消耗时间，单位s
    * GCT：垃圾回收消耗总时间，单位s
  * jstat -gccapacity pid 堆内存统计
  * jstat -gcnew pid 新生代垃圾回收统计
  * jstat -gcnewcapacity pid 新生代内存统计
  * jstat -gcold pid 老年代垃圾回收统计
  * jstat gcoldcapacity pid 老年代内存统计
  * jstat -gcmetacapacity pid 元空间数据统计

### 2.arthas

**Arthas** 是 Alibaba 在 2018 年 9 月开源的 **Java 诊断**工具。支持 JDK6+， 采用命令行交互模式，可以方便的定位和诊断

线上程序运行问题。**Arthas** 官方文档十分详细，详见：https://alibaba.github.io/arthas

**使用**

```shell
# github下载arthas
wget https://alibaba.github.io/arthas/arthas‐boot.jar
# 或者 Gitee 下载
wget https://arthas.gitee.io/arthas‐boot.jar
# 运行arthas
java -jar arthas‐boot.jar
```

**常用命令**

1. dashboard 可以查看整个进程的运行情况，线程、内存、GC、运行环境信息
2. thread 展示所有的线程信息
   1.  thread 线程ID 可以查看线程堆栈
   2. thread  -b 查找死锁信息
3. jad 类名  反编译线上的代码
4. ognl 查看线上变量的值，甚至可以修改变量的值
   1. ognl 类属性.add   可以往线上变量中添加值

### 3. GC日志详解

对于java应用我们可以通过一些配置把程序运行过程中的gc日志全部打印出来，然后分析gc日志得到关键性指标，分析GC原因，调优JVM参数。

打印GC日志方法，在JVM参数里增加参数，%t 代表时间

```shel
1 ‐Xloggc:./gc‐%t.log ‐XX:+PrintGCDetails ‐XX:+PrintGCDateStamps ‐XX:+PrintGCTimeStamps ‐XX:+PrintGCCause
2 ‐XX:+UseGCLogFileRotation ‐XX:NumberOfGCLogFiles=10 ‐XX:GCLogFileSize=100M
```

### 4.Class常量池和运行时常量池

#### 4.1 Class常量池

Class常量池可以理解为是Class文件中的资源仓库。 Class文件中除了包含类的版本、字段、方法、接口等描述信息外，还有一项信息就是常量池(constant pool table)，用于存放编译期生成的各种字面量(Literal)和符号引用(SymbolicReferences)

* **字面量:**字面量就是指由字母、数字等构成的字符串或者数值常量

* **符号引用：**符号引用是编译原理中的概念，是相对于直接引用来说的。主要包括了以下三类常量：
  * 类和接口的全限定名
  * 字段的名称和描述符
  * 方法的名称和描述符

这些常量池现在是静态信息，只有到运行时被加载到内存后，这些符号才有对应的内存地址信息，这些常量池一旦被装入内存就变成**运行时常量池**.对应的符号引用在程序加载或运行时会被转变为被加载到内存区域的代码的直接引用，也就是我们说的**动态链接了**

#### 4	.2 字符串常量池

* 字符串的分配，和其他的对象分配一样，耗费高昂的时间与空间代价，作为最基础的数据类型，大量频繁的创建字符串，极大程度地影响程序的性能
* JVM为了提高性能和减少内存开销，在实例化字符串常量的时候进行了一些优化
  * 为字符串开辟一个字符串常量池，类似于缓存区
  * 创建字符串常量时，首先查询字符串常量池是否存在该字符串
  * 存在该字符串，返回引用实例，不存在，实例化该字符串并放入池中

**三种字符串操作（JDK1.7及以上）**

* 直接赋值字符串
  * String s = "zhuge"; // s指向常量池中的引用
  * 这种方式创建的字符串对象，只会在常量池中
  * 因为有"zhuge"这个字面量，创建对象s的时候，JVM会先去常量池中通过 equals(key) 方法，判断是否有相同的对象
    * 如果有，则直接返回该对象在常量池中的引用
    * 如果没有，则会在常量池中创建一个新对象，再返回引用
* new String（）
  * String s1 = new String("zhuge"); // s1指向内存中的对象引用
  * 这种方式会保证字符串常量池和堆中都有这个对象，没有就创建，最后返回堆内存中的对象引用
  * 因为有"zhuge"这个字面量，所以会先检查字符串常量池中是否存在字符串"zhuge"
    * 不存在，先在字符串常量池里创建一个字符串对象；再去内存中创建一个字符串对象"zhuge"
    * 存在的话，就直接去堆内存中创建一个字符串对象"zhuge"
    * 最后，将内存中的引用返回
* intern方法
  * String s1 = new String("zhuge"); String s2 = s1.intern();
  * String中的intern方法是一个 native 的方法，当调用 intern方法时，如果池已经包含一个等于此String对象的字符串（用equals(oject)方法确定），则返回池中的字符串
  * **否则，将intern返回的引用指向当前字符串 s1**(jdk1.6版本需要将s1 复制到字符串常量池里)

**字符串常量池位置**

* Jdk1.6及之前： 有永久代, 运行时常量池在永久代，运行时常量池包含字符串常量池

* Jdk1.7：有永久代，但已经逐步“去永久代”，字符串常量池从永久代里的运行时常量池分离到堆里

* Jdk1.8及之后： 无永久代，运行时常量池在元空间，字符串常量池里依然在堆里

**字符串常量池设计原理**

字符串常量池底层是hotspot的C++实现的，底层类似一个 HashTable， 保存的本质上是字符串对象的引用。

看一道比较常见的面试题，下面的代码创建了多少个 String 对象？

```java
String s1 = new String("he") + new String("llo");
String s2 = s1.intern();

System.out.println(s1 == s2);
// 在 JDK 1.6 下输出是 false，创建了 6 个对象
// 在 JDK 1.7 及以上的版本输出是 true，创建了 5 个对象
// 当然我们这里没有考虑GC，但这些对象确实存在或存在过
```

为什么输出会有这些变化呢？主要还是字符串池从永久代中脱离、移入堆区的原因， intern() 方法也相应发生了变化

* 在 JDK 1.6 中，调用 intern() 首先会在字符串池中寻找 equal() 相等的字符串，假如字符串存在就返回该字符串在字符串池中的引用；假如字符串不存在，虚拟机会重新在永久代上创建一个实例，将 StringTable 的一个表项指向这个新创建的实例。

* 在 JDK 1.7 (及以上版本)中，由于字符串池不在永久代了，intern() 做了一些修改，更方便地利用堆中的对象。字符串存在时和 JDK 1.6一样，但是字符串不存在时不再需要重新创建实例，可以直接指向堆上的实例

示例一：

```java
String s0="zhuge";
String s1="zhuge";
String s2="zhu" + "ge";
System.out.println( s0==s1 ); //true
System.out.println( s0==s2 ); //true]
```

**分析：**s0,s1,s2在编译器就已经确定，都是字符串常量，所以s0==s1==s2

示例二：

```java
String s0="zhuge";
String s1=new String("zhuge");
String s2="zhu" + new String("ge");
System.out.println( s0==s1 ); // false
System.out.println( s0==s2 )； // false	
System.out.println( s1==s2 ); // false
```

**分析：**s0在编译器就已经确定，s1,s2都只能在运行期确定，都是新创建的对象

示例三：

```java
String a = "a1";
String b = "a" + 1;
System.out.println(a == b); // true

String a = "atrue";
String b = "a" + "true";
System.out.println(a == b); // true

String a = "a3.4";
String b = "a" + 3.4;
System.out.println(a == b); // true
```

**分析：**JVM对于字符串常量的"+"号连接，将在程序编译期，JVM就将常量字符串的"+"连接优化为连接后的值，拿"a" +1来说，经编译器优化后在class中就已经是a1。在编译期其字符串常量的值就确定下来，故上面程序最终的结果都为true

示例四：

```java
String a = "ab";
String bb = "b";
String b = "a" + bb;

System.out.println(a == b); // false
```

**分析：**JVM对于字符串引用，由于在字符串的"+"连接中，有字符串引用存在，而引用的值在程序编译期是无法确定的，即"a" + bb无法被编译器优化，只有在程序运行期来动态分配并将连接后的新地址赋给b。所以上面程序的结果也就为false

示例五：

```java
String a = "ab";
final String bb = "b";
String b = "a" + bb;

System.out.println(a == b); // true
```

**分析：**和示例4中唯一不同的是bb字符串加了final修饰，对于final修饰的变量，它在编译时被解析为常量值的一个本地拷贝存储到自己的常量池中或嵌入到它的字节码流中。所以此时的"a" + bb和"a" + "b"效果是一样的。故上面程序的结果为true

示例六：

```java
String a = "ab";
final String bb = getBB();
String b = "a" + bb;

System.out.println(a == b); // false

private static String getBB()
{
return "b";
}
```

**分析：**JVM对于字符串引用bb，它的值在编译期无法确定，只有在程序运行期调用方法后，将方法的返回值和"a"来动态连接并分配地址为b，故上面 程序的结果为false

**关于String不可变**

```java
String s = "a" + "b" + "c"; //就等价于String s = "abc";
String a = "a";
String b = "b";
String c = "c";
String s1 = a + b + c;
```

s1 这个就不一样了，可以通过观察其**JVM指令码**发现s1的"+"操作会变成如下操作：

```java
StringBuilder temp = new StringBuilder();
temp.append(a).append(b).append(c);
String s = temp.toString()
```

示例七：

```java
//字符串常量池："计算机"和"技术" 堆内存：str1引用的对象"计算机技术"
//堆内存中还有个StringBuilder的对象，但是会被gc回收，StringBuilder的toString方法会new String()，这个String才是真正返回的对象引用
String str2 = new StringBuilder("计算机").append("技术").toString(); //没有出现"计算机技术"字面量，所以不会在常量池里生成"计算机技术"对象
System.out.println(str2 == str2.intern()); //true
//"计算机技术" 在池中没有，但是在heap中存在，则intern时，会直接返回该heap中的引用
//字符串常量池："ja"和"va" 堆内存：str1引用的对象"java"
//堆内存中还有个StringBuilder的对象，但是会被gc回收，StringBuilder的toString方法会new String()，这个String才是真正返回的对象引用
String str1 = new StringBuilder("ja").append("va").toString(); //没有出现"java"字面量，所以不会在常量池里生成"java"对象
System.out.println(str1 == str1.intern()); //false
//java是关键字，在JVM初始化的相关类里肯定早就放进字符串常量池了
String s1=new String("test");
System.out.println(s1==s1.intern()); //false
//"test"作为字面量，放入了池中，而new时s1指向的是heap中新生成的string对象，s1.intern()指向的是"test"字面量之前在池中生成的字符串对象
String s2=new StringBuilder("abc").toString();
System.out.println(s2==s2.intern()); //false
//同上
```

**八种基本类型的包装类和对象池**

java中基本类型的包装类的大部分都实现了常量池技术(严格来说应该叫**对象池，**在堆上)，这些类是Byte,Short,Integer,Long,Character,Boolean,另外两种浮点数类型的包装类则没有实现。另外Byte,Short,Integer,Long,Character这5种整型的包装类也只是在对应值小于等于127时才可使用对象池，也即对象不负责创建和管理大于127的这些类的对象。因为一般这种比较小的数用到的概率相对较大。

```java
1

public class Test {

    public static void main(String[] args) {
        //5种整形的包装类Byte,Short,Integer,Long,Character的对象，
        //在值小于127时可以使用对象池
        Integer i1 = 127; //这种调用底层实际是执行的Integer.valueOf(127)，里面用到了IntegerCache对象池
        Integer i2 = 127;
        System.out.println(i1 == i2);//输出true

        //值大于127时，不会从对象池中取对象
        Integer i3 = 128;
        Integer i4 = 128;
        System.out.println(i3 == i4);//输出false

        //用new关键词新生成对象不会使用对象池
        Integer i5 = new Integer(127);
        Integer i6 = new Integer(127);
        System.out.println(i5 == i6);//输出false

        //Boolean类也实现了对象池技术
        Boolean bool1 = true;
        Boolean bool2 = true;
        System.out.println(bool1 == bool2);//输出true

        //浮点类型的包装类没有实现对象池技术
        Double d1 = 1.0;
        Double d2 = 1.0;
        System.out.println(d1 == d2);//输出false
    }
}
```



