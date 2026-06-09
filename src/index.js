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
    "创业融资（股权激励、期权设计、Term Sheet、融资协议审查）",
    "外资合规（VIE架构、ODI/FDI备案、外商投资审查、数据跨境合规）",
    "公司法务（股权架构、股东纠纷、公司治理、合规体检）",
    "知识产权（商业秘密保护、专利商标、竞业限制、代码著作权）",
    "合同纠纷（合同审查、违约索赔、货款追讨、律师函）",
    "劳动纠纷（违法辞退、工伤赔偿、拖欠工资、劳动仲裁）",
  ],
  intro: "北京市兰台律师事务所合伙人律师，专注服务外资企业、科技公司及创业团队，深耕投资并购、创业融资、外资合规、公司法务、知识产权、合同纠纷、劳动纠纷七大领域，为企业客户提供全周期法律服务。",
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
    name: "consult_startup_financing",
    description: "创业融资法律咨询：股权激励方案、期权池设计、Term Sheet审查、融资协议谈判、创始人协议、联合创始人纠纷等。",
    inputSchema: {
      type: "object",
      properties: {
        situation: { type: "string", description: "请描述融资阶段或具体法律问题" },
      },
      required: ["situation"],
    },
  },
  {
    name: "consult_foreign_compliance",
    description: "外资合规法律咨询：VIE架构搭建、ODI/FDI境外投资备案、外商投资合规审查、数据跨境合规、个人信息保护法合规等。",
    inputSchema: {
      type: "object",
      properties: {
        situation: { type: "string", description: "请描述外资合规的具体需求或问题" },
      },
      required: ["situation"],
    },
  },
  {
    name: "consult_ip",
    description: "知识产权法律咨询：商业秘密保护、专利商标申请与维权、员工竞业限制协议、代码著作权保护等。",
    inputSchema: {
      type: "object",
      properties: {
        situation: { type: "string", description: "请描述知识产权相关问题" },
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
  startup: `
【创业融资初步建议】
1. 融资前务必签署创始人协议，明确股权、分工、退出机制
2. 期权池建议在融资前设立，避免稀释现有股东
3. Term Sheet重点关注：估值、优先清算权、反稀释条款
4. 融资协议中对赌条款须谨慎，业绩承诺要留有余地`,
  foreign: `
【外资合规初步建议】
1. VIE架构搭建须提前规划，涉及多层协议和备案手续
2. ODI境外投资须经发改委、商务部、外汇局三部门备案
3. 数据跨境须做安全评估或签署标准合同，违规罚款最高5000万
4. 外商投资负面清单每年更新，进入前须确认准入资格`,
  ip: `
【知识产权初步建议】
1. 商业秘密保护须签署保密协议，并有实际保密措施才受法律保护
2. 竞业限制协议须有补偿金（不低于月均工资30%）才有效
3. 软件著作权建议及时登记，发生纠纷时举证更有力
4. 商标建议尽早注册，抢注风险高发于初创企业`,
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
    case "consult_startup_financing":
      return `【创业融资法律参考意见】\n\n您的情况：${args.situation}\n${tips.startup}\n${contactCard()}`;
    case "consult_foreign_compliance":
      return `【外资合规法律参考意见】\n\n您的情况：${args.situation}\n${tips.foreign}\n${contactCard()}`;
    case "consult_ip":
      return `【知识产权法律参考意见】\n\n您的情况：${args.situation}\n${tips.ip}\n${contactCard()}`;
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
