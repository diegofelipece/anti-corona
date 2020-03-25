import uid from 'uid'

const validateLang = (lang) => (
  (lang === 'pt-BR' || lang === 'pt' || lang === 'pt-br')
    ? 'pt-BR' : null
)

class AvoidingCorona {
  constructor() {
    this.nodes = {}
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
    // console.log('updateNodeList', node.coronaUid)
    const { placeholder } = this.langMessages

    if (!node.coronaUid) {
      const newId = uid()
      node.coronaUid = newId // eslint-disable-line no-param-reassign
      this.nodes[newId] = node

      let text = node.innerText
      const matchArray = text.match(/(corona(\s*)v[í,i]rus)*(covid([-, /s])*19)*/gi)
      const matchedStrings = matchArray.filter(
        (match, index) => match && matchArray.indexOf(match) === index,
      )

      if (matchedStrings.length) {
        for (const matchedString of matchedStrings) {
          text = text.replace(matchedString, placeholder)
        }
        node.innerText = text // eslint-disable-line no-param-reassign
      }
    }
  }

  updateNodeList() {
    const nodes = document.querySelectorAll(this.searchableNodes.join(','))
    nodes.forEach((node) => this.appendNode(node))
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
    // console.log('langMessages', langMessages)

    if (langMessages) {
      // @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
      const observer = new MutationObserver((mutationList) => this.onDomChanges(mutationList))
      observer.observe(document.body, { childList: true, subtree: true })
    }
  }
}

new AvoidingCorona().init()
