import{_ as e,M as t,p as i,q as l,R as s,t as n,N as p,a1 as o}from"./framework-8fa3e4ce.js";const c={},r=s("h1",{id:"文档构建",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#文档构建","aria-hidden":"true"},"#"),n(" 文档构建")],-1),d={href:"https://v2.vuepress.vuejs.org/zh/guide/getting-started.html",target:"_blank",rel:"noopener noreferrer"},u=o(`<p><strong>前提</strong>：安装好node</p><h2 id="一、安装" tabindex="-1"><a class="header-anchor" href="#一、安装" aria-hidden="true">#</a> 一、安装</h2><ol><li>创建目录</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> java-guide
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2"><li>初始化项目</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> java-guide 
<span class="token function">npm</span> init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>安装VuePress</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-D</span> vuepress@next
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="4"><li>在package.json文件增加启动脚本</li></ol><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;docs:dev&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vuepress dev docs&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;docs:build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vuepress build docs&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5"><li>创建文档目录并创建第一个文档</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> docs
<span class="token builtin class-name">echo</span> <span class="token string">&#39;# Hello VuePress&#39;</span> <span class="token operator">&gt;</span> docs/README.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="6"><li>本地启动</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> run docs:dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>访问地址： http://localhost:8080</p><h2 id="二、配置主题" tabindex="-1"><a class="header-anchor" href="#二、配置主题" aria-hidden="true">#</a> 二、配置主题</h2><p>导航和排版才是我们最关注的，主题配置可以帮助我们快速搭建一个良好的排版</p><ol><li>在docs/.vuepress目录下创建 config.js</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>defaultTheme<span class="token punctuation">,</span> defineUserConfig<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vuepress&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineUserConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">lang</span><span class="token operator">:</span> <span class="token string">&#39;zh-CN&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;java学习指南&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&#39;java学习指南&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">theme</span><span class="token operator">:</span> <span class="token function">defaultTheme</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">docsDir</span><span class="token operator">:</span> <span class="token string">&#39;docs&#39;</span><span class="token punctuation">,</span>
        <span class="token comment">//配置顶部导航栏的条目</span>
        <span class="token literal-property property">navbar</span><span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token punctuation">{</span><span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;首页&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token punctuation">{</span><span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;java基础&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">children</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token string">&#39;/java/javabase.md&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;/java/java数据结构.md&#39;</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">sidebarDepth</span><span class="token operator">:</span><span class="token number">4</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、部署" tabindex="-1"><a class="header-anchor" href="#三、部署" aria-hidden="true">#</a> 三、部署</h2><h3 id="github-pages" tabindex="-1"><a class="header-anchor" href="#github-pages" aria-hidden="true">#</a> github pages</h3><ol><li>在github上创建一个一样的仓库，修改config.js的文件</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  	<span class="token comment">// 路径名为 &quot;/&lt;REPO&gt;/&quot;</span>
    <span class="token literal-property property">base</span><span class="token operator">:</span> <span class="token string">&#39;/learn-typescript/&#39;</span><span class="token punctuation">,</span>
  	<span class="token comment">//...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>编写脚本</li></ol><p>deploy.bat</p><div class="language-bat line-numbers-mode" data-ext="bat"><pre class="language-bat"><code>@echo on
:: 调用npm生成静态文件
call npm run docs:build
:: 进入dist目录提交
cd docs\\.vuepress\\dist
git init
git add -A
git commit -m &#39;deploy&#39;
git push -f git@github.com:Steven-hsm/java-guide-blog.git master:gh-pages
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>deploy.sh</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/usr/bin/env sh</span>
<span class="token comment"># 确保脚本抛出遇到的错误</span>
<span class="token builtin class-name">set</span> <span class="token parameter variable">-e</span>

<span class="token comment"># 生成静态文件</span>
<span class="token function">npm</span> run docs:build

<span class="token comment"># 进入生成的文件夹</span>
<span class="token builtin class-name">cd</span> docs/.vuepress/dist

<span class="token function">git</span> init
<span class="token function">git</span> <span class="token function">add</span> <span class="token parameter variable">-A</span>
<span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&#39;deploy&#39;</span>

<span class="token comment"># 如果发布到 https://&lt;USERNAME&gt;.github.io/&lt;REPO&gt;</span>
<span class="token function">git</span> push <span class="token parameter variable">-f</span> git@github.com:https:Steven-hsm/java-guide-blog.git master:gh-pages
<span class="token builtin class-name">cd</span> -
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>Settings -&gt; Pages 中看到最后的地址</li></ol>`,29);function v(m,k){const a=t("ExternalLinkIcon");return i(),l("div",null,[r,s("p",null,[s("a",d,[n("官网 VuePress"),p(a)])]),u])}const g=e(c,[["render",v],["__file","文档构建.html.vue"]]);export{g as default};
