import{_ as n,p as s,q as a,a1 as e}from"./framework-8fa3e4ce.js";const t={},c=e(`<h1 id="设计模式-单例模式" tabindex="-1"><a class="header-anchor" href="#设计模式-单例模式" aria-hidden="true">#</a> 设计模式-单例模式</h1><p>单例模式，属于创建类型的一种常用的软件设计模式。通过单例模式的方法创建的类在当前进程中只有一个实例</p><ul><li>懒汉模式：使用的时候才初始化</li><li>饿汉模式：直接初始化</li></ul><h2 id="静态变量" tabindex="-1"><a class="header-anchor" href="#静态变量" aria-hidden="true">#</a> 静态变量</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 饿汉模式（静态变量）
 */</span>
<span class="token keyword">class</span> <span class="token class-name">SingletonStatic</span> <span class="token punctuation">{</span>
    <span class="token comment">//通过静态变量直接初始化</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">static</span> <span class="token class-name">SingletonStatic</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SingletonStatic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//私有构造方法</span>
    <span class="token keyword">private</span> <span class="token class-name">SingletonStatic</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//所有其他类通过此方法拿到静态变量</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SingletonStatic</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="静态代码块" tabindex="-1"><a class="header-anchor" href="#静态代码块" aria-hidden="true">#</a> 静态代码块</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 饿汉模式（静态代码块）
 */</span>
<span class="token keyword">class</span> <span class="token class-name">SingletonStaticBlock</span> <span class="token punctuation">{</span>
    <span class="token comment">//创建内部对象</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">SingletonStaticBlock</span> instance<span class="token punctuation">;</span>

    <span class="token comment">//在静态代码块中创建单例对象</span>
    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SingletonStaticBlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//私有构造方法</span>
    <span class="token keyword">private</span> <span class="token class-name">SingletonStaticBlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//所有其他类通过此方法拿到静态变量</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SingletonStaticBlock</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="懒汉模式-线程不安全" tabindex="-1"><a class="header-anchor" href="#懒汉模式-线程不安全" aria-hidden="true">#</a> 懒汉模式（线程不安全）</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">SingletonUnSafe</span> <span class="token punctuation">{</span>
    <span class="token comment">//创建内部对象</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">SingletonUnSafe</span> instance<span class="token punctuation">;</span>

    <span class="token comment">//私有构造方法</span>
    <span class="token keyword">private</span> <span class="token class-name">SingletonUnSafe</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//所有其他类通过此方法拿到静态变量</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SingletonUnSafe</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SingletonUnSafe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="懒汉模式-同步方法" tabindex="-1"><a class="header-anchor" href="#懒汉模式-同步方法" aria-hidden="true">#</a> 懒汉模式（同步方法）</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">SingletonSync</span> <span class="token punctuation">{</span>
    <span class="token comment">//创建内部对象</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">SingletonSync</span> instance<span class="token punctuation">;</span>

    <span class="token comment">//私有构造方法</span>
    <span class="token keyword">private</span> <span class="token class-name">SingletonSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//所有其他类通过此方法拿到静态变量</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">synchronized</span> <span class="token class-name">SingletonSync</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SingletonSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="懒汉模式-同步代码块" tabindex="-1"><a class="header-anchor" href="#懒汉模式-同步代码块" aria-hidden="true">#</a> 懒汉模式（同步代码块）</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">SingletonSyncBlock</span> <span class="token punctuation">{</span>
    <span class="token comment">//创建内部对象</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">SingletonSyncBlock</span> instance<span class="token punctuation">;</span>

    <span class="token comment">//私有构造方法</span>
    <span class="token keyword">private</span> <span class="token class-name">SingletonSyncBlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//所有其他类通过此方法拿到静态变量</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SingletonSyncBlock</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token class-name">SingletonSyncBlock</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SingletonSyncBlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="懒汉模式-双重检查" tabindex="-1"><a class="header-anchor" href="#懒汉模式-双重检查" aria-hidden="true">#</a> 懒汉模式（双重检查）</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">SingletonDoubleCheck</span> <span class="token punctuation">{</span>
    <span class="token comment">//创建内部对象</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">volatile</span> <span class="token class-name">SingletonDoubleCheck</span> instance<span class="token punctuation">;</span>

    <span class="token comment">//私有构造方法</span>
    <span class="token keyword">private</span> <span class="token class-name">SingletonDoubleCheck</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//所有其他类通过此方法拿到静态变量</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SingletonDoubleCheck</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token class-name">SingletonSyncBlock</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SingletonDoubleCheck</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="静态内部类" tabindex="-1"><a class="header-anchor" href="#静态内部类" aria-hidden="true">#</a> 静态内部类</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">SingletonStaticClass</span> <span class="token punctuation">{</span>
    <span class="token comment">//创建内部对象</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">volatile</span> <span class="token class-name">SingletonStaticClass</span> instance<span class="token punctuation">;</span>

    <span class="token comment">//私有构造方法</span>
    <span class="token keyword">private</span> <span class="token class-name">SingletonStaticClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//所有其他类通过此方法拿到静态变量</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SingletonStaticClass</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Singleton</span><span class="token punctuation">.</span><span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">SingletonStaticClass</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SingletonStaticClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="枚举类" tabindex="-1"><a class="header-anchor" href="#枚举类" aria-hidden="true">#</a> 枚举类</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">enum</span> <span class="token class-name">SingletonEnum</span> <span class="token punctuation">{</span>
    <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19),p=[c];function l(i,o){return s(),a("div",null,p)}const d=n(t,[["render",l],["__file","单例模式.html.vue"]]);export{d as default};
