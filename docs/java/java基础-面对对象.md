# java基础-面对对象

推荐阅读[java开发实战经典](../README.md) 

## 一、面对对象

### 三大特性

* 封装性
  * 解释：利用抽象数据类型将数据和基于数据的操作封装在一起，使其构成一个不可分割的独立实体。数据被保护在抽象数据类型的内部，尽可能地隐藏内部的细节，只保留一些对外接口使之与外部发生联系。用户无需知道对象内部的细节，但可以通过对象对外提供的接口来访问该对象。
  * 减少耦合: 可以独立地开发、测试、优化、使用、理解和修改
  * 减轻维护的负担: 可以更容易被程序员理解，并且在调试的时候可以不影响其他模块
  * 有效地调节性能: 可以通过剖析确定哪些模块影响了系统的性能
  * 提高软件的可重用性
  * 降低了构建大型系统的风险: 即使整个系统不可用，但是这些独立的模块却有可能是可用的

* 继承性
  * 继承实现了 **IS-A** 关系，例如 Cat 和 Animal 就是一种 IS-A 关系，因此 Cat 可以继承自 Animal，从而获得 Animal 非 private 的属性和方法。

* 多态性

  * 方法重载：编译时多态
  * 对象多态：对象可以与父类对象进行相互转换，而且根据其使用的子类的不同，完成的功能也不相同
    * 继承
    * 覆盖（重写）
    * 向上转型

### 类关系

* 泛化关系
  * java中使用 extends关键字，由于描述继承关系
* 实现关系
  * java中使用implements关键字，用于实现一个接口
* 聚合关系
  * 整体由部分组成，整体和部分不是强依赖。整体不存在了，部分仍然存在。
* 组合关系
  * 和聚合类似，组合中整体和部分是强依赖的，整体不存在，部分也就不存在了。
* 关联关系
  * 表示不同类对象之间有关联，这是一种静态关系，与运行过程的状态无关，在最开始就可以确定
* 依赖关系
  * 和关联关系不同的是，依赖关系是在运行过程中起作用的。A 类和 B 类是依赖关系主要有三种形式:
    * A 类是 B 类中的(某中方法的)局部变量；
    * A 类是 B 类方法当中的一个参数；
    * A 类向 B 类发送消息，从而影响 B 类发生变化
