import uid from 'uid'

const validateLang = (lang) => (
  (lang === 'pt-BR' || lang === 'pt' || lang === 'pt-br')
    ? 'pt-BR' : null
)

class AvoidingCorona {
  constructor() {
    this.nodes = {}
    this.searchableNodes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'figcaption', 'a', 'span']
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

  changeNode(node) {
    // console.log('getNodeList', node.coronaUid)
    const { placeholder } = this.langMessages
    if (!node.coronaUid) {

      const newId = uid()
      node.coronaUid = newId // eslint-disable-line no-param-reassign
      this.nodes[newId] = node

      const { childNodes } = node
      for (const childNode of childNodes) {
        if (childNode.nodeName === '#text') {
          let text = childNode.textContent
          const matchArray = text.match(/(corona(\s*)v[í,i]rus)*(covid([-, /s])*19)*/gi)
          const matchedStrings = matchArray.filter(
            (match, index) => match && matchArray.indexOf(match) === index,
          )
          if (matchedStrings.length) {
            for (const matchedString of matchedStrings) {
              text = text.replace(matchedString, placeholder)
            }
            childNode.textContent = text // eslint-disable-line no-param-reassign
          }
        }
      }
    }
  }

  getNodeList() {
    const nodes = document.querySelectorAll(this.searchableNodes.join(','))
    nodes.forEach((node) => {
      this.changeNode(node)
    })
  }

  onDomChanges(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes) {
        this.getNodeList()
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
