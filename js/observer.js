class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(obj, key, val) {
    this.walk(val);
    const dep = new Dep();
    
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        // 发送通知
        dep.notify();
      },
    });
  }
}
