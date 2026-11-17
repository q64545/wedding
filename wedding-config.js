/**
 * 请柬的全部婚礼信息都在这里修改。保存后刷新页面即可，不需要构建。
 * 姓名、日期、酒店、地址和流程均为示例，请在发布前替换。
 * 完成替换后，把 isDemo 改为 false，页面会隐藏“示例信息”提示。
 * 这份文件会公开发布，请勿填写密码、密钥等信息。
 */
window.WEDDING_CONFIG = {
  isDemo: true,
  couple: {
    groom: "曾磐",
    bride: "肖凤",
    monogram: "Z & X"
  },
  copy: {
    heroEyebrow: "WE ARE GETTING MARRIED",
    heroTitle: "把余生，\n写成我们。",
    heroSubtitle: "诚邀你，成为这一天的见证。",
    invitationTitle: "这一封邀请，\n写给重要的你。",
    invitationParagraphs: [
      "关于幸福，我们有很多种想象。\n而最期待的一种，是与你相聚的那一天。",
      "我们准备了一场婚礼，\n想把郑重的承诺、温柔的拥抱，\n还有那些藏不住的欢喜，与你分享。"
    ],
    galleryTitle: "在一起的每一帧",
    closingTitle: "最好的时刻，\n想与你一起。",
    closingNote: "带上祝福，带上笑容。\n我们在婚礼现场，等你。"
  },
  wedding: {
    // 保留 +08:00，表示北京时间。也可以填写带时区的其他日期。
    dateTime: "2027-01-02T12:-0:00+08:00",
    endDateTime: "2027-01-02T23:59:59+08:00",
    timeZone: "Asia/Shanghai",
    venue: "示例花园酒店",
    hall: "云庭宴会厅 · 2F",
    address: "示例市 · 幸福路 520 号",
    // 填入真实地图分享链接后，页面才显示“查看地图”。
    mapUrl: "",
    schedule: [
      { time: "17:00", title: "迎宾合影", note: "赴一场温柔的相聚" },
      { time: "17:30", title: "婚礼仪式", note: "一起见证我们的承诺" },
      { time: "18:00", title: "喜宴开席", note: "举杯，把快乐慢慢聊" }
    ]
  },
  // 可选音乐：把你有权使用的音频放到 assets 下，在 src 填相对路径。
  // 默认留空，页面不会出现音乐按钮；有音乐时由宾客点击后播放。
  music: { src: "", title: "婚礼背景音乐" },
  // 可调整相册顺序；id 对应 assets/photos 中的照片编号。
  album: [
    { id: "9362", alt: "白色拱门下，两人牵手相望", caption: "把余生，写成我们" },
    { id: "9327", alt: "湖畔花拱门下的合影", caption: "花开的时候，刚好有你" },
    { id: "9390", alt: "湖边礼堂里，新郎轻轻托起头纱", caption: "一起，走向新的篇章" },
    { id: "9394", alt: "白色礼堂里，两人牵手微笑", caption: "目光所及，是你" },
    { id: "9426", alt: "花园里，新娘坐在白马上与新郎相望", caption: "平凡日子里的小小浪漫" },
    { id: "9617", alt: "湖畔草丛中，两人温柔相拥", caption: "风吹过，也心动" },
    { id: "9659", alt: "花园木屋前，新郎向新娘伸出手", caption: "下一程，也牵着手" },
    { id: "9422", alt: "绿树和白马前，新郎望向新娘", caption: "朝你走去的每一步" },
    { id: "9480", alt: "暖光与花瓣下，两人相依而坐", caption: "让爱落在每一个日常" },
    { id: "9773", alt: "蓝调夜空下的拥抱", caption: "夜色温柔，你也是" },
    { id: "9871", alt: "夜空下，两人举起闪亮的烟花", caption: "愿所有美好，都有回响" }
  ]
};
