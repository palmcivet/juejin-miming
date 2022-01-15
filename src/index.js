// ==UserScript==
// @name         掘金挖矿脚本
// @namespace    https://github.com/palmcivet
// @version      0.0.1
// @description  参考自：https://juejin.cn/post/7047688281693585415
// @author       Palm Civet
// @match        https://juejin.cn/game/haidijuejin/*
// @icon         https://juejin.cn/game/haidijuejin/favicon.8a39f.ico
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const CLASS_NAME = "juejin-miming";
  const API_USER = "https://api.juejin.cn/user_api/v1/user/get";
  const API_GAME_COMMAND = "https://juejin-game.bytedance.com/game/sea-gold/game/command";

  /* 获取 UID */
  async function getUid() {
    try {
      const result = await fetch(API_USER, {
        credentials: "include",
      });
      const data = await result.json();
      // 更新时间：2022-01-17
      return data.profile_id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 执行函数，commandStep 为执行模式：
   * - 0:开局往左
   * - 1:开局往右
   * - 2:中期
   * - 3:后期飞翔
   * - 4:后期扫荡
   * @param {string} param.uid 你的 uid
   * @param {string} param.authorization request header 中的 authorization
   * @param {string} param.gameid request header 中的 x-tt-gameid
   * @param {number} param.commandStep 0-4
   * @returns 执行接口的返回值
   */
  async function gameCommand({
    uid = "",
    authorization = "",
    gameid = "",
    commandStep = 0,
  }) {
    const commandArr = [
      // 开局往左
      [{ times: 2, command: ["2", "L", "D", "L", "4", "D", "6", "R", "D", "R"] }],
      // 开局往右
      [{ times: 2, command: ["2", "R", "D", "R", "6", "D", "4", "L", "D", "L"] }],
      // 中期
      [
        {
          times: 10,
          command: [
            {
              times: 2,
              command: ["D", "2", "L", "D", "L", "4", "D", "6", "U", "L", "D", "R"],
            },
            "L",
            "D",
          ],
        },
        { times: 2, command: ["U", "U", "8", "R"] },
        {
          times: 10,
          command: [
            {
              times: 2,
              command: ["D", "2", "R", "D", "R", "6", "D", "4", "U", "R", "D", "L"],
            },
            "R",
            "D",
          ],
        },
        { times: 2, command: ["U", "U", "8", "L"] },
      ],
      // 后期：万米飞翔
      [
        {
          times: 10,
          command: [
            {
              times: 2,
              command: ["D", "2", "L", "D", "L", "4", "D", "6", "U", "L", "D", "R"],
            },
            "L",
            "D",
          ],
        },
        { times: 2, command: ["U", "U", "8", "R"] },
        {
          times: 10,
          command: [
            {
              times: 2,
              command: ["D", "2", "R", "D", "R", "6", "D", "4", "U", "R", "D", "L"],
            },
            "R",
            "D",
          ],
        },
        { times: 2, command: ["U", "U", "8", "L"] },
      ],
      // 后期：无情扫荡
      [
        {
          times: 10,
          command: [
            "L",
            "L",
            "L",
            "4",
            "L",
            "L",
            "L",
            "4",
            "D",
            "R",
            "R",
            "R",
            "6",
            "R",
            "R",
            "R",
            "6",
          ],
        },
        { times: 3, command: ["U", "U", "L", "L", "8", "4"] },
        {
          times: 6,
          command: ["D", "2", "L", "D", "L", "4", "D", "6", "U", "L", "D", "R"],
        },
        "L",
        "D",
        {
          times: 10,
          command: [
            "R",
            "R",
            "R",
            "6",
            "R",
            "R",
            "R",
            "6",
            "D",
            "L",
            "L",
            "L",
            "4",
            "L",
            "L",
            "L",
            "4",
          ],
        },
        { times: 3, command: ["U", "U", "R", "R", "8", "6"] },
        {
          times: 6,
          command: ["D", "2", "R", "D", "R", "6", "D", "4", "U", "R", "D", "L"],
        },
        "R",
        "D",
      ],
    ];
    const coreCode = commandArr[commandStep];
    const loop = commandStep <= 1 ? 2 : 4;
    const params = { command: [] };
    let _params = params;
    for (let i = 0; i < loop; i++) {
      _params["command"].push({ times: 10, command: [] });
      _params = _params.command[0];
      if (i >= loop - 1) {
        _params.command.push(...coreCode);
      }
    }
    _params = null;

    const datarus = await fetch(
      `${API_GAME_COMMAND}?uid=${uid}&${(time = Date.parse(new Date()))}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorization": authorization,
          "accept": "application/json, text/plain, */*",
          "content-length": JSON.stringify(params).length,
          "x-tt-gameid": gameid,
        },
        body: JSON.stringify(params),
      }
    );

    return datarus.json();
  }

  /* 迈出第一步，同时获取信息 */
  async function firstCommand() {}

  /* 注入 CSS */
  function injectStyle() {
    const styleDOM = document.createElement("style");
    styleDOM.id = "${CLASS_NAME}-style";
    styleDOM.innerHTML = ``;
    document.head.append(styleDOM);
  }

  /* 注入控件 */
  function injectControls() {
    const container = document.createElement("div");
    container.className = `${CLASS_NAME}-container`;
    container.innerHTML = `
<div class="${CLASS_NAME}-info">
    <input class="${CLASS_NAME}-uid" type="text" placeholder="uid" />
    <input class="${CLASS_NAME}-authorization" type="text" placeholder="authorization" />
    <input class="${CLASS_NAME}-gameid" type="text" placeholder="gameid" />
</div>
<form class="${CLASS_NAME}-cmd">
    <div>
        <input type="radio" name="命令" id="${CLASS_NAME}-cmd-0" value="0" />
        <label for="${CLASS_NAME}-cmd-0">0：开局往左</label>
    </div>
    <div>
        <input type="radio" name="命令" id="${CLASS_NAME}-cmd-1" value="1" />
        <label for="${CLASS_NAME}-cmd-1">1：开局往右</label>
    </div>
    <div>
        <input type="radio" name="命令" id="${CLASS_NAME}-cmd-2" value="2" />
        <label for="${CLASS_NAME}-cmd-2">2：中期</label>
    </div>
    <div>
        <input type="radio" name="命令" id="${CLASS_NAME}-cmd-3" value="3" />
        <label for="${CLASS_NAME}-cmd-3">3：后期飞翔</label>
    </div>
    <div>
        <input type="radio" name="命令" id="${CLASS_NAME}-cmd-4" value="4" />
        <label for="${CLASS_NAME}-cmd-4">4：后期扫荡</label>
    </div>

    <button type="submit" class="${CLASS_NAME}-btn">执行</button>
</form>
<div class="${CLASS_NAME}-result"></div>
`;

    const btn = container.children.item(1);
    btn.onclick = () => {
      gameCommand({
        uid: document.querySelector(`.${CLASS_NAME}-uid`).value,
        authorization: document.querySelector(`.${CLASS_NAME}-authorization`).value,
        gameid: document.querySelector(`.${CLASS_NAME}-gameid`).value,
      });
    };

    const root = document.querySelector("#Cocos2dGameContainer");
    root.appendChild(container);
  }

  setTimeout(injectStyle);
  setTimeout(injectControls, 10000);
})();
