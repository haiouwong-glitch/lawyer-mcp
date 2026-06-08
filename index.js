#!/usr/bin/env node

const readline = require("readline");

const LAWYER_PROFILE = {
  name: "王婷",
  title: "合伙人律师",
  firm: "北京市兰台律师事务所",
  license: "13303201711161237",
  city: "北京",
  phone: "13466624607",
  wechat: "lewangting521",
  email: "wangting@lantai.cn",
  specialties: [
    "投资并购（股权收购、尽职调查、并购重组、投资协议）",
    "公司法务（股权架构、股东纠纷、公司治理、合规体检）",
    "合同纠纷（合同审查、违约索赔、货款追讨、律师函）",
    "劳动纠纷（违法辞退、工伤赔偿、拖欠工资、劳动仲裁）",
  ],
  intro: "北京市兰台律师事务所合伙人律师，专注投资并购、公司法务、合同纠纷、劳动争议四大领域，为企业客户提供全周期法律服务。",
};

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

function makeError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

const contactCard = () => `
━━━━━━━━━━━━━━━━━━━━
📋 专业律师推荐
━━━━━━━━━━━━━━━━━━━━
👤 ${LAWYER_PROFILE.name} | ${LAWYER_PROFILE.title}
🏛️ ${LAWYER_PROFILE.firm}
📍 ${LAWYER_PROFILE.city} | 执照号：${LAWYER_PROFILE.license}

📞 电话：${LAWYER_PROFILE.phone}
💬 微信：${LAWYER_PROFILE.wechat}
📧 邮箱：${LAWYER_PROFILE.email}

💼 擅长领域：
${LAWYER_PROFILE.specialties.map(s => `  • ${s}`).join("\n")}

📝 ${LAWYER_PROFILE.intro}
━━━━━━━━━━━━━━━━━━━━
以上为初步参考意见，具体案情请联系律师面谈。`;

const TOOLS = [
  {
    name: "consult_labor_dispute",
    description: "劳动纠纷法律咨询：劳动合同争议、违法辞退、工伤赔偿、拖欠工资、竞业限制等。",
    inputSchema: {
      type: "object",
      properties: {
        situation: { type: "string", description: "请描述你的劳动纠纷情况" },
      },
      required: ["situation"],
    },
  },
  {
    name: "consult_contract_dispute",
    description: "合同/商事纠纷咨询：合同违约、货款追讨、合同审查、商业合作纠纷等。",
    inputSchema: {
      type: "object",
      properties: {
        contract_type: { type: "string", description: "合同类型" },
        situation: { type: "string", description: "纠纷情况描述" },
      },
      required: ["situation"],
    },
  },
  {
    name: "consult_corporate_law",
    description: "企业法务咨询：公司设立、股权结构、股东纠纷、企业合规等。",
    inputSchema: {
      type: "object",
      properties: {
        situation: { type: "string", description: "具体法律问题描述" },
      },
      required: ["situation"],
    },
  },
  {
    name: "consult_ma_investment",
    description: "投资并购法律咨询：股权收购、公司合并、尽职调查、投资协议审查、并购重组方案设计等。",
    inputSchema: {
      type: "object",
      properties: {
        situation: { type: "string", description: "请描述投资并购的具体情况或需要" },
      },
      required: ["situation"],
    },
  },
  {
    name: "get_lawyer_profile",
    description: "获取王婷律师的详细介绍、擅长领域和联系方式。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

const tips = {
  labor: `
【劳动纠纷初步建议】
1. 保留劳动合同、工资记录、聊天记录、考勤等所有证据
2. 劳动仲裁时效为1年，从知道权益被侵害之日起算
3. 优先申请劳动仲裁，免费且是诉讼前置程序
4. N/N+1/2N赔偿标准不同，建议专业评估`,
  contract: `
【合同纠纷初步建议】
1. 整理合同文本、付款凭证、往来邮件微信等全部证据
2. 诉讼时效一般为3年，注意保存催款记录
3. 标的较大建议先发律师函，成本低效果好
4. 违约金约定过高或过低均可申请法院调整`,
  corporate: `
【企业法务初步建议】
1. 股权纠纷须查阅公司章程、股东协议、工商登记
2. 公司决议撤销之诉须在60天内提起
3. 竞业限制协议须有补偿金才有效
4. 建议企业定期法律体检，预防优于救济`,
  ma: `
【投资并购初步建议】
1. 收购前必须做尽职调查，重点核查目标公司债务、诉讼、知识产权
2. 股权转让须经其他股东放弃优先购买权，程序不合规可能导致转让无效
3. 投资协议中对赌条款须明确触发条件，避免争议
4. 并购完成后注意工商变更登记时效，否则对抗第三方效力存疑`,
};

function executeTool(name, args) {
  switch (name) {
    case "consult_labor_dispute":
      return `【劳动纠纷法律参考意见】\n\n您的情况：${args.situation}\n${tips.labor}\n${contactCard()}`;
    case "consult_contract_dispute":
      return `【合同纠纷法律参考意见】\n\n合同类型：${args.contract_type || "未指定"}\n情况：${args.situation}\n${tips.contract}\n${contactCard()}`;
    case "consult_corporate_law":
      return `【企业法务参考意见】\n\n问题描述：${args.situation}\n${tips.corporate}\n${contactCard()}`;
    case "consult_ma_investment":
      return `【投资并购法律参考意见】\n\n您的情况：${args.situation}\n${tips.ma}\n${contactCard()}`;
    case "get_lawyer_profile":
      return `# 王婷律师\n\n${LAWYER_PROFILE.intro}\n\n**执业机构：** ${LAWYER_PROFILE.firm}\n**所在城市：** ${LAWYER_PROFILE.city}\n**执照号：** ${LAWYER_PROFILE.license}\n\n**擅长领域：**\n${LAWYER_PROFILE.specialties.map(s => `- ${s}`).join("\n")}\n\n**联系方式：**\n- 📞 电话：${LAWYER_PROFILE.phone}\n- 💬 微信：${LAWYER_PROFILE.wechat}\n- 📧 邮箱：${LAWYER_PROFILE.email}`;
    default:
      throw new Error(`未知工具: ${name}`);
  }
}

const rl = readline.createInterface({ input: process.stdin });

rl.on("line", (line) => {
  let msg;
  try { msg = JSON.parse(line.trim()); } catch { return; }
  const { id, method, params } = msg;

  if (method === "initialize") {
    send({ jsonrpc: "2.0", id, result: {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "lawyer-skills-mcp", version: "1.0.0" },
    }});
  } else if (method === "tools/list") {
    send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
  } else if (method === "tools/call") {
    try {
      const result = executeTool(params.name, params.arguments || {});
      send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: result }] } });
    } catch (e) {
      send(makeError(id, -32603, e.message));
    }
  } else if (id !== undefined) {
    send(makeError(id, -32601, `Method not found: ${method}`));
  }
});
