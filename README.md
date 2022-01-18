# 海底掘金

这是一个针对 [掘金 - 海底掘金活动](https://juejin.cn/game/haidijuejin/) 编写的油猴脚本，实现了用户信息的自动获取和掘进方式的高效的选择，而不用手动拼接代码。

部分代码参考了以下两篇文章：

- [2022年了，你还在手动挖矿吗？3分钟海底掘金直通攻略](https://juejin.cn/post/7047688281693585415)
- [Javascript 如何全面接管xhr请求](https://juejin.cn/post/7019704757556084750)

> 此脚本只是方便执行代码，并没有自动化挖矿哦~

## 安装

- [Release](https://github.com/palmcivet/juejin-miming/releases)
- [Greasy Fork](https://greasyfork.org/zh-CN/scripts/438691-%E6%B5%B7%E5%BA%95%E6%8E%98%E9%87%91)
- [Script](https://palmcivet.github.io/juejin-miming/index.js)

## 使用

脚本会自动获取 `authorization` 和 `x-tt-gameid` 字段，用户只需要根据情况选择掘进方式，然后点击 *执行* 按钮

## 开发

- 调试 UI
    ```bash
    $ yarn dev
    ```
- 编译
    ```bash
    $ yarn build
    ```

## 许可协议

MIT
