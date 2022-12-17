@echo on
:: 调用npm生成静态文件
call npm run docs:build
:: 进入dist目录提交
cd docs\.vuepress\dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:Steven-hsm/java-guide-blog.git master:gh-pages
