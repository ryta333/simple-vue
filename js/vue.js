class Vue {
  constructor(options) {
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el;
    this._proxyData(options.data);
    new Observer(this.$data);
    new Complier(this);
  }
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      // 将data中的属性注入到vue实例中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(val) {
          if (val === data[key]) {
            return;
          }
          data[key] = val;
        },
      });
    });
  }
  $set() {}
}
