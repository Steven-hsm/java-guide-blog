import {defaultTheme, defineUserConfig} from 'vuepress'

export default defineUserConfig({
    lang: 'zh-CN',
    title: 'java学习指南',
    description: 'java学习指南',
    base: '/java-guide-blog',
    theme: defaultTheme({
        docsDir: 'docs',
        //配置顶部导航栏的条目
        navbar: [
            {text: '文档搭建', link: '/文档构建.md'},
            {text: 'java', children:[
                '/java/java基础-基本介绍.md','/java/java基础-面对对象.md','/java/java基础-特殊关键字.md','/java/java基础-String.md',
                 '/java/java进阶-异常.md','/java/java进阶-注解.md','/java/java进阶-反射.md','/java/java进阶-泛型.md',
                 '/java/jvm-内存模型.md','/java/jvm-垃圾回收.md','/java/jvm-内存调优.md','/java/jvm-arthas.md']},
            {text: '设计模式', children:[
                '/设计模式/单例模式.md',
                ]},
            {text: 'web基础', link: 'https://google.com'},
            {text: 'spring', link: 'https://google.com'},
            {text: 'spring全家桶', link: 'https://google.com'},
            {text: '中间件', link: 'https://google.com'},
            {text: '数据结构', link: 'https://google.com'},
            {text: '算法', link: 'https://google.com'},
            {text: '数据结构', link: 'https://google.com'},
            {text: '分布式', link: 'https://google.com'},
            {text: '工具', link: 'https://google.com'},
        ],
        sidebarDepth:5,
    })

})