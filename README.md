# ScreepsDevSpace
Screeps World 的代码开发环境搭建，用于快速部署CodeSpace，用JetBrains 连接
# How To Use
三种运行模式
- 本地部署，JetBrains-Webstorm连接
- docker部署，JetBrains-Gateway SSH连接（待更新）
- GitHub CodeSpace部署（待更新）
## 本地部署
1. 本地环境准备
本地环境 node>=16 npm>=8 (以上版本为实际使用可行版本，不代表其他版本不可用，建议先测试一下)
2. 下载项目文件
```bash
git clone https://github.com/wper-golo/ScreepsDevSpace.git
```
3. 安装环境依赖
```bash
npm install
```
4. 申请Screep World Token
token 可以从 https://screeps.com/a/#!/account/auth-tokens 获取
![Alt text](image.png)
copyPath 可以通过游戏客户端控制台左下角的 Open local folder 按钮找到