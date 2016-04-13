var firstGame = true;  //是否是第一局
var flag = true;  //阻止发牌重置等操作过快(每个动作等运动结束)
//记录双方卡牌信息
var record = {
    own: {
        valueArray: [],
        value: 0,
        posit: 0,
        bust: false
    },
    opponent: {
        valueArray: [],
        value: 0,
        posit: 0,
        bust: false
    }
};

/**
 * 菜单选项处理
 * */
function dealMenu(choice) {
    switch (choice) {
        case 'menu_1': {
            initVsComputer();
            return true
        }
            break;
        case 'menu_2': {
            initVsHuman();
            return true
        }
            break;
        case 'menu_3': {
            initVsMultiple();
            return true;
        }
            break;

    }
}

var getNew = new getNewCard();
/**
 * 定义卡牌类
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
 *  电脑对战初始化
 * */
function initVsComputer() {
    var photo = document.getElementsByClassName('eachPhoto');
    var choice = document.getElementsByClassName('choice');
    var ownarea = document.getElementsByClassName('own_card_are')[0];

    photo[0].style.display = 'block';
    photo[1].style.display = 'block';
    choice[0].style.display = 'inline-block';
    choice[1].style.display = 'inline-block';
    choice[6].style.display = 'inline-block';

    choice[0].addEventListener('click', function() {
        if(!flag) {
            return;
        }
        alphaGoSays();
        passCard(ownarea);
        alphaGoAction();
        judgeGame(true);

    }, false);
    choice[1].addEventListener('click', function() {
        if(!flag) {
            return;
        }
        alphaGoSays();

        alphaGoAction();
        choice[0].disabled = true;
        choice[1].disabled = true;
        judgeGame();

    }, false);

    choice[6].addEventListener('click', function() {
        freshGame();
    }, false);

}

/**
 *  双人对战初始化
 * */
function initVsHuman() {
    var choice = document.getElementsByClassName('choice');
    var photoarea = document.getElementsByClassName('eachPhoto');
    var photo = document.getElementsByClassName('photo');
    var oppositeName = document.getElementById('oppositeName');
    var ownName = document.getElementById('ownName');
    var AlphaGoSay = document.getElementsByClassName('AlphaGoSay');

    photoarea[0].style.display = 'block';
    photoarea[1].style.display = 'block';
    AlphaGoSay[0].style.display = 'none';
    oppositeName.innerHTML = '玩家2';
    ownName.innerHTML = '玩家1';
    photo[0].src = 'img/me.png';

    var len = choice.length;
    for(var i = 2; i < len; i++) {
        choice[i].style.display = 'inline-block';
        choice[i].style.marginLeft = '30px';
    }

    var ownarea = document.getElementsByClassName('own_card_are')[0];
    var opparea = document.getElementsByClassName('opponent_card_are')[0];

    //玩家1要牌
    choice[2].addEventListener('click', function() {
        if(!flag) {
            return;
        }
        passCard(ownarea);
        judgeGame(true, true);
        choice[2].disabled = true;

        //如果玩家2没按不要牌,则轮到玩家2操作
        if(choice[5].disabled == false) {
            choice[4].disabled = false;
        }


    }, false);

    //玩家1确定不要牌了
    choice[3].addEventListener('click', function() {
        choice[2].disabled = true;
        choice[3].disabled = true;
        judgeGame(false, true);
        if(choice[5].disabled == false) {
            choice[4].disabled = false;
        }

    }, false);

    //玩家2要牌
    choice[4].addEventListener('click', function() {
        if(!flag) {
            return;
        }
        passCard(opparea, true);
        judgeGame(true, true);
        choice[4].disabled = true;

        //如果玩家1没按不要牌,则轮到玩家1操作
        if(choice[3].disabled == false) {
            choice[2].disabled = false;
        }

    }, false);

    //玩家2确定不要牌了
    choice[5].addEventListener('click', function() {
        choice[4].disabled = true;
        choice[5].disabled = true;
        judgeGame(false, true);
        if(choice[3].disabled == false) {
            choice[2].disabled = false;
        }
    }, false);

    choice[6].addEventListener('click', function() {
        freshGame(true);
    }, false);

}




/**
 * 联机对战初始化
 * */
function initVsMultiple() {
    var choice = document.getElementsByClassName('choice');
    var login = document.getElementById('login');
    var input = document.getElementById('input_name');
    var photoarea = document.getElementsByClassName('eachPhoto');
    var btn = document.getElementById('input_btn');
    var opposiName = document.getElementById('oppositeName');
    var ownnName = document.getElementById('ownName');
    var photo = document.getElementsByClassName('photo');
    var AlphaGoSay = document.getElementsByClassName('AlphaGoSay');
    var ownarea = document.getElementsByClassName('own_card_are')[0];
    var opparea = document.getElementsByClassName('opponent_card_are')[0];
    var package_num = document.getElementsByClassName('package_num')[0];

    choice[6].disabled = true;
    var id = Math.round(Math.random() * 1000);
    var socket;
    //定义player类
    var player = {
        username:null,
        userid:null,
        socket:null,
        init:function(username){
            this.userid = id;
            this.username = username;
            this.socket = socket;

            //告诉服务器端有用户登录
            this.socket.emit('login', {userid:this.userid,username:this.username});

            this.socket.on('checkOnline', function(o) {
                //这里暂时只有一个对手在线,所以for in只能遍历出一个
                for(var i  in o) {
                    opposiName.innerHTML = o[i];
                    photoarea[0].style.display = 'block';
                    AlphaGoSay[0].style.display = 'none';
                    photo[0].src = 'img/me.png';
                    //双方就绪,可以开始游戏
                    choice[6].disabled = false;
                }

            });
            //监听对手登录
            this.socket.on('login', function(o){
                console.log('用户连接成功');
                console.log(o.user + '  ' +player.username);
                if(o.user !== player.username) {
                    opposiName.innerHTML = o.user;
                    photoarea[0].style.display = 'block';
                    AlphaGoSay[0].style.display = 'none';
                    photo[0].src = 'img/me.png';
                    //双方就绪,可以开始游戏
                    choice[6].disabled = false;

                }
            });
            //监听服务器是否满员
            this.socket.on('enough', function(o){
                alert(o);
            });
           //监听用户退出
            this.socket.on('logout', function(o){
                photoarea[0].style.display = 'none';
                choice[6].disabled = true;
                alert('你的对手离开了游戏');
                ownarea.innerHTML = '';
                opparea.innerHTML = '';

            });

            //监听消息发送
            this.socket.on('message', function(obj){

            });

            this.startGame = function() {
                this.socket.emit('startGame');

            };
            this.socket.on('startGame', function(o) {
                freshGame(false, true);
                //将服务器获取到的卡牌分配到自己或对面的卡牌区域
                for(var i in o) {
                    if(player.username == i) {
                        passCard(ownarea, false, o[i][0]);
                        passCard(ownarea, false, o[i][1]);
                    }
                    else {
                        passCard(opparea, true, o[i][0]);
                        passCard(opparea, true, o[i][1]);

                    }
                }
                package_num.innerHTML = '48';
            });
            this.moreCard = function() {
                this.socket.emit('moreCard', {name: player.username});
            };
            this.socket.on('moreCard', function(o) {
                if(o.username == player.username) {
                    passCard(ownarea, false, o.value);
                }
                else {
                    passCard(opparea, true, o.value);
                }
                package_num.innerHTML = o.length.toString();
                judgeGame(true, false, true);

            });
            this.nomoreCard = function() {
                this.socket.emit('nomoreCard');
            };
            this.socket.on('nomoreCard', function(flag) {
                //双方已点击确定不要牌按钮
                if(flag == true) {
                    judgeGame(false, false, true);
                }
            });

        }
    };
    login.style.display = 'block';
    choice[0].style.display = 'inline-block';
    choice[1].style.display = 'inline-block';
    choice[6].style.display = 'inline-block';

    //绑定按钮事件
    choice[6].addEventListener('click', function() {
        if(!flag) {
            return;
        }
        player.startGame();
    }, false);


    choice[0].addEventListener('click', function() {
        if(!flag) {
            return;
        }
        player.moreCard();
    }, false);

    choice[1].addEventListener('click', function() {
        choice[0].disabled = true;
        choice[1].disabled = true;
        player.nomoreCard();
    }, false);

    btn.addEventListener('click', function() {
        socket = io.connect('http://localhost:3000');
        var name = input.value;
        photoarea[1].style.display = 'block';
        ownnName.innerHTML = name;
        player.init(name);
        login.style.display = 'none';
    });

}



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




/**
 * 重置游戏
 * @double 表示重置双人对战
 * @multiple 表示重置联机对战
 * */
function freshGame(double, multiple) {
    if(!flag) {
        return;
    }
    var ownarea = document.getElementsByClassName('own_card_are')[0];
    var opposite = document.getElementsByClassName('opponent_card_are')[0];
    var btn = document.getElementsByClassName('choice');
    var game_result = document.getElementById('game_result');
    var len = btn.length;
    for(var i = 0; i < len-1; i++) {
        btn[i].disabled = false;
    }

    game_result.innerHTML = '';
    ownarea.innerHTML = '';
    if(double) {
        opposite.innerHTML = '';

    }
    else {
        opposite.innerHTML = '<div id="card_cover"></div>';
        moveCover();
    }
    record.opponent.posit = 0;
    record.opponent.value = 0;
    record.opponent.bust = false;
    record.opponent.valueArray = [];
    record.own.posit = 0;
    record.own.value = 0;
    record.own.bust = false;
    record.own.valueArray = [];
    //单机对战则直接发牌
    if(!multiple) {
        getNew.refreshCard();
        passCard(ownarea);
        passCard(opposite, true);
        passCard(ownarea);
        passCard(opposite, true);
    }

    if(firstGame) {
        btn[6].setAttribute('value', '重新开始');
        firstGame = false;
    }
    //显示并移动对方遮卡卡背
    function moveCover() {

        var cardCover = document.getElementById('card_cover');
        cardCover.style.display = 'block';
        move(cardCover, {'left': 0, 'top': 76});
    }
}

listeners();

/**
 * 监听器
 * */
function listeners() {
    var menu = document.getElementsByClassName('menu')[0];
    menu.addEventListener('click', function(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        if(target.className == 'menuList') {
            if(dealMenu(target.id)) {
                menu.style.display = 'none';
            }

        }
        else if(target.nodeName.toLowerCase() == 'span') {
            if(dealMenu(target.parentNode.id)) {
                menu.style.display = 'none';
            }
        }
    }, false);

}
/**
 * 发一张牌的动作
 * @oppsite 表示发牌区域为对面
 * @mutipleCard  是否联机对战,是就用从服务器得到的卡牌,否则用本地的卡牌
 * */
function passCard(obj, oppsite, mutipleCard) {
    var acard;
    if(mutipleCard) {
        acard = mutipleCard;
    }
    else {
        acard = getNew.getcard();
    }
    var cardDom = buildCardDom(acard);
    if(oppsite) {
        cardMove(obj, cardDom, true);
        dealValue(acard, true);
        checkValue(true);
    }
    else {
        cardMove(obj, cardDom);
        dealValue(acard);
        checkValue();
    }
    console.log('对面:  ' + record.opponent.value);
    console.log('我:  ' + record.own.value);


}

/**
 * 新卡牌移动
 * */
function cardMove(dom, str, opponent) {
    var div = document.createElement('div');
    var package_num = document.getElementsByClassName('package_num')[0];
    package_num.innerHTML = getNew.getLength();
    div.className = 'cardBox';
    div.innerHTML = str;
    dom.appendChild(div);
    if(opponent) {
        div.style.top = '128px';
        move(div, {'left': record.opponent.posit, top:'78'});
        record.opponent.posit += 150;
    }
    else {
        move(div, {'left': record.own.posit, top: '10'});
        record.own.posit += 150;
    }

}
/**
 * 检查是否bust  检查是否爆牌
 * */
function checkValue(opponent) {
    var btn = document.getElementsByClassName('choice');
    if(opponent) {
        if(record.opponent.value > 21) {
            console.log('对手爆炸');
            record.opponent.bust = true;
            btn[0].disabled = true;
            btn[1].disabled = true;
        }
    }
    else {
        if(record.own.value > 21) {
            record.own.bust = true;
            btn[0].disabled = true;
            btn[1].disabled = true;
        }
    }
}



/**
 * 统计牌的点数
 * */
function dealValue(value, opponent) {
    var numExce = /(\d+$)|(\w$)/i;
    var match = value.match(numExce)[0];

    if(opponent) {
        record.opponent.value += getValue();
        record.opponent.valueArray.push(getValue());
    }
    else {
        record.own.value += getValue();
        record.own.valueArray.push(getValue());

    }
    function getValue() {
        var result;

        if(match == 'A') {
            result = 1;
        }
        else if(match == 'j' || match == 'q' || match == 'k') {
            result = 10;
        }
        else {
            result = parseInt(match);
        }
        return result;
    }

}

/**
 * AlphaGo的操作和判断
 * */
function alphaGoAction() {
    var oppoarea = document.getElementsByClassName('opponent_card_are')[0];
    var nowValue = record.opponent.value;
    var arr = record.own.valueArray;
    var len = arr.length;
    var total = 0;
    //这里阿法狗只知道你的第一张以后的点数哈,毕竟阿法狗也要讲究公平
    for(var i = 1; i < len; i++) {
        total += arr[i];
    }
    if(nowValue == 21) {
        return;
    }
    console.log('阿法狗知道你现在场面上的牌点数和至少为: ' + total +'!!!');
    if((nowValue < 17 || nowValue <= total) ) {
        //如果你爆牌了,阿法狗当然不要牌了
        if(record.own.bust) {
            return;
        }
        passCard(oppoarea, true);
    }

}
/**
 * AlphaGo Says 阿法狗的随机对话,你胜利的赞扬和失败的嘲讽
 * */
function alphaGoSays(finish, win) {
    //阿法狗对话
    var says = ['我知道你的底牌~', '很荣幸见到你', '你猜我怎么赢李世石的', '你是不可能赢我的!', '你好', '抱歉~', '打得不错~'];
    var span = document.getElementsByClassName('AlphaGoSay')[0].getElementsByTagName('span')[0];
    var num = Math.round(Math.random() * 4);
    if(finish) {
        if(win) {
            num = 6;
        }
        else {
            num = 5;
        }
    }
    span.innerHTML = says[num];
}



/**
 * 判断输赢
 * @morecard 表示现在动作为请求更多卡,只判断是否爆牌
 * @double 表示现在是双人对战,在要牌时爆牌或者双方都按下不要牌时的判断
 * @mutiple 双人联机对战,用于跳过阿法狗说话操作
 * */
function judgeGame(morecard, double, mutiple) {
    var cardcover = document.getElementById('card_cover');
    var gameresult = document.getElementById('game_result');
    var choice = document.getElementsByClassName('choice');
    var result = record.opponent.value - record.own.value;
    if(double) {
        if(record.opponent.bust == true) {
            gameresult.innerHTML = '玩家1胜利';
            choice[2].disabled = true;
            choice[3].disabled = true;
            choice[4].disabled = true;
            choice[5].disabled = true;
        }
        else if(record.own.bust == true) {
            gameresult.innerHTML = '玩家2胜利';
            choice[2].disabled = true;
            choice[3].disabled = true;
            choice[4].disabled = true;
            choice[5].disabled = true;
        }
        if(!morecard) {
            if(choice[3].disabled == true && choice[5].disabled == true) {
                if(record.opponent.bust == false && record.own.bust == false) {
                    if (result > 0) {
                        gameresult.innerHTML = '玩家2胜利';
                    }
                    else if (result == 0) {
                        gameresult.innerHTML = '平局';
                    }
                    else {
                        gameresult.innerHTML = '玩家1胜利';
                    }
                    choice[2].disabled = true;
                    choice[4].disabled = true;
                }
            }
        }
    }
    else if(record.opponent.bust == true) {
        if(!mutiple) {
            alphaGoSays(true, true);
        }
        cardcover.style.display = 'none';
        gameresult.innerHTML = '你赢了';
    }
    else if(record.own.bust == true) {
        if(!mutiple) {
            alphaGoSays(true, false);
        }
        cardcover.style.display = 'none';
        gameresult.innerHTML = '你输了';
    }
    else if(!morecard) {
        if(record.opponent.bust == false && record.own.bust == false) {
            if (result > 0) {
                if(!mutiple) {
                    alphaGoSays(true, false);
                }
                cardcover.style.display = 'none';
                gameresult.innerHTML = '你输了';
            }
            else if (result == 0) {
                if(!mutiple) {
                    alphaGoSays(true, true);
                }
                cardcover.style.display = 'none';
                gameresult.innerHTML = '平局';
            }
            else {
                if(!mutiple) {
                    alphaGoSays(true, true);
                }
                cardcover.style.display = 'none';
                gameresult.innerHTML = '你赢了';
            }
        }
    }



}

/**
 * 创建卡牌dom节点(根据不同数字花色拼dom节点)
 * */
function buildCardDom(value) {
    var stylorExce = /^n\d(?=_)/i;
    var numExce = /(\d+$)|(\w$)/i;
    var stylor = value.match(stylorExce)[0];
    var num = value.match(numExce)[0];

    var color, str_in, left_top, right_down;

    //n1表示黑桃 n2表示红桃 n3表示梅花 n4表示钢板
    switch (stylor) {
        case 'n1': color = 1; break;
        case 'n2': color = 2; break;
        case 'n3': color = 3; break;
        case 'n4': color = 4; break;
    }
    //根据几点来创建雪碧图中间花色显示节点
    switch (num) {
        case 'A': {
            str_in = '<span class="B3 up'+color+'"></span>';
            left_top = 'nA';
            right_down = 'nA_h';
        }
            break;
        case '2': {
            str_in = '<span class="B1 up'+color+'"></span><span class="B2 down'+color+'"></span>';
            left_top = 'n2';
            right_down = 'n2_h';
        }
            break;
        case '3': {
            str_in = '<span class="B1 up'+color+'"></span><span class="B2 down'+color+'"></span><span class="B3 up'+color+'"></span>';
            left_top = 'n3';
            right_down = 'n3_h';
        }
            break;
        case '4': {
            str_in = '<span class="A1 up'+color+'"></span><span class="A4 down'+color+'"></span>'+
                '<span class="C1 up'+color+'"></span><span class="C4 down'+color+'"></span>';
            left_top = 'n4';
            right_down = 'n4_h';
        }
            break;
        case '5': {
            str_in = '<span class="A1 up'+color+'"></span><span class="A4 down'+color+'"></span>'+
                '<span class="B3 up'+color+'"></span><span class="C1 up'+color+'">'+
                '</span><span class="C4 down'+color+'"></span>';
            left_top = 'n5';
            right_down = 'n5_h';
        }
            break;
        case '6': {
            str_in = '<span class="A1 up'+color+'"></span><span class="A4 down'+color+'"></span><span class="A5 up'+color+'"></span>'+
                '<span class="C1 up'+color+'"></span><span class="C4 down'+color+'"></span><span class="C5 up'+color+'"></span>';
            left_top = 'n6';
            right_down = 'n6_h';
        }
            break;
        case '7': {
            str_in = '<span class="A1 up'+color+'"></span><span class="A4 down'+color+'"></span>'+
                '<span class="A5 up'+color+'"></span><span class="B3 up'+color+'"></span><span class="C1 up'+color+'"></span>'+
                '<span class="C4 down'+color+'"></span><span class="C5 up'+color+'"></span>';
            left_top = 'n7';
            right_down = 'n7_h';
        }
            break;
        case '8': {
            str_in = '<span class="A1 up'+color+'"></span><span class="A4 down'+color+'"></span><span class="A5 up'+color+'"></span>'+
                '<span class="B1 up'+color+'"></span><span class="B2 down'+color+'"></span><span class="C1 up'+color+'"></span>'+
                '<span class="C4 down'+color+'"></span><span class="C5 up'+color+'"></span>';
            left_top = 'n8';
            right_down = 'n8_h';
        }
            break;
        case '9': {
            str_in = '<span class="A1 up'+color+'"></span><span class="A2 up'+color+'"></span>'+
                '<span class="A3 down'+color+'"></span><span class="A4 down'+color+'"></span>'+
                '<span class="B3 up'+color+'"></span><span class="C1 up'+color+'"></span>'+
                '<span class="C2 up'+color+'"></span><span class="C3 down'+color+'"></span>'+
                '<span class="C4 down'+color+'"></span>';
            left_top = 'n9';
            right_down = 'n9_h';
        }
            break;
        case '10': {
            str_in = '<span class="A1 up'+color+'"></span><span class="A2 up'+color+'"></span>'+
                '<span class="A3 down'+color+'"></span><span class="A4 down'+color+'"></span>'+
                '<span class="B1 up'+color+'"></span><span class="B2 down'+color+'"></span>'+
                '<span class="C1 up'+color+'"></span><span class="C2 up'+color+'"></span>'+
                '<span class="C3 down'+color+'"></span><span class="C4 down'+color+'"></span>';
            left_top = 'n10';
            right_down = 'n10_h';
        }
            break;
        case 'j': {
            str_in = '<div class="jack_j"></div>';
            left_top = 'nj';
            right_down = 'nj_h';
        }
            break;
        case 'q': {
            str_in = '<div class="jack_q"></div>';
            left_top = 'nq';
            right_down = 'nq_h';
        }
            break;
        case 'k': {
            str_in = '<div class="jack_k"></div>';
            left_top = 'nk';
            right_down = 'nk_h';
        }
            break;


    }
    if(stylor == 'n2' || stylor == 'n4') {
        left_top += '_red';
        right_down += '_red';
    }
    var str_main = '<div class="card">'+
        '<div class="front">'+
        '<b class="N1 '+left_top+'"></b>'+
        '<em class="First small_up'+color+'"></em>'+ str_in +
        '<em class="Last small_down'+color+'"></em>'+
        '<b class="N2 '+right_down+'"></b>'+
        '</div>'+
        '</div>';

    return str_main;
}


/**
 * 移动函数
 * obj为所移动的元素
 * attrs为移动元素属性的目标属性的json集合 例如 { 'left': '200px', 'top': '300px'}
 * */
function move(obj, attrs, callback) {
    //获取当前属性样式
    function getCss(obj, attr) {
        return obj.currentStyle? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, null)[attr];
    }
    if(flag) {
        var timer = setInterval(function() {
            var finished = true;  //假设现在完成了
            flag = false;
            for(var attr in attrs) {
                var curStyle = parseFloat(getCss(obj, attr));
                var purStyle = parseFloat(attrs[attr]);
                if(curStyle != purStyle) {
                    finished = false;  //还未完成
                    var val = ((purStyle-curStyle) * 30)/100,   //20为速率
                        val = val>0 ? Math.ceil(val) : Math.floor(val);
                    obj.style[attr] = val ? (curStyle+val+'px') : (purStyle+'px');
                }

                if(finished) {
                    clearInterval(timer);
                    flag = true;
                    callback && callback();
                }
            }
        }, 30);

    }

}

