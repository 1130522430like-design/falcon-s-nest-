// ==UserScript==
// @name         每日塔罗牌
// @author       灰色的隼
// @version      1.0.0
// @description  使用.抽一张塔罗牌,感谢Doubleem老师绘制的塔罗
// @timestamp    2025/12/31
// @license      
// ==/UserScript==

if (!seal.ext.find('daily_tarot')) {

    const ext = seal.ext.new('daily_tarot', 'DailyTarotBot', '1.0.1');

    const tarotCards = [
        { name: "愚者（The Fool）", upright: "新的开始、冒险、自由、潜力", reversed: "鲁莽、逃避责任、不切实际", cthulhu: "克苏鲁:“知其名者失其梦，见其影者忘其醒。”", img: "data/images/The Fool.jpg" },
        { name: "魔术师（The Magician）", upright: "创造力、行动力、掌控、资源整合", reversed: "欺骗、能力未能发挥、方向错误", cthulhu: "奈亚拉托提普:“混沌之乐，无拘无束，势不可挡,摄人心魂”", img: "data/images/The Magician.jpg" },
        { name: "女祭司（The High Priestess）", upright: "直觉、潜意识、隐藏的信息", reversed: "直觉受阻、秘密被忽视", cthulhu: "芭丝特:“她苗条而灵巧，穿着高雅，佩戴着华丽的珠宝……”", img: "data/images/The High Priestess.jpg" },
        { name: "皇后（The Empress）", upright: "丰饶、关怀、成长、生命力", reversed: "依赖、停滞、情感失衡", cthulhu: "莎布·尼古拉斯:“丰饶的守望者，孕育万千子嗣的森之黑山羊”", img: "data/images/The Empress.jpg" },
        { name: "皇帝（The Emperor）", upright: "权威、秩序、责任、掌控", reversed: "专制、失控、缺乏结构", cthulhu: "犹格索托斯:“万物归一者！天际为其行迹而撕裂。”", img: "data/images/The Emperor.jpg" },
        { name: "教皇（The Hierophant）", upright: "传统、信仰、指引、规范", reversed: "教条、束缚、盲从权威", cthulhu: "深谷住民:“当你凝望深渊时，深渊也在凝望你”", img: "data/images/The Hierophant.jpg" },
        { name: "恋人（The Lovers）", upright: "关系、选择、价值观契合", reversed: "矛盾、错误的选择、关系失衡", cthulhu: "伊斯，伟大种族:“他们将彼此相连，合而为一，再造伟大种族的荣光。”", img: "data/images/The Lovers.jpg" },
        { name: "战车（The Chariot）", upright: "意志、胜利、前进、掌控方向", reversed: "失控、方向错误、意志薄弱", cthulhu: "诺登斯:“时间之风拂其灰白须发，烈日之光照其苍老面容。”", img: "data/images/The Chariot.jpg" },
        { name: "力量（Strength）", upright: "勇气、耐心、温柔的力量", reversed: "软弱、自我怀疑、情绪失衡", cthulhu: "大衮:“凡沉入深处者，终将臣服于其缓慢而不可违逆的力量。”", img: "data/images/Strength.jpg" },
        { name: "隐者（The Hermit）", upright: "内省、寻求真理、独处", reversed: "孤立、逃避、拒绝指引", cthulhu: "伦道夫·卡特:“以凡人之躯，行非凡之事。”", img: "data/images/The Hermit.jpg" },
        { name: "命运之轮（Wheel of Fortune）", upright: "变化、命运、转折点", reversed: "停滞、逆流、抗拒变化", cthulhu: "霍华德·菲利普·洛夫克拉夫特:“所有的奇迹自此诞生，其名永垂不朽。”", img: "data/images/The Wheel of Fortune.jpg" },
        { name: "正义（Justice）", upright: "公平、因果、责任", reversed: "不公、逃避责任、偏见", cthulhu: "黑法老:“名属裁决之职，行使秩序之事”", img: "data/images/Justice.jpg" },
        { name: "倒吊人（The Hanged Man）", upright: "牺牲、等待、换个角度", reversed: "无谓牺牲、停滞不前", cthulhu: "夜魔:“炽燃红眼，夜幕倒悬”", img: "data/images/The Hanged Man.jpg" },
        { name: "死神（Death）", upright: "结束、转变、重生（非字面死亡）", reversed: "抗拒改变、停滞不前", cthulhu: "夸切乌陶斯:“当意志动摇，死亡便自行完成。”", img: "data/images/Death.jpg" },
        { name: "节制（Temperance）", upright: "平衡、协调、耐心", reversed: "失衡、极端、缺乏节制", cthulhu: "伊格，蛇之父:“偏爱绵延不绝，其余未入其目。”", img: "data/images/Temperance.jpg" },
        { name: "恶魔（The Devil）", upright: "欲望、束缚、执念", reversed: "解放、摆脱束缚、觉醒", cthulhu: "廷达罗斯猎犬:“越过应守之角度，锁链加注己身。”", img: "data/images/The Devil.jpg" },
        { name: "高塔（The Tower）", upright: "突变、崩塌、觉醒", reversed: "延迟的崩溃、拒绝改变", cthulhu: "三柱神碑:“你不会想知道那深暗领域后是什么的，那是超出我们认知的，不可名状之物……”", img: "data/images/The Tower.jpg" },
        { name: "星星（The Star）", upright: "希望、治愈、指引", reversed: "失望、信念动摇", cthulhu: "哈斯塔:“星光未曾熄灭，只是照向无人之处。”", img: "data/images/The Star.jpg" },
        { name: "月亮（The Moon）", upright: "迷茫、不安、潜意识", reversed: "真相浮现、恐惧消散", cthulhu: "黑湖之主:“休要踏入祂的领地……”", img: "data/images/The Moon.jpg" },
        { name: "太阳（The Sun）", upright: "喜悦、成功、光明", reversed: "短暂低落、被掩盖的快乐", cthulhu: "克图格亚:“火焰会燃尽一切，但也会净化一切。”", img: "data/images/The Sun.jpg" },
        { name: "审判（Judgement）", upright: "觉醒、复苏、重要抉择", reversed: "自我怀疑、拒绝召唤", cthulhu: "格赫罗斯：“无庭，无证，无辩。轨道即法， 坠落即判。”", img: "data/images/Judgement.jpg" },
        { name: "世界（The World）", upright: "完成、圆满、新阶段", reversed: "未竟之事、循环未完", cthulhu: "阿撒托斯:“万有之主于黑暗中低声喃喃，梦见自身亦无法理解之物；”", img: "data/images/The World.jpg" }
    ];


    function getToday() {
        const d = new Date();
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }

    function hashString(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h << 5) - h + str.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    }

    function drawTarot(userId) {
        const seed = userId + "-" + getToday();
        const hash = hashString(seed);
        return {
            card: tarotCards[hash % tarotCards.length],
            reversed: (hash % 2) === 1
        };
    }

    const cmd = seal.ext.newCmdItemInfo();
    cmd.name = '抽一张塔罗牌';
    cmd.help = '抽取今日固定的塔罗牌\n用法：.抽一张塔罗牌';

    cmd.solve = function (ctx, msg, cmdArgs) {
        const result = drawTarot(ctx.player.userId);
        const card = result.card;
        const pos = result.reversed ? '逆位' : '正位';
        const meaning = result.reversed ? card.reversed : card.upright;

        let reply = '';
        reply += '🔮 今日塔罗牌 🔮\n\n';
        reply += '【' + card.name + ' · ' + pos + '】\n\n';
        reply += '✨ 解读：\n';
        reply += meaning;
        reply += '（今日结果固定，重复抽取不会改变）';
        if (card.img && card.img !== '') {
            reply += '\n[CQ:image,file=' + card.img + ']';
        }
        reply += '\n📜 ' + card.cthulhu + '\n';


        seal.replyToSender(ctx, msg, reply);
    };

    ext.cmdMap['抽一张塔罗牌'] = cmd;
    seal.ext.register(ext);
}
