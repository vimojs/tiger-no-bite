import { curtains } from '../../data/curtains'
import type { CurtainProduct, SavedPlan } from '../../types/curtain'

type CategoryFilter = '全部' | CurtainProduct['category']

Page({
  data: {
    products: curtains as CurtainProduct[],
    selectedId: 'c1',
    selectedCategory: '全部' as CategoryFilter,
    categories: ['全部', '纱帘', '布帘', '遮光帘'] as CategoryFilter[],
    statusText: '准备开启摄像头',
    selectedName: '米白柔纱帘',
    selectedTexture: '/assets/curtains/c1.png',
    selectedPrice: 199,
    transmission: 72,
    ambientLight: 65,
    lightLabel: '明亮日光',
    lightBeamOpacity: 0.22,
    curtainWidth: 1.4,
    curtainHeight: 1.8,
    curtainWidthLabel: '1.4',
    curtainHeightLabel: '1.8',
    filteredProducts: curtains as CurtainProduct[],
    cameraActive: false,
    cameraStarting: false,
    cameraOnlyDiagnostic: true,
    curtainPlaced: false,
    curtainClosed: false,
  },

  toggleCurtain(): void {
    const curtainClosed = !this.data.curtainClosed
  
    this.setData({
      curtainClosed
    })
  },

  toggleCamera(): void {
    // 摄像头已开启，再次点击则关闭
    if (this.data.cameraActive) {
      this.setData({
        cameraActive: false,
        cameraStarting: false,
        curtainPlaced: false,
        curtainClosed: false,
        statusText: '摄像头已关闭'
      })
      return
    }
  
    if (this.data.cameraStarting) return
    this.setData({ cameraStarting: true, statusText: '正在检查相机权限…' })
    wx.getSetting({
      success: (result) => {
        if (result.authSetting['scope.camera']) {
          this.startARCamera()
          return
        }
        wx.authorize({
          scope: 'scope.camera',
          success: () => this.startARCamera(),
          fail: () => {
            this.setData({ cameraStarting: false, statusText: '相机权限未开启' })
            wx.showModal({
              title: '需要相机权限',
              content: 'AR 试搭需要使用相机。请在设置中允许帘境访问相机。',
              confirmText: '去设置',
              success: (modal) => {
                if (modal.confirm) wx.openSetting({})
              }
            })
          }
        })
      },
      fail: () => {
        this.setData({ cameraStarting: false, statusText: '无法读取相机权限状态' })
      }
    })
  },

  startARCamera(): void {
    this.setData({
      cameraStarting: false,
      cameraActive: true,
      curtainPlaced: false,
      statusText: '正在启动 AR 相机…'
    })
  },

  onLoad(options: Record<string, string | undefined>): void {
    const id = options.productId
    if (id) this.selectProductById(id)
  },

  chooseCategory(event: WechatMiniprogram.TouchEvent): void {
    const category = event.currentTarget.dataset.category as CategoryFilter
    const filteredProducts = category === '全部'
      ? curtains
      : curtains.filter(item => item.category === category)
    this.setData({ selectedCategory: category, filteredProducts })
  },

  chooseProduct(event: WechatMiniprogram.TouchEvent): void {
    const id = String(event.currentTarget.dataset.id || 'c1')
    this.selectProductById(id)
  },

  selectProductById(id: string): void {
    const product = curtains.find(item => item.id === id) || curtains[0]
  
    this.setData({
      selectedId: product.id,
      selectedName: product.name,
      selectedPrice: product.price,
      selectedTexture: product.texture,
      transmission: product.lightTransmission
    })
  },

  changeAmbientLight(event: WechatMiniprogram.SliderChange): void {
    const ambientLight = Number(event.detail.value)
    this.setData({ ambientLight, lightLabel: ambientLight > 75 ? '强烈日光' : ambientLight > 45 ? '明亮日光' : ambientLight > 25 ? '柔和日光' : '傍晚微光', lightBeamOpacity: 0.05 + ambientLight / 350 })
  },

  changeTransmission(event: WechatMiniprogram.SliderChange): void {
    this.setData({ transmission: Number(event.detail.value) })
  },

  changeCurtainWidth(event: WechatMiniprogram.SliderChange): void {
    const curtainWidth = Number(event.detail.value)
    this.setData({ curtainWidth, curtainWidthLabel: curtainWidth.toFixed(1) })
  },

  changeCurtainHeight(event: WechatMiniprogram.SliderChange): void {
    const curtainHeight = Number(event.detail.value)
    this.setData({ curtainHeight, curtainHeightLabel: curtainHeight.toFixed(1) })
  },

  onARStatus(event: WechatMiniprogram.CustomEvent): void {
    const detail = event.detail as { placed?: boolean; message?: string }
    this.setData({
      curtainPlaced: detail.placed === undefined ? this.data.curtainPlaced : detail.placed,
      statusText: detail.message || this.data.statusText
    })
  },

  resetARPlacement(): void {
    const arCurtain = this.selectComponent('#arCurtain') as any
    if (arCurtain && typeof arCurtain.resetPlacement === 'function') arCurtain.resetPlacement()
  },

  savePlan(): void {
    const plan: SavedPlan = {
      productId: this.data.selectedId,
      productName: this.data.selectedName,
      savedAt: new Date().toISOString()
    }
    wx.setStorageSync('lianjing_last_plan', plan)
    wx.showToast({ title: '已保存搭配记录', icon: 'success' })
  },

  showProduct(): void {
    wx.showModal({
      title: this.data.selectedName,
      content: `模拟商品信息：¥${this.data.selectedPrice}/㎡ 起。正式版将接入商品详情与购买服务。`,
      showCancel: false
    })
  },

})
