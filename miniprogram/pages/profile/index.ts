import type { SavedPlan } from '../../types/curtain'

Page({
  data: { plan: null as SavedPlan | null },

  onShow(): void {
    const plan = wx.getStorageSync('lianjing_last_plan') as SavedPlan | undefined
    this.setData({ plan: plan || null })

    const tabBar = this.getTabBar();
    
    if (tabBar) {
      tabBar.setData({ selected: 2 });
    }
  },

  openPreview(): void {
    wx.navigateTo({ url: '/pages/preview/index' })
  },

  showFeature(event: WechatMiniprogram.TouchEvent): void {
    const name = String(event.currentTarget.dataset.name || '该功能')
    wx.showToast({ title: `${name}即将开放`, icon: 'none' })
  }
})
