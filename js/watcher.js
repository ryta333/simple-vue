class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    Dep.target = this;
    this.oldVal = vm[key];
    Dep.target = null;
  }
  update() {
    let newVal = this.vm[this.key];
    if (this.oldVal === newVal) return;
    this.cb(newVal);
  }
}
