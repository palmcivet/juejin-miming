(function () {
  "use strict";

  const CLASS_NAME = "juejin-miming";
  const API_USER = "https://api.juejin.cn/user_api/v1/user/get";
  const API_GAME_BASE = "https://juejin-game.bytedance.com/game/sea-gold";
  const API_GAME_COMMAND = `${API_GAME_BASE}/game/command`;
  const API_GAME_START = `${API_GAME_BASE}/game/start`; // { roleId: 1 }
  const API_GAME_OVER = `${API_GAME_BASE}/game/over`; // { isButton: 1 }
  const API_GAME_INFO = `${API_GAME_BASE}/game/info`;

  /* 获取用户信息 */
  async function getUserInfo() {
    try {
      const result = await fetch(API_USER, {
        credentials: "include",
      });
      const data = await result.json();
      return data.data;
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
   * @param {string} param.gameId request header 中的 x-tt-gameid
   * @param {number} param.commandStep 0-4
   * @returns 执行接口的返回值
   */
  async function gameCommand({ uid = "", authorization = "", gameId = "", commandStep = 0 }) {
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
      `${API_GAME_COMMAND}?uid=${uid}&time=${Date.parse(new Date().toString())}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorization": authorization,
          "accept": "application/json, text/plain, */*",
          "content-length": JSON.stringify(params).length.toString(),
          "x-tt-gameid": gameId,
        },
        body: JSON.stringify(params),
      }
    );

    return datarus.json();
  }

  /* 注入 CSS */
  function injectStyle() {
    const styleDOM = document.createElement("style");
    styleDOM.id = `${CLASS_NAME}-style`;
    styleDOM.innerHTML = __STYLE_TEXT;
    document.head.append(styleDOM);
  }

  /* 注入控件 */
  function injectControls() {
    const root = document.querySelector("#Cocos2dGameContainer");
    const container = document.createElement("div");
    container.className = `${CLASS_NAME}-script`;
    container.innerHTML = __TEMPLATE_TEXT;
    root.appendChild(container);
  }

  /* 以下为执行代码 */

  /* 注入 XHR 拦截器 */
  (function (context) {
    context.rewriteXHR = {
      cachedProto: function () {
        this._originXhr = context.XMLHttpRequest.prototype;
        this._originOpen = this._originXhr.open;
        this._originSend = this._originXhr.send;
        this._originSetRequestHeader = this._originXhr.setRequestHeader;
      },
      overWrite: function () {
        const _this = this;
        this._originXhr.open = function () {
          this.open_args = [...arguments];
          return _this._originOpen.apply(this, arguments);
        };
        this._originXhr.send = function () {
          return _this._originSend.apply(this, arguments);
        };
        this._originXhr.setRequestHeader = function () {
          const url = this.open_args && this.open_args[1];

          if (url.startsWith(API_GAME_BASE)) {
            const headerKey = arguments[0];

            if (/^x-tt-gameid$/.test(headerKey)) {
              localStorage.setItem(`${CLASS_NAME}-gameid`, arguments[1]);
              Alpine.store("controls").form.gameId = localStorage.getItem(`${CLASS_NAME}-gameid`);
            }

            if (/^Authorization$/.test(headerKey)) {
              localStorage.setItem(`${CLASS_NAME}-authid`, arguments[1]);
              Alpine.store("controls").form.authorization = localStorage.getItem(
                `${CLASS_NAME}-authid`
              );
            }
          }

          return _this._originSetRequestHeader.apply(this, arguments);
        };
      },
      init: function () {
        this.cachedProto();
        this.overWrite();
      },
    };
    context.rewriteXHR.init();
  })(window);

  document.addEventListener("alpine:init", () => {
    Alpine.store("controls", {
      form: {
        uid: "",
        gameId: "",
        authorization: "",
        commandStep: "0",
      },
      message: "",

      onChange(value) {
        Alpine.store("controls").form.commandStep = value;
      },

      async onSubmit() {
        Alpine.store("controls").message = "";

        const result = await gameCommand({
          ...Alpine.store("controls").form,
        });

        // 更新时间：2021-01-17
        const { message } = result;
        Alpine.store("controls").message = message;
      },
    });

    console.info("== Juejin miming: inject ==");
  });

  const _onload = window.onload || function () {};
  window.onload = async (event) => {
    _onload(event);
    setTimeout(injectStyle);
    setTimeout(injectControls, 8000);

    // 更新时间：2022-01-17
    const { user_id } = await getUserInfo();
    Alpine.store("controls").form.uid = user_id;
    Alpine.store("controls").form.gameId = localStorage.getItem(`${CLASS_NAME}-gameid`);
    Alpine.store("controls").form.authorization = localStorage.getItem(`${CLASS_NAME}-authid`);
    console.log("== Juejin miming: enjoy ==");
  };
})();
