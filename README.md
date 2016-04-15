# Black Jack （360作业）
## 实现

* 界面参考热门网游炉石传说。
* 扑克牌采用一张较大gif图，用雪碧图来拼接出52张牌，避免了用52张图，雪碧图拼接实例见testcard.html
* 单机部分没有使用各种框架、类库，js使用原生js 
* 界面可进入3个模块，电脑对战，双人对战和联机对战。
* js部分获取dom节点稍微为了兼容性没用queryselector
* 没有考虑移动端

#### 电脑对战模块
* 设置了电脑的对话框稍微增强用户体验
* 电脑会在你操作后自动操作要牌与否

#### 双人对战模块
* 因为在一张页面上进行游戏，就没有考虑底牌的遮挡

#### 双人联机对战
* 本地运行node server.js，可用两个浏览器模仿联机对战(自己用的chrome和firefox测试)
* 由于界面设置成双人对战，服务端也只支持双人对战
* 考虑实时效果，通信采用websockect技术
* 在接到任务看到要求后、第一次用尝试用node写后台，初学node，边学边写，考虑可能比较简单
* 用了一个别人写好的[soket.io.js](https://github.com/socketio/socket.io-client)的用于连接sokect.io
