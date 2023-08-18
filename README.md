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
<img width="1324" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/c2a4a0a9-0126-475a-be93-b7ec3c9f56e6">
5. 修改 ./.secret.json 文件
```json
{
    "main": {
        "token": "你的 screeps token 填在这里",
        "protocol": "https",
        "hostname": "screeps.com",
        "port": 443,
        "path": "/",
        "branch": "default"
    },
    "local": {
        "copyPath": "你要上传到的游戏路径，例如 C:\\Users\\DELL\\AppData\\Local\\Screeps\\scripts\\screeps.com\\default"
    }
}
```
注意需要填写里边的 main.token 字段和 local.copyPath 字段（如果你不想用这种方式的话可以直接不填）   
copyPath 可以通过游戏客户端控制台左下角的 Open local folder 按钮找到
6. 在 ./src/ 文件夹下自由编写你Screeps Codes！
可以参考![大佬教程](https://www.jianshu.com/p/5431cb7f42d3)
7. push 你的代码到Screeps World
```bash
npm run push
```
