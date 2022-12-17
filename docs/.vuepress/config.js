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
            {text: 'java基础', children:['www.baidu.com','www.baidu.com']},
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
        sidebarDepth:4
    })

})