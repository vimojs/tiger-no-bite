import { curtains } from '../../data/curtains'
import type { CurtainProduct } from '../../types/curtain'

type CategoryFilter = '全部' | CurtainProduct['category']

Page({
  data: {
    products: curtains as CurtainProduct[],
    categories: ['全部', '纱帘', '布帘', '遮光帘'] as CategoryFilter[],
    selectedCategory: '全部' as CategoryFilter,
    filteredProducts: curtains as CurtainProduct[]
  },

  chooseCategory(event: WechatMiniprogram.TouchEvent): void {
    const category = event.currentTarget.dataset.category as CategoryFilter
    const filteredProducts = category === '全部'
      ? curtains
      : curtains.filter(item => item.category === category)
    this.setData({ selectedCategory: category, filteredProducts })
  },

  openPreview(event: WechatMiniprogram.TouchEvent): void {
    const id = String(event.currentTarget.dataset.id || 'c1')
    wx.navigateTo({ url: `/pages/preview/index?productId=${id}` })
  },
  
  onShow() {
    const tabBar = this.getTabBar();
  
    if (tabBar) {
      tabBar.setData({ selected: 1 });
    }
  }
})
