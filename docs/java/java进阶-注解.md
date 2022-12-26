# java进阶-注解
注解是JDK1.5版本开始引入的一个特性，用于对代码进行说明，可以对包、类、接口、字段、方法参数、局部变量等进行注解。它主要的作用有以下四方面：
* 生成文档，通过代码里标识的元数据生成javadoc文档
* 编译检查，通过代码里标识的元数据让编译器在编译期间进行检查验证。
* 编译时动态处理，编译时通过代码里标识的元数据动态处理，例如动态生成代码
* 运行时动态处理，运行时通过代码里标识的元数据动态处理，例如使用反射注入实例。

注解常见分类：
* Java自带的标准注解，包括@Override、@Deprecated和@SuppressWarnings，分别用于标明重写某个方法、标明某个类或方法过时、标明要忽略的警告，用这些注解标明后编译器就会进行检查。
* 元注解，元注解是用于定义注解的注解，包括@Retention、@Target、@Inherited、@Documented，@Retention用于标明注解被保留的阶段，@Target用于标明注解使用的范围，@Inherited用于标明注解可继承，@Documented用于标明是否生成javadoc文档。
* 自定义注解，可以根据自己的需求定义注解，并可用元注解对自定义注解进行注解。

## java 内置注解
### 内置注解 - @Override
表示当前的方法定义将覆盖父类中的方法
```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```
### 内置注解 - @Deprecated
表示代码被弃用，如果使用了被@Deprecated注解的代码则编译器将发出警告
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})
public @interface Deprecated {
}
```
### 内置注解 - @SuppressWarnings
表示关闭编译器警告信息
```java
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    String[] value();
}
```

## 元注解
### 元注解 - @Target
描述注解的使用范围
arget注解用来说明那些被它所注解的注解类可修饰的对象范围：注解可以用于修饰 packages、types（类、接口、枚举、注解类）、类成员（方法、构造方法、成员变量、枚举值）、方法参数和本地变量（如循环变量、catch参数），在定义注解类时使用了@Target 能够更加清晰的知道它能够被用来修饰哪些对象，它的取值范围定义在ElementType 枚举中
```java
public enum ElementType {
    TYPE, // 类、接口、枚举类
    FIELD, // 成员变量（包括：枚举常量）
    METHOD, // 成员方法
    PARAMETER, // 方法参数
    CONSTRUCTOR, // 构造方法
    LOCAL_VARIABLE, // 局部变量
    ANNOTATION_TYPE, // 注解类
    PACKAGE, // 可用于修饰：包
    TYPE_PARAMETER, // 类型参数，JDK 1.8 新增
    TYPE_USE // 使用类型的任何地方，JDK 1.8 新增
}
```
### 元注解 - @Retention & @RetentionTarget
限定那些被它所注解的注解类在注解到其他类上以后，可被保留到何时，一共有三种策略，定义在RetentionPolicy枚举中
```java
public enum RetentionPolicy {
 
    SOURCE,    // 源文件保留
    CLASS,       // 编译期保留，默认值
    RUNTIME   // 运行期保留，可通过反射去获取注解信息
}
```
### 元注解 - @Documented
描述在使用 javadoc 工具为类生成帮助文档时是否要保留其注解信息。
### 元注解 - @Inherited
被它修饰的Annotation将具有继承性。如果某个类使用了被@Inherited修饰的Annotation，则其子类将自动具有该注解。
### 元注解 - @Repeatable (Java8)
允许在同一申明类型(类，属性，或方法)的多次使用同一个注解
### 元注解 - @Native (Java8)
使用 @Native 注解修饰成员变量，则表示这个变量可以被本地代码引用，常常被代码生成工具使用。对于 @Native 注解不常使用，了解即可

## 注解与反射接口
> 定义注解后，如何获取注解中的内容呢？反射包java.lang.reflect下的AnnotatedElement接口提供这些方法。这里注意：只有注解被定义为RUNTIME后，该注解才能是运行时可见，当class文件被装载时被保存在class文件中的Annotation才会被虚拟机读取。

AnnotatedElement 接口是所有程序元素（Class、Method和Constructor）的父接口，所以程序通过反射获取了某个类的AnnotatedElement对象之后，程序就可以调用该对象的方法来访问Annotation信息。我们看下具体的相关接口
* boolean isAnnotationPresent(Class<?extends Annotation> annotationClass)
* <T extends Annotation> T getAnnotation(Class<T> annotationClass)
* Annotation[] getAnnotations()
* <T extends Annotation> T[] getAnnotationsByType(Class<T> annotationClass)
* <T extends Annotation> T getDeclaredAnnotation(Class<T> annotationClass)
* <T extends Annotation> T[] getDeclaredAnnotationsByType(Class<T> annotationClass)
* Annotation[] getDeclaredAnnotations()
 
## 深入理解注解
注解可以理解成一个标识，在获取类的元信息时，可以拿到这个标识，然后根据标识进行一系列的操作。
