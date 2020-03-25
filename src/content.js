const validateLang = (lang) => (
  (lang === 'pt-BR' || lang === 'pt' || lang === 'pt-br')
    ? 'pt-BR' : null
)

class AvoidingCorona {
  constructor() {
    this.nodes = []
    this.searchableNodes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']
    this.messages = {
      'pt-BR': {
        placeholder: 'Frescura',
      },
    }
  }

  get langMessages() {
    const lang = document.querySelector('[lang]')
    const language = lang && validateLang(lang.getAttribute('lang'))

    const msgs = this.messages[language]
    return (language && msgs) ? msgs : null
  }

  appendNode(node) {
    // check if node has corona_UID and if this id is present on nodeList
    // if not append corona_UID to node object and set it on node list
  }

  // filterCoronaNodes(nodes) {
  //   const { placeholder } = this.langMessages

  //   for (const node of nodes) {
  //     let text = node.innerText

  //     // TODO: remove all graphs and make it case insensetive
  //     console.log(text)
  //     text = text
  //       .replace(/coronavírus/ig, placeholder)
  //       .replace(/coronavirus/ig, placeholder)
  //       .replace(/covid-19/ig, placeholder)

  //     console.log('node', text)
  //     node.innerText = text
  //   }
  // }

  updateNodeList() {
    console.log('updateNodeList', this.nodes)

    const nodes = document.querySelectorAll(this.searchableNodes.join(','))
    console.log('updateNodeList', nodes)
    // console.log('lang', langMessages)
    // const coronaNodes = this.filterCoronaNodes(nodes)
    // console.log('coronaNodes', coronaNodes)
  }

  onDomChanges(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes) {
        this.updateNodeList()
      }
    }
  }

  init() {
    const { langMessages } = this
    console.log('langMessages', langMessages)

    if (langMessages) {
      // @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
      const observer = new MutationObserver((mutationList) => this.onDomChanges(mutationList))
      observer.observe(document.body, { childList: true, subtree: true })
    }
  }
}

new AvoidingCorona().init()
