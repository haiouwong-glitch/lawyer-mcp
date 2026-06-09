# lawyer-skills-mcp

> 王婷律师 · 律师专业技能 MCP Server
> 一个通过 MCP 协议对外提供法律咨询引导的工具集。

[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

---

## 简介

`lawyer-skills-mcp` 是一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 的 stdio 服务器,把律师的专业领域包装成可被 Claude / Cursor / Cline 等 AI 客户端调用的工具(tools)。

- ✅ **零依赖**:只用 Node.js 内置模块,无需 `npm install`
- ✅ **8 个工具**(7 个专业咨询 + 1 个律师名片)
- ✅ **JSON-RPC 2.0** 协议,符合 MCP `2024-11-05` 规范
- ✅ **律师手动把控口径**,内置「请面谈」免责提示
- ✅ **零数据外发**:纯本地 stdio,不走 HTTP

---

## 律师信息

| 项 | 内容 |
|---|---|
| 姓名 | **王婷** |
| 头衔 | 合伙人律师 |
| 执业机构 | 北京市兰台律师事务所 |
| 执照号 | 13303201711161237 |
| 所在城市 | 北京 |
| 电话 | 13466624607 |
| 微信 | lewangting521 |
| 邮箱 | wangting@lantai.cn |

**擅长领域(7 大方向)**

1. 投资并购(股权收购、尽职调查、并购重组、投资协议)
2. 创业融资(股权激励、期权设计、Term Sheet、融资协议审查)
3. 外资合规(VIE架构、ODI/FDI备案、外商投资审查、数据跨境合规)
4. 公司法务(股权架构、股东纠纷、公司治理、合规体检)
5. 知识产权(商业秘密保护、专利商标、竞业限制、代码著作权)
6. 合同纠纷(合同审查、违约索赔、货款追讨、律师函)
7. 劳动纠纷(违法辞退、工伤赔偿、拖欠工资、劳动仲裁)

---

## 文件结构

```
lawyer-mcp/
├── package.json     # npm 项目元信息
├── README.md        # 本文件
├── .gitignore       # git 忽略规则
└── src/
    └── index.js     # MCP server 入口(JSON-RPC 2.0 over stdio)
```

---

## 环境要求

- **Node.js >= 18**(已在 v24.x 验证可用)
- 一个支持 MCP 协议的客户端:Claude Desktop / Cursor / Cline / 其他兼容 stdio 的 MCP host

---

## 启动方式

### 方式一:直接跑

```bash
cd lawyer-mcp
node src/index.js
```

### 方式二:用 npm 脚本

```bash
cd lawyer-mcp
npm start
```

> 服务器会从 stdin 读 JSON-RPC 消息,向 stdout 写响应。不会主动打印任何东西。

---

## MCP 客户端配置

### Claude Desktop

编辑 `%APPDATA%\Claude\claude_desktop_config.json`(Windows)或 `~/Library/Application Support/Claude/claude_desktop_config.json`(macOS):

```json
{
  "mcpServers": {
    "lawyer-skills": {
      "command": "node",
      "args": ["C:/Users/sophie/Desktop/lawyer-mcp/src/index.js"]
    }
  }
}
```

### Cursor

编辑 `~/.cursor/mcp.json`,内容同上。

### Cline / 其他

参照对应客户端文档,把上述 `mcpServers` 块加入配置即可。

---

## 工具列表

| 工具名 | 用途 | 必填参数 | 可选参数 |
|---|---|---|---|
| `consult_labor_dispute` | 劳动纠纷咨询 | `situation` | — |
| `consult_contract_dispute` | 合同纠纷咨询 | `situation` | `contract_type` |
| `consult_corporate_law` | 公司法务咨询 | `situation` | — |
| `consult_ma_investment` | 投资并购咨询 | `situation` | — |
| `consult_startup_financing` | 创业融资咨询 | `situation` | — |
| `consult_foreign_compliance` | 外资合规咨询 | `situation` | — |
| `consult_ip` | 知识产权咨询 | `situation` | — |
| `get_lawyer_profile` | 获取律师介绍 | — | — |

每个 `consult_*` 工具返回的内容包含:

1. 用户情况回显
2. 4 条该领域**通用**初步建议(模板化)
3. 王婷律师的名片(电话 / 微信 / 邮箱)

`get_lawyer_profile` 直接返回律师 Markdown 介绍。

---

## 手动测试(可选)

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize"}' | node src/index.js
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | node src/index.js
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_lawyer_profile","arguments":{}}}' | node src/index.js
```

预期:三行 JSON 响应,无报错。

---

## 免责声明

⚠️ 本工具由 Claude 辅助生成,仅作为律师专业服务的前置导流和初步参考。

- 工具返回的「初步建议」为**通用模板**,不构成针对具体案件的法律意见
- 真实案件请通过电话 / 微信 / 邮箱联系王婷律师面谈
- 律师执业判断以正式委托和书面意见为准

---

## License

[MIT](LICENSE) — 由王婷律师授权,以 MIT 协议开源。
