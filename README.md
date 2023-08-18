# ScreepsDevSpace
Screeps World 的代码开发环境搭建
# Features Info
- 自动补全
- rollup一行命令打包上传
<img width="313" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/4ecd741b-74a2-4118-bf22-1ce891d6a589">


- ErrorMap跟踪报错
<img width="313" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/d28e8a3d-9862-4e78-8001-aed865b5a852">

- 支持ts开发

# How To Use
**三种运行模式**
- 本地部署，JetBrains-Webstorm连接 —— 功能稳定
- GitHub CodeSpace部署 —— 便捷的云端开发环境
- docker部署，JetBrains-Gateway SSH连接（待更新）


## 本地部署（稳定）

### 1. 本地环境准备

本地环境 `node>=16` `npm>=8` (以上版本为实际使用可行版本，不代表其他版本不可用，建议先测试一下)

### 2. 下载项目文件

```bash
git clone https://github.com/wper-golo/ScreepsDevSpace.git
```

### 3. 安装环境依赖

```bash
npm install
```
### 4. 申请Screeps World Token

token 可以从 https://screeps.com/a/#!/account/auth-tokens 获取
<img width="1324" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/c2a4a0a9-0126-475a-be93-b7ec3c9f56e6">

### 5. 修改 ./.secret.json 文件

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
注意需要填写里边的 `main.token` 字段和 `local.copyPath` 字段（如果你不想用这种方式的话可以直接不填) `copyPath` 可以通过游戏客户端控制台左下角的 `Open local folder` 按钮找到。

### 6. 在 ./src/ 文件夹下自由编写你Screeps Codes！

- 可以参考[大佬教程](https://www.jianshu.com/p/5431cb7f42d3)
- screeps world [中文文档](https://screeps-cn.github.io/index.html)
- screeps world [api 文档](https://screeps-cn.github.io/api/)

### 7. 将代码打包到本地（可选）
```bash
npm run local
```

### 8. push 你的代码到Screeps World

```bash
npm run push
```

## CodeSpace部署

### 1. Fork项目到本地

<img width="1461" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/88d3b41e-9309-49f8-8247-3d6f816de972">

### 2. 开启Github CodeSpace

<img width="1373" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/b9720698-9dd3-4e0a-959a-fa5889cbee10">

Tips：
- CodeSpace配置最好上 4Core 16RAM的配置，防止JB的Gateway连接不上，并选择一个区域（根据你访问github的ip地址选择ping延迟较小的节点）
- CodeSpace 使用完毕记得Stop，防止产生不必要的消费


### 3. JetBrains Gateway连接CodeSpace(可选)

<img width="800" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/7721325a-b54e-45b6-8581-3e093c2a095e">
Tips：
- JB GateWay连接记得开启自动保存功能，因为Gateway暂时是beta版，有可能会出现一些问题导致崩溃

### 4. 申请Screeps World Token

token 可以从 https://screeps.com/a/#!/account/auth-tokens 获取
<img width="1324" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/c2a4a0a9-0126-475a-be93-b7ec3c9f56e6">


### 5. 修改 ./.secret.json 文件

Tips：**请保护好自己的token，不要push到github上，造成一些不必要的麻烦**

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

注意需要填写里边的 `main.token` 字段和 `local.copyPath` 字段（如果你不想用这种方式的话可以直接不填) `copyPath` 可以通过游戏客户端控制台左下角的 `Open local folder` 按钮找到。

### 6. 在 ./src/ 文件夹下自由编写你Screeps Codes！

Tips: 如果想要保留errorMapper的功能，就不要修改./src/modules/errorMapper中的内容。
新手入门Screeps World：
- 可以参考[大佬教程](https://www.jianshu.com/p/5431cb7f42d3)
- screeps world [中文文档](https://screeps-cn.github.io/index.html)
- screeps world [api 文档](https://screeps-cn.github.io/api/)

### 7. push 你的代码到Screeps World

```bash
npm run push
```



# 一些声明
## 开发背景
本项目是本人通过对大佬[HoPGoldy](https://www.jianshu.com/u/3ee5572a4346)的简书教程进行的归纳整理，因为一些包版本等问题走了一些弯路，希望来玩Screeps World的玩家不要被开发环境不够优雅这种问题劝退，希望大家可以开心体验这款好玩的游戏。

## 参考教程
- https://www.jianshu.com/p/895f05016ff2

## ps：如果有帮助可以给个Star 🙏
<img width="53" alt="image" src="https://github.com/wper-golo/ScreepsDevSpace/assets/77011000/5fac4000-be39-4b4d-adda-8682d0e62816">
