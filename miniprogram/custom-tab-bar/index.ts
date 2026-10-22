Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        icon: '⌂'
      },
      {
        pagePath: 'pages/products/index',
        text: '选窗帘',
        icon: '▤'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        icon: '♡'
      }
    ]
  },

  methods: {
    switchTab(e: WechatMiniprogram.TouchEvent) {
      const index = Number(e.currentTarget.dataset.index);
      const item = this.data.list[index];
      console.log(item)
      if (!item || index === this.data.selected) return;

      wx.switchTab({
        url: `/${item.pagePath}`
      });
    }
  }
});