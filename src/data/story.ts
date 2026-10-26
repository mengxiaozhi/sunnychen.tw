export interface StoryChapter {
  id: string;
  title: string;
  label: string;
  kicker: string;
  paragraphs: string[];
  image: string;
  alt: string;
  caption: string;
}

/** Transcribed and lightly punctuated from the storybook supplied by the campaign. */
export const chapters: StoryChapter[] = [
  {
    id: 'growth',
    title: '從大甲出發，把責任放在心上。',
    label: '成長',
    kicker: '1983.07.28 · 台中海線—大甲',
    paragraphs: [
      '我出生在一個風大日烈、卻也最貼近土地氣息的地方。',
      '農村長大、長女的排行讓我沒有太多「被照顧」的時間，反而早早學會了怎麼照顧人。小學一年級，我就已經會帶孩子、煮簡單的飯菜、拿起針線縫補衣物。',
      '家中經營著紡織產業，我也學著踩縫紉機、燙整衣服，看著一件件成衣從手中完成，成為維持家中經濟的商品。',
      '那些對多數人來說還太早的責任，在我的生命裡悄悄生根。不知不覺中，比同齡的孩子更早懂事，也更早堅強。',
    ],
    image: '/images/story-02.webp',
    alt: '故事書中的童年合照：母親抱著年幼的陳怡君',
    caption: '我是陳怡君，從大甲到中和。',
  },
  {
    id: 'passion',
    title: '為同一個目標，怡起拚。',
    label: '熱愛',
    kicker: '棒球 · 家人的共同記憶',
    paragraphs: [
      '父親工作時，總會開著廣播，聽著棒球轉播。那些聲音穿過機器的運轉聲，成了我童年裡最熟悉的背景。',
      '假日，父親則會帶著全家到球場，欣賞球員奮力拚搏的比賽。',
      '正是在那些歡呼與吶喊中，我愛上了運動，更愛上為同一個目標而團結的感覺。',
    ],
    image: '/images/story-05.webp',
    alt: '故事書中陳怡君在棒球場應援、與球迷一同歡呼的照片',
    caption: '愛上運動，也愛上為同一個目標而團結的感覺。',
  },
  {
    id: 'questions',
    title: '開始，向世界發問。',
    label: '提問',
    kicker: '高中 · 辯論社',
    paragraphs: [
      '高中時令我感興趣的事物除了棒球，還有公共議題，於是我加入了辯論社。',
      '從死刑存廢到選舉制度，學著傾聽不同聲音，也學著用理性與社會對話。',
      '那些辯論的夜晚，不只是觀點的交鋒，更是我對社會開始產生提問的起點。',
    ],
    image: '/images/story-06.webp',
    alt: '故事書中陳怡君高中參與辯論社的教室與同學合照',
    caption: '學著傾聽不同聲音，也學著用理性與社會對話。',
  },
  {
    id: 'roots',
    title: '走過世界，最後在中和扎根。',
    label: '扎根',
    kicker: '從北上求學，到在中和找到歸屬',
    paragraphs: [
      '大學，北上就讀大學。第一次真正離開家，城市的節奏快速而陌生，思鄉的情緒總在夜深人靜時悄然湧現。',
      '常一個人來到中和的烘爐地，看著城市的燈火延伸到遠方。那裡，是我的童年記憶——父母曾帶著全家來祈願的地方。站在烘爐地的高台上，彷彿又回到小時候，也讓漂泊的心，有了一個可以安放的角落。',
      '有一天，父親語帶輕鬆地問我：「台北有沒有工作可以介紹呀？」大學期間，家中經營的紡織產業，隨著時代變遷逐漸走下坡。',
      '家中二樓那批堆放了二十年的布料，從價值百萬到幾乎無人問津，不再是待價而沽的商品，而是父親對家庭責任最後的執著與不願放手。',
      '看似玩笑的話，讓我瞬間明白父親的壓力與無奈。為了分擔家計，我決定離開校園，投入職場。進入旅遊業，一做就是 16 年。',
      '那段歲月，用力工作，也用力生活。走遍世界、看盡社會，最後在中和扎根，我的漂泊終於有了歸屬。',
    ],
    image: '/images/story-07.webp',
    alt: '故事書中的陳怡君在中和烘爐地合掌祈願',
    caption: '讓漂泊的心，有了一個可以安放的角落。',
  },
];

export const storyPages = [
  { image: '/images/story-01.webp', label: '封面｜幸福，怡起拚' },
  { image: '/images/story-02.webp', label: '我是陳怡君，從大甲到中和' },
  { image: '/images/story-03.webp', label: '從零開始落地生根的故事' },
  { image: '/images/story-04.webp', label: '成長｜台中海線—大甲' },
  { image: '/images/story-05.webp', label: '熱愛｜棒球與團結' },
  { image: '/images/story-06.webp', label: '提問｜開始向世界發問' },
  { image: '/images/story-07.webp', label: '烘爐地｜安放漂泊的心' },
  { image: '/images/story-08.webp', label: '家業｜父親的責任' },
  { image: '/images/story-09.webp', label: '扎根｜旅遊業的 16 年' },
  { image: '/images/story-10.webp', label: '但人生的考驗，從未預告' },
];
