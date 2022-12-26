import{_ as e,M as t,p as l,q as p,R as a,t as s,N as c,a1 as o}from"./framework-8fa3e4ce.js";const i="/java-guide-blog/assets/泛型方法-39b2e690.png",u={},d=o(`<h1 id="java进阶-泛型" tabindex="-1"><a class="header-anchor" href="#java进阶-泛型" aria-hidden="true">#</a> java进阶-泛型</h1><p>Java泛型这个特性是从JDK 1.5才开始加入的，因此为了兼容之前的版本，Java泛型的实现采取了“伪泛型”的策略，即Java在语法上支持泛型，但是在编译阶段会进行所谓的“类型擦除”（Type Erasure），将所有的泛型表示（尖括号中的内容）都替换为具体的类型（其对应的原生态类型），就像完全没有泛型一样.</p><p>泛型的本质就是为了参数化类型</p><ul><li>在不创建新的类型的情况下，通过泛型指定的不同类型来控制形参具体限制的类型。</li><li>在泛型使用过程中，操作的数据类型被指定为一个参数，这种参数类型可以用在类、接口和方法中，分别被称为泛型类、泛型接口、泛型方法</li></ul><p><strong>作用</strong></p><ul><li>适用于多种数据类型执行相同的代码（代码复用）</li><li>泛型中的类型在使用时指定，不需要强制类型转换（类型安全，编译器会检查类型）</li></ul><h2 id="泛型类" tabindex="-1"><a class="header-anchor" href="#泛型类" aria-hidden="true">#</a> 泛型类</h2><ol><li>单元泛型</li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Result</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">T</span> data <span class="token punctuation">;</span><span class="token comment">//泛型数据，可以接收不同的类型结果</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> code<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> message<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>多元泛型</li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">MyMap</span><span class="token generics"><span class="token punctuation">&lt;</span>k<span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">K</span> key<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">V</span> value<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="泛型接口" tabindex="-1"><a class="header-anchor" href="#泛型接口" aria-hidden="true">#</a> 泛型接口</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">interface</span> <span class="token class-name">Info</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>        <span class="token comment">// 在接口上定义泛型  </span>
    <span class="token keyword">public</span> <span class="token class-name">T</span> <span class="token function">getVar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">;</span> <span class="token comment">// 定义抽象方法，抽象方法的返回值就是泛型类型  </span>
<span class="token punctuation">}</span>  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="泛型方法" tabindex="-1"><a class="header-anchor" href="#泛型方法" aria-hidden="true">#</a> 泛型方法</h2><p>泛型方法，是在调用方法的时候指明泛型的具体类型 <img src="`+i+`" alt="泛型方法.png"></p><ul><li>第一个<code>&lt;T&gt;</code>声明这是一个泛型方法，且泛型变量只能为T,多个可以写成&lt;T,R&gt;</li><li>泛型类要在实例化的时候就指明类型，如果想换一种类型，不得不重新new一次，可能不够灵活；而泛型方法可以在调用的时候指明类型，更加灵活</li></ul><h2 id="泛型的上下限" tabindex="-1"><a class="header-anchor" href="#泛型的上下限" aria-hidden="true">#</a> 泛型的上下限</h2><p>为了解决泛型中隐含的转换问题，Java泛型加入了类型参数的上下边界机制。&lt;? extends A&gt;表示该类型参数可以是A(上边界)或者A的子类类型。编译时擦除到类型A，即用A类型代替类型参数</p><ul><li>上限</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Info</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Number</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>    <span class="token comment">// 此处泛型只能是数字类型</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>下限</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">fun</span><span class="token punctuation">(</span><span class="token class-name">Info</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">super</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> temp<span class="token punctuation">)</span><span class="token punctuation">{</span>    <span class="token comment">// 只能接收String或Object类型的泛型，String类的父类只有Object类</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">print</span><span class="token punctuation">(</span>temp <span class="token operator">+</span> <span class="token string">&quot;, &quot;</span><span class="token punctuation">)</span> <span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>多个限制 &amp;</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code> <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Staff</span> <span class="token operator">&amp;</span> <span class="token class-name">Passenger</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">void</span> <span class="token function">discount</span><span class="token punctuation">(</span><span class="token class-name">T</span> t<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>&lt;?&gt;</code> 无限制通配符</li><li><code>&lt;? extends E&gt;</code> extends 关键字声明了类型的上界，表示参数化的类型可能是所指定的类型，或者是此类型的子类</li><li><code>&lt;? super E&gt;</code> super 关键字声明了类型的下界，表示参数化的类型可能是指定的类型，或者是此类型的父类</li></ul><h2 id="深入理解泛型" tabindex="-1"><a class="header-anchor" href="#深入理解泛型" aria-hidden="true">#</a> 深入理解泛型</h2><blockquote><p>Java泛型这个特性是从JDK 1.5才开始加入的，因此为了兼容之前的版本，Java泛型的实现采取了“伪泛型”的策略，即Java在语法上支持泛型，但是在编译阶段会进行所谓的“类型擦除”（Type Erasure），将所有的泛型表示（尖括号中的内容）都替换为具体的类型（其对应的原生态类型），就像完全没有泛型一样。理解类型擦除对于用好泛型是很有帮助的，尤其是一些看起来“疑难杂症”的问题，弄明白了类型擦除也就迎刃而解了。</p></blockquote><p><strong>泛型的类型擦除</strong>原则是：</p><ul><li>消除类型参数声明，即删除<code>&lt;&gt;</code>及其包围的部分。</li><li>根据类型参数的上下界推断并替换所有的类型参数为原生态类型：如果类型参数是无限制通配符或没有上下界限定则替换为Object，如果存在上下界限定则根据子类替换原则取类型参数的最左边限定类型（即父类）。</li><li>为了保证类型安全，必要时插入强制类型转换代码。</li><li>自动产生“桥接方法”以保证擦除类型后的代码仍然具有泛型的“多态性”。</li></ul><p><strong>如何擦除</strong></p><ul><li>擦除类型参数 - 无限制类型擦除 T -&gt; Object</li><li>擦除类型参数 - 有限制类型擦除 T extends Number -&gt; Number</li></ul>`,31),r={href:"https://www.pdai.tech/md/java/basic/java-basic-x-generic.html",target:"_blank",rel:"noopener noreferrer"};function k(v,m){const n=t("ExternalLinkIcon");return l(),p("div",null,[d,a("p",null,[s("参考 "),a("a",r,[s("泛型机制详解"),c(n)])])])}const b=e(u,[["render",k],["__file","java进阶-泛型.html.vue"]]);export{b as default};
