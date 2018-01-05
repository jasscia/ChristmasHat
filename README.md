# 我要圣诞帽
采用微信小程序编写       实现了为图片带帽子的功能<br>
## 程序结构如下
* image (在此放置所有圣诞帽的素材)
* pages (包含了index imageeditor combine文件夹，每个文件夹中都有四个文件，后缀名分别为 .js .json .wxss .wxml)
  * index (第一步：选择底图，程序设计三个底图来源 即微信头像、相机、相册)
  * imageeditor(第二步：实现选择圣诞帽  并通过移动和旋转调整圣诞帽的大小和位置)
  * combine(第三步：将底图和调整后的圣诞帽合成新的图片 并保存至微信相册)
* utils 暂时没有用的
* app.js
* app.json
* app.wxss
* project.config.json
## 过程展示
##### step 1
![step1]https://github.com/jasscia/ChristmasHat/raw/master/shortcut/avatar.jpg
