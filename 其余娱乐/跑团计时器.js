// ==UserScript==
// @name         团外用时计时器
// @author       mu
// @version      0.1
// ==/UserScript==

let ext = seal.ext.find('rlog-timer');
if (!ext) {
    ext = seal.ext.new('rlog-timer', 'mu', '0.1');
    seal.ext.register(ext);
}

// 分钟转字符串
function minutesToZh(min) {
    let d = Math.floor(min / (60 * 24));
    min -= d * 60 * 24;
    let h = Math.floor(min / 60);
    min -= h * 60;
    return `${d}天 ${h}时 ${min}分`;
}

let cmd = seal.ext.newCmdItemInfo();
cmd.name = 'rlog';
cmd.help = `
.rlog new   新建存档（清零）
.rlog on    开始计时
.rlog off   暂停计时
.rlog end   输出本次总时间并清零
`;

cmd.solve = (ctx, msg, argv) => {
    let result = seal.ext.newCmdExecuteResult(true);

    let action = argv.getArgN(1);
    let baseKey = 'rlog/' + msg.groupId;
    let startKey = baseKey + '/start';
    let totalKey = baseKey + '/total';

    if (action == 'new') {
        ext.storageSet(startKey, '');
        ext.storageSet(totalKey, '0');
        seal.replyToSender(ctx, msg, `✅ 新建存档，时间已清零。`);
    }
    else if (action == 'on') {
        if (!ext.storageGet(startKey)) {
            ext.storageSet(startKey, String(Date.now()));
            seal.replyToSender(ctx, msg, `⏱ 开始计时！`);
        } else {
            seal.replyToSender(ctx, msg, `⚠️ 已经在计时中。`);
        }
    }
    else if (action == 'off') {
        let start = Number(ext.storageGet(startKey) || 0);
        if (start > 0) {
            let now = Date.now();
            let dur = Math.floor((now - start) / 60000); // 分钟
            let total = Number(ext.storageGet(totalKey) || 0) + dur;
            ext.storageSet(totalKey, String(total));
            ext.storageSet(startKey, '');
            seal.replyToSender(ctx, msg, `⏸ 暂停，本次增加 ${minutesToZh(dur)}\n累计：${minutesToZh(total)}`);
        } else {
            seal.replyToSender(ctx, msg, `⚠️ 没有正在计时。`);
        }
    }
    else if (action == 'end') {
        let start = Number(ext.storageGet(startKey) || 0);
        let total = Number(ext.storageGet(totalKey) || 0);

        if (start > 0) {
            let now = Date.now();
            let dur = Math.floor((now - start) / 60000);
            total += dur;
        }

        ext.storageSet(startKey, '');
        ext.storageSet(totalKey, '0');
        seal.replyToSender(ctx, msg, `📖 本次存档总计：${minutesToZh(total)}\n已清零。`);
    }
    else {
        seal.replyToSender(ctx, msg, '用法: .rlog new/on/off/end');
    }

    return result;
};

ext.cmdMap['rlog'] = cmd;