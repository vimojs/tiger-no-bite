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
  lifetimes: {
    attached() {
      const component = this as any
      component.sceneReady = false
      startupTimer = setTimeout(() => {
        if (!component.sceneReady) {
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
      const component = this as any
      if (component.sceneReady) return
      if (startupTimer) clearTimeout(startupTimer)
      startupTimer = null
      // Keep readiness out of reactive component data: updating the host page
      // while XR-Frame owns the camera surface can cause the scene to repaint.
      component.sceneReady = true
      this.triggerEvent('arstatus', {
        sceneReady: true,
        stage: 'camera-renderer-ready',
        message: 'XR 相机渲染器已启动 · 正在验证实时画面'
      })
    },
    handleARReady(event: WechatMiniprogram.CustomEvent): void {
      const detail = event.detail
      console.info('[ar-curtain] AR session ready', detail)
      this.triggerEvent('arstatus', {
        stage: 'ar-ready',
        message: '相机已就绪'
      })
    },
    handleARError(event: WechatMiniprogram.CustomEvent): void {
      const detail = event.detail
      console.error('[ar-curtain] AR session error', detail)
      this.triggerEvent('arstatus', {
        stage: 'ar-error',
        message: 'AR 相机启动失败，请检查微信版本与相机权限',
        error: detail
      })
    }
  }
})
