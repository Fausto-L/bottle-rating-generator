import type { AppState } from '../types/appState'
import type { Bottle } from '../types/bottle'
import type { Template } from '../types/template'

const girlfriendLabels = [
  '帅',
  '腹肌',
  '身高',
  '胖',
  '手好看',
  '声音好听',
  '狼狗',
  '奶狗',
  '主动',
  '浪漫',
  '会撒娇',
  '有主见',
  '靠谱',
  '细心',
  '脾气好',
  '可爱',
  '闷骚',
  '霸道',
  '忠诚',
  '嘴甜',
  '会哄人',
  '直球',
  '逗比',
  '安全感',
  '控制欲',
  '占有欲',
  '宠溺',
  '体贴',
  '温柔',
  '粘人',
  '稳重',
  '单纯',
  '会拍照',
  '会唱歌',
  '会做饭',
  '爱打游戏',
]

const friendLabels = [
  '靠谱',
  '嘴硬',
  '热心',
  '好笑',
  '迟到',
  '话多',
  '会玩',
  '记仇',
  '大方',
  '细节',
  '胆大',
  '社牛',
  '社恐',
  '熬夜',
  '会拍照',
  '爱吃',
  '能聊',
  '毒舌',
  '温柔',
  '冲动',
  '讲义气',
  '有梗',
  '自律',
  '摆烂',
  '清醒',
  '恋爱脑',
  '行动力',
  '审美',
  '游戏强',
  '唱歌',
  '做饭',
  '省钱',
  '花钱',
  '记性',
  '好奇心',
  '抗压',
]

function makeBottles(labels: string[]): Bottle[] {
  return labels.slice(0, 36).map((label, index) => ({
    id: `bottle-${index + 1}`,
    label,
    value: 0,
  }))
}

function makeBlankBottles(): Bottle[] {
  return Array.from({ length: 36 }, (_, index) => ({
    id: `bottle-${index + 1}`,
    label: `标签${index + 1}`,
    value: 0,
  }))
}

export const templates: Template[] = [
  {
    id: 'girlfriend',
    name: '让你的女友评价你',
    title: '让你的女友评价你',
    subtitle: '自由填写属性，看看哪些瓶子被装满',
    themeColor: 'pink',
    bottles: makeBottles(girlfriendLabels),
  },
  {
    id: 'friend',
    name: '让你的朋友评价你',
    title: '让你的朋友评价你',
    subtitle: '朋友滤镜有多厚，一瓶一瓶看出来',
    themeColor: 'blue',
    bottles: makeBottles(friendLabels),
  },
  {
    id: 'blank',
    name: '空白自定义模板',
    title: '瓶子评价图',
    subtitle: '把想评价的东西都装进瓶子里',
    themeColor: 'pink',
    bottles: makeBlankBottles(),
  },
]

export function getTemplate(id: string): Template {
  return templates.find((template) => template.id === id) ?? templates[0]
}

export function createStateFromTemplate(template: Template): AppState {
  return {
    version: 1,
    templateId: template.id,
    title: template.title,
    subtitle: template.subtitle,
    themeColor: template.themeColor,
    showPercent: true,
    bottles: template.bottles.map((bottle) => ({ ...bottle })),
    updatedAt: Date.now(),
  }
}
