class TextReplacer {
  constructor() {
    this.nodes = []
    this.listOfTextElm = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']
  }

  // TODO: get lang

  // findAllNodes() {
  //     const listOfTextElm = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
  //     const nodes = document.querySelectorAll(listOfTextElm.join(','));

  //     this.nodes = [...this.nodes,  ...nodes];

  //     // console.log('this.nodes', this.nodes);
  //     const placeholder = 'Frescura';

  //     for (const node of this.nodes) {
  //         let text = node.innerText;

  //         // TODO: remove all graphs and make it case insensetive
  //         console.log(text);
  //         text = text
  //             .replace(/coronavírus/ig, placeholder)
  //             .replace(/coronavirus/ig, placeholder)
  //             .replace(/covid-19/ig, placeholder);

  //         console.log('node', text);
  //         node.innerText = text;
  //     }
  // }

  setNodes() {
    console.log('hello', this.listOfTextElm)
  }

  init() {
    this.setNodes()
  }
}

new TextReplacer().init()
