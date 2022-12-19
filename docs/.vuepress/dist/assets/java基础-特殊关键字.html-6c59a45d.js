import{_ as i,p as l,q as a,a1 as e}from"./framework-8fa3e4ce.js";const r={},t=e('<h1 id="java基础-特殊关键字" tabindex="-1"><a class="header-anchor" href="#java基础-特殊关键字" aria-hidden="true">#</a> java基础-特殊关键字</h1><h2 id="final" tabindex="-1"><a class="header-anchor" href="#final" aria-hidden="true">#</a> final</h2><p>表示修饰的对象不可变，主要有以下场景：</p><ol><li>数据：声明数据类常量，可以是编译时常量，也可以是运行时被初始化后不能被改变的常量 <ul><li>对于基本数据类型，final使数值不变。</li><li>对于引用类型，final使引用不变，但是被引用的对象本身是可以被改变的。</li></ul></li><li>方法：声明方法，表示方法不能被子类重写。 <ul><li>private方法被隐式的指令为final，如果子类存和父类（父类方法被private修饰）存在相同的方法，此时子类并不是重写父类方法，而是定义了一个新的方法。</li></ul></li><li>类：表示类不可被继承。</li></ol><h2 id="static" tabindex="-1"><a class="header-anchor" href="#static" aria-hidden="true">#</a> static</h2><p>翻译成静态的，这里可以理解为只能被初始化一次</p><ol><li><p>静态变量</p><ul><li>静态变量：又称为类变量，也就是说这个变量属于类的，类所有的实例都共享静态变量，可以直接通过类名来访问它；静态变量在内存中只存在一份。这个是在类加载器加载类时初始化的。</li><li>实例变量：每创建一个实例就会产生一个实例变量，它与该实例同生共死</li></ul></li><li><p>静态方法</p><ul><li>静态方法在类加载时初始化，不依赖任何实例。所以静态方法必须有实现，即不能为抽象方法</li><li>方法中不能有this和super关键字</li></ul></li><li><p>静态语句块：静态语句块在类初始化时运行一次</p></li><li><p>静态内部类</p><ul><li>非静态内部类依赖于外部类的实例，而静态内部类不需要</li><li>静态内部类不能访问外部类的非静态的变量和方法。</li></ul></li><li><p>静态导包</p></li></ol><ul><li>在使用静态变量和方法时不用再指明 ClassName，从而简化代码，但可读性大大降低（不建议这么做）</li></ul><ol start="6"><li>初始化顺序 <ul><li>父类(静态变量、静态语句块)</li><li>子类(静态变量、静态语句块)</li><li>父类(实例变量、普通语句块)</li><li>父类(构造函数)</li><li>子类(实例变量、普通语句块)</li><li>子类(构造函数)</li></ul></li></ol><h2 id="super" tabindex="-1"><a class="header-anchor" href="#super" aria-hidden="true">#</a> super</h2><ul><li>访问父类的构造函数: 可以使用 super() 函数访问父类的构造函数，从而委托父类完成一些初始化的工作。</li><li>访问父类的成员: 如果子类重写了父类的中某个方法的实现，可以通过使用 super 关键字来引用父类的方法实现。</li></ul><h2 id="synchronized" tabindex="-1"><a class="header-anchor" href="#synchronized" aria-hidden="true">#</a> synchronized</h2><h2 id="volatile" tabindex="-1"><a class="header-anchor" href="#volatile" aria-hidden="true">#</a> volatile</h2>',13),h=[t];function n(s,d){return l(),a("div",null,h)}const o=i(r,[["render",n],["__file","java基础-特殊关键字.html.vue"]]);export{o as default};
