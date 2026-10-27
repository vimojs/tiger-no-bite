
import type { CurtainProduct } from '../types/curtain'

export const curtains: CurtainProduct[] = [
  {
    id: 'c1',
    name: '米白柔纱帘',
    category: '纱帘',
    price: 199,
    tag: '热销',
    color: '#E9E0D2',
    texture: '/assets/curtains/c1.png',
    desc: '轻盈透光，柔和自然光',
    lightTransmission: 72
  },
  {
    id: 'c2',
    name: '浅灰遮光帘',
    category: '遮光帘',
    price: 299,
    tag: '高遮光',
    color: '#A8AAA7',
    texture: '/assets/curtains/c2.png',
    desc: '简约耐看，适合卧室',
    lightTransmission: 12
  },  
]
