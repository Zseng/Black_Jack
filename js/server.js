var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
//保存发牌信息
var cardInfo = {};

var enoughFlag = 0;  //保存确认不要牌的开关
/**
 * 定义服务器卡牌类
 * */
function Cards() {
    //保存除大小王外的52张扑克牌 n1表示黑桃 n2表示红桃 n3表示梅花 n4表示钢板
    var cards = ['n1_A', 'n1_2', 'n1_3', 'n1_4', 'n1_5', 'n1_6', 'n1_7', 'n1_8', 'n1_9',
        'n1_10', 'n1_j', 'n1_q', 'n1_k', 'n2_A', 'n2_2', 'n2_3', 'n2_4', 'n2_5', 'n2_6',
        'n2_7', 'n2_8', 'n2_9', 'n2_10', 'n2_j', 'n2_q', 'n2_k', 'n3_A', 'n3_2', 'n3_3',
        'n3_4', 'n3_5', 'n3_6', 'n3_7', 'n3_8', 'n3_9', 'n3_10', 'n3_j', 'n3_q', 'n3_k',
        'n4_A', 'n4_2', 'n4_3', 'n4_4', 'n4_5', 'n4_6', 'n4_7', 'n4_8', 'n4_9', 'n4_10',
        'n4_j', 'n4_q', 'n4_k'];

    return {
        //洗牌
        shuffleCards: function() {
            cards.sort(function() {
                return Math.random() > 0.5? 1 : -1;
            });
        },
        //发一张牌
        shiftCards: function() {
            return cards.shift();
        },
        //剩下的牌
        getLength: function() {
            return cards.length;
        }
    }
};


/**
 * 获取一组新牌
 * */
function getNewCard() {
    var newcards = new Cards();
    newcards.shuffleCards();

    return {
        getcard: function() {
            return newcards.shiftCards();
        },
        refreshCard: function() {
            newcards = new Cards();
            newcards.shuffleCards();
        },
        getLength: function() {
            return newcards.getLength();
        }
    }
};

var getNew = new getNewCard();



io.on('connection', function(socket){


    //监听新用户加入
    socket.on('login', function(obj){
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = obj.userid;

        //查看是否满员
        if(onlineCount >= 2) {
            io.emit('enough', '已满员,目前服务器只能2人联机对战');
            return;
        }
        //查看已在线玩家
        if(onlineCount != 0) {
            io.emit('checkOnline', onlineUsers);
        }

        //检查在线列表，如果不在里面就加入
        if(!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //在线人数+1
            onlineCount++;
        }
        //向所有客户端广播用户加入
        io.emit('login', {user:obj.username});
        console.log(obj.username+'加入了对战');
    });

    //监听用户退出
    socket.on('disconnect', function(){
        //将退出的用户从在线列表中删除
        if(onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            var obj = {userid:socket.name, username:onlineUsers[socket.name]};

            //删除用户
            delete onlineUsers[socket.name];
            //重置发卡牌信息
            cardInfo = {};
            enoughFlag = 0;

            //在线人数-1
            onlineCount--;
            //向所有客户端广播用户退出
            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            console.log(obj.username+'退出了游戏');
        }
    });

    socket.on('startGame', function() {
        //开始游戏洗牌
        getNew.refreshCard();
        //重置发卡牌信息
        cardInfo = {};
        enoughFlag = 0;
        for(var user in onlineUsers) {
            cardInfo[onlineUsers[user]] = [];
            for(var i = 0; i < 2; i++) {
                var acard = getNew.getcard();
                cardInfo[onlineUsers[user]].push(acard);
            }
        }
        io.emit('startGame', cardInfo);
        console.log('开始游戏,发牌!!');
    });

    socket.on('moreCard', function(obj) {
       var acard = getNew.getcard();
        //广播要牌人名和所发的牌
        io.emit('moreCard', {username: obj.name, value: acard, length:getNew.getLength()});
        cardInfo[obj.name].push(acard);
    });

    socket.on('nomoreCard', function() {
        enoughFlag++;
        if(enoughFlag >=2) {
            io.emit('nomoreCard', true);
        }
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});