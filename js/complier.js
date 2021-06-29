class Complier {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.update = {
      text: (node, key) => {
        node.textContent = this.vm[key];
        new Watcher(this.vm, key, newVal => {
          node.textContent = newVal;
        });
      },
      model: (node, key) => {
        node.value = this.vm[key];
        node.addEventListener('input', () => {
          this.vm[key] = node.value;
        });
        new Watcher(this.vm, key, newVal => {
          node.value = newVal;
        });
      },
    };
    this.compile(this.el);
  }
  // 编译模板, 处理文本节点
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      }

      if (node.childNodes && node.childNodes.length) this.compile(node);
    });
  }
  // 处理元素节点
  compileElement(node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2);
        const key = attr.value;
        this.update[attrName] && this.update[attrName](node, key);
      }
    });
  }
  // 处理文本节点
  compileText(node) {
    let reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);

      // 创建Watcher
      new Watcher(this.vm, key, newVal => {
        node.textContent = newVal;
      });
    }
  }
  // 判断是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }
  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
