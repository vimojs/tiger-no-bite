import { curtains } from '../../data/curtains'
import type { CurtainProduct } from '../../types/curtain'

Page({
  data: {
    featured: curtains.slice(0, 4) as CurtainProduct[]
  },

  startPreview(): void {
    wx.navigateTo({ url: '/pages/preview/index' })
  },

  openProducts(): void {
    wx.switchTab({ url: '/pages/products/index' })
  },

  openProduct(event: WechatMiniprogram.TouchEvent): void {
    const id = String(event.currentTarget.dataset.id || 'c1')
    wx.navigateTo({ url: `/pages/preview/index?productId=${id}` })
  },


  onShow() {
    const tabBar = this.getTabBar();

    if (tabBar) {
      tabBar.setData({ selected: 0 });
    }
  }
})
