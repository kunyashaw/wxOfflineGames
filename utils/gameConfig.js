const gameCategories = [
  {
    id: 'puzzle',
    name: '益智烧脑',
    icon: '🧩',
    games: [
      { id: 'puzzle_001', name: '2048', difficulty: '中', icon: '🔢' },
      { id: 'puzzle_002', name: '数独', difficulty: '高', icon: '🎯' },
      { id: 'puzzle_003', name: '拼图', difficulty: '中', icon: '🧩' },
      { id: 'puzzle_004', name: '记忆棋', difficulty: '低', icon: '🃏' },
      { id: 'puzzle_005', name: '推箱子', difficulty: '高', icon: '📦' },
      { id: 'puzzle_006', name: '华容道', difficulty: '高', icon: '🚪' },
      { id: 'puzzle_007', name: '数字连线', difficulty: '低', icon: '🔗' },
      { id: 'puzzle_008', name: '颜色匹配', difficulty: '低', icon: '🎨' },
      { id: 'puzzle_009', name: '管道工', difficulty: '中', icon: '🔧' },
      { id: 'puzzle_010', name: '密码破译', difficulty: '高', icon: '🔐' }
    ]
  },
  {
    id: 'arcade',
    name: '经典街机',
    icon: '🎮',
    games: [
      { id: 'arcade_001', name: '贪吃蛇', difficulty: '低', icon: '🐍' },
      { id: 'arcade_002', name: '俄罗斯方块', difficulty: '中', icon: '🧱' },
      { id: 'arcade_003', name: '打砖块', difficulty: '中', icon: '🏐' },
      { id: 'arcade_004', name: '赛车跑酷', difficulty: '中', icon: '🏎️' },
      { id: 'arcade_005', name: '弹珠台', difficulty: '中', icon: '🎳' },
      { id: 'arcade_006', name: '直升机', difficulty: '低', icon: '🚁' },
      { id: 'arcade_007', name: '飞机大战', difficulty: '中', icon: '✈️' },
      { id: 'arcade_008', name: '采金矿', difficulty: '低', icon: '⛏️' },
      { id: 'arcade_009', name: '砖块跳跃', difficulty: '低', icon: '🪜' },
      { id: 'arcade_010', name: '冰块滑行', difficulty: '低', icon: '🧊' }
    ]
  },
  {
    id: 'casual',
    name: '休闲消除',
    icon: '🎯',
    games: [
      { id: 'casual_001', name: '扫雷', difficulty: '中', icon: '💣' },
      { id: 'casual_002', name: '接龙', difficulty: '中', icon: '🃏' },
      { id: 'casual_003', name: '对对碰', difficulty: '低', icon: '🎴' },
      { id: 'casual_004', name: '麻将消消', difficulty: '中', icon: '🀄' },
      { id: 'casual_005', name: '点消大师', difficulty: '低', icon: '👆' },
      { id: 'casual_006', name: '切割大师', difficulty: '中', icon: '🔪' },
      { id: 'casual_007', name: '水果连线', difficulty: '低', icon: '🍎' },
      { id: 'casual_008', name: '找不同', difficulty: '低', icon: '🔍' },
      { id: 'casual_009', name: '俄罗斯消除', difficulty: '中', icon: '🔶' },
      { id: 'casual_010', name: '井字棋', difficulty: '低', icon: '⭕' }
    ]
  },
  {
    id: 'chess',
    name: '棋类策略',
    icon: '♟️',
    games: [
      { id: 'chess_001', name: '五子棋', difficulty: '高', icon: '⬛' },
      { id: 'chess_002', name: '黑白棋', difficulty: '高', icon: '⚫' },
      { id: 'chess_003', name: '国际象棋', difficulty: '高', icon: '♔' },
      { id: 'chess_004', name: '迷宫', difficulty: '低', icon: '🌀' },
      { id: 'chess_005', name: '跳棋', difficulty: '中', icon: '⭕' },
      { id: 'chess_006', name: '中国象棋', difficulty: '高', icon: '車' },
      { id: 'chess_007', name: '围棋入门', difficulty: '高', icon: '⚪' },
      { id: 'chess_008', name: '围捕', difficulty: '中', icon: '🔲' },
      { id: 'chess_009', name: '策略塔防', difficulty: '中', icon: '🏰' },
      { id: 'chess_010', name: '2048策略版', difficulty: '中', icon: '🎲' }
    ]
  },
  {
    id: 'match3',
    name: '三消消除',
    icon: '💎',
    games: [
      { id: 'match3_001', name: '宝石迷阵', difficulty: '中', icon: '💍' },
      { id: 'match3_002', name: '泡泡龙', difficulty: '中', icon: '🫧' },
      { id: 'match3_003', name: '糖果消消乐', difficulty: '中', icon: '🍬' },
      { id: 'match3_004', name: '祖玛', difficulty: '中', icon: '🐍' },
      { id: 'match3_005', name: '水果忍者', difficulty: '低', icon: '🔪' },
      { id: 'match3_006', name: '冰雪消消', difficulty: '中', icon: '❄️' },
      { id: 'match3_007', name: '动物三消', difficulty: '低', icon: '🐾' },
      { id: 'match3_008', name: '饼干消消', difficulty: '低', icon: '🍪' },
      { id: 'match3_009', name: '宝石交换', difficulty: '中', icon: '💠' },
      { id: 'match3_010', name: '农场三消', difficulty: '低', icon: '🌾' }
    ]
  }
];

module.exports = { gameCategories };
