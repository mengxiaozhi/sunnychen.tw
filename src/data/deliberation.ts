export const deliberation = {
  title: '中和生活改善的優先順序',
  description: '走路、通勤、公園、街區環境，你希望哪裡變得更好？一起討論有限資源可以先放在哪裡，也聽見不同生活經驗的選擇。',
  canonical: 'https://sunnychen.tw/deliberation/',
  upstream: 'https://github.com/mashbean/pocket-polis',
  seedStatements: [
    '中和的改善資源應優先用在人行道與路口安全。',
    '改善通勤接駁與公車班次，比增加汽車停車位更值得優先投入。',
    '增加停車空間，比縮減停車空間來拓寬人行道更急迫。',
    '在改造道路前，應先蒐集不同時段的實際使用情況。',
    '街道改善應兼顧輪椅使用者、長者與推嬰兒車的人。',
    '有限資源應優先維護既有公園與設施，再考慮新建。',
    '街區整潔、噪音與違規停車，應有更清楚的通報與追蹤方式。',
    '調整道路與停車配置之前，應充分討論店家與居民的使用需求。',
    '我更希望先改善身邊的小型問題，而不是投入大型建設。',
    '有些改善即使短期造成不便，只要效果清楚，仍值得嘗試。',
    '各項改善應公開預算、進度與成效，讓居民持續檢視。',
    '不同里別的需求不同，應先做小範圍試辦，再決定是否擴大。',
  ],
};

/** Public deployment identifiers only. Administration tokens must never be added here. */
export const deliberationConfig = {
  apiBase: process.env.NEXT_PUBLIC_POLIS_API_URL ?? '',
  conversationId: process.env.NEXT_PUBLIC_POLIS_CONVERSATION_ID ?? '',
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
};
