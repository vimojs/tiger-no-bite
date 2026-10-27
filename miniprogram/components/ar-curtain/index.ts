let startupTimer: ReturnType<typeof setTimeout> | null = null

Component({
  properties: {
    selectedId: { type: String, value: 'c1' },
    width: { type: Number, value: 1.4 },
    height: { type: Number, value: 1.8 },
    transmission: { type: Number, value: 72 },
    ambientLight: { type: Number, value: 65 },
    closed: { type: Boolean, value: false }
  },
  data: {
    sceneReady: false
  },
  lifetimes: {
    attached() {
      const component = this as any
      startupTimer = setTimeout(() => {
        if (!component.data.sceneReady) {
          const message = 'XR 相机场景未启动 · 请检查真机相机权限和微信基础库'
          component.triggerEvent('arstatus', { message, stage: 'xr-scene-timeout' })
        }
      }, 15000)
    },
    detached() {
      if (startupTimer) clearTimeout(startupTimer)
      startupTimer = null
    }
  },
  methods: {
    handleReady(): void {
      if (startupTimer) clearTimeout(startupTimer)
      startupTimer = null
      this.setData({ sceneReady: true })
      this.triggerEvent('arstatus', {
        sceneReady: true,
        stage: 'camera-renderer-ready',
        message: 'XR 相机渲染器已启动 · 正在验证实时画面'
      })
    }
  }
})
