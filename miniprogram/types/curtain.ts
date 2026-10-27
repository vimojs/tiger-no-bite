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
  /** Visual estimate only; 0 is opaque and 100 is highly translucent. */
  lightTransmission: number
}

export interface SavedPlan {
  productId: string
  productName: string
  savedAt: string
}
