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
    cameraReady: false,
    cameraAuthorized: true,
    showManualHint: false,
    selectedName: '米白柔纱帘',
    selectedColor: '#E9E0D2',
    selectedTexture: '/assets/curtains/c1.jpg',
    selectedPrice: 199,
    filteredProducts: curtains as CurtainProduct[],
    cameraActive: false,
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
        cameraReady: false,
        curtainClosed: false,
        statusText: '摄像头已关闭'
      })
      return
    }
  
    // 摄像头未开启，点击启动
    this.setData({
      cameraActive: true,
      statusText: '正在启动摄像头…'
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
      selectedColor: product.color,
      selectedPrice: product.price,
      selectedTexture: product.texture
    })
  },

  toggleManual(): void {
    this.setData({ showManualHint: !this.data.showManualHint })
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

  startCamera(): void {
    this.setData({
      cameraActive: true,
      statusText: '正在启动摄像头…'
    })
  },
  
  
  onCameraReady(): void {
    this.setData({
      cameraReady: true,
      statusText: '摄像头已开启 · 可开始选款'
    })
  },
  
  onCameraError(event: WechatMiniprogram.CustomEvent): void {
    console.error('摄像头启动失败：', event.detail)
  
    this.setData({
      cameraActive: false,
      cameraReady: false,
      statusText: '摄像头启动失败 · 可重试'
    })
  
    wx.showModal({
      title: '无法开启摄像头',
      content: '请检查微信摄像头权限，并在真机上重新尝试。',
      showCancel: false
    })
  },
})
