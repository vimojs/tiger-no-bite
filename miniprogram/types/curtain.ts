export type CurtainCategory = '纱帘' | '布帘' | '遮光帘'

export interface CurtainProduct {
  id: string
  name: string
  category: '纱帘' | '布帘' | '遮光帘'
  price: number
  tag: string
  color: string
  texture: string
  desc: string
}

export interface SavedPlan {
  productId: string
  productName: string
  savedAt: string
}
