import uid from 'uid'

const validateLang = (lang) => (
  (lang === 'pt-BR' || lang === 'pt' || lang === 'pt-br')
    ? 'pt-BR' : null
)

const checkOnlist = (list, string) => {
  const lowerString = string.toLowerCase()
  const [originalItem, toReplace] = Object.entries(list)
    .find(([item]) => lowerString.indexOf(item.toLowerCase()) !== -1) || []

  return originalItem && string.replace(new RegExp(originalItem, 'gi'), toReplace)
}

function getRandomInt(min, max) {
  const minNum = Math.ceil(min)
  const maxNum = Math.floor(max)

  return Math.floor(Math.random() * (maxNum - minNum)) + minNum
}


class AvoidingCorona {
  constructor() {
    this.nodes = {}
    this.searchableNodes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'figcaption', 'a', 'span', 'strong', 'b', 'i', 'div']
    this.messages = {
      'pt-BR': {
        placeholder: [
          {
            quote: '~frescura~',
            gender: 'f',
          }, {
            quote: '~gripezinha~',
            gender: 'f',
          }, {
            quote: '~histeria~',
            gender: 'f',
          }, {
            quote: '~delírio coletivo~',
            gender: 'm',
          },
        ],
        oppositeGenderMap: {
          m: 'f',
          f: 'm',
        },
        genderRegex: {
          m: /os*$/gm,
          f: /as*$/gm,
        },
        blacklist: {
          m: {},
          f: {
            'o novo': 'a nova',
            novo: 'nova',
          },
        },
        prepsAndArticles: {
          m: {
            o: 'a',
            os: 'as',
            ao: 'a',
            aos: 'as',
            do: 'da',
            dos: 'das',
            no: 'na',
            nos: 'nas',
            pelo: 'pela',
            pelos: 'pelas',
            num: 'numa',
            nuns: 'numas',
          },
          f: {
            a: 'o',
            as: 'os',
            à: 'ao',
            às: 'aos',
            da: 'do',
            das: 'dos',
            na: 'no',
            nas: 'nos',
            pela: 'pelo',
            pelas: 'pelos',
            numas: 'nums',
            numa: 'num',
          },
          n: {
            de: 'de',
            por: 'por',
            e: 'e',
            ou: 'ou',
          },
        },
      },
    }
  }

  get langMessages() {
    const lang = document.querySelector('[lang]')
    const language = lang && validateLang(lang.getAttribute('lang'))

    const msgs = this.messages[language]
    return (language && msgs) ? msgs : null
  }

  replaceText(anchor, string) {
    const {
      placeholder, prepsAndArticles, oppositeGenderMap, genderRegex, blacklist,
    } = this.langMessages

    const placeholderIndex = getRandomInt(0, placeholder.length) || 0
    const { quote, gender } = placeholder[placeholderIndex]

    const oppositeGender = oppositeGenderMap[gender]

    const startsWithAnchor = !string.replace(/^\W*/, '').search(anchor)
    if (startsWithAnchor) return string.replace(anchor, quote)

    const stringArray = string.replace(/[,."';:]/g, '').split(/\s/).filter((x) => x)
    const anchorIndex = stringArray.indexOf(anchor)
    const wordBefore = (stringArray[anchorIndex - 1] || '').toLowerCase()

    const matchGender = prepsAndArticles[gender][wordBefore]
    if (matchGender) return string.replace(new RegExp(anchor, 'gi'), quote)

    const matchBlacklist = checkOnlist(blacklist[gender], string)
    if (matchBlacklist) return matchBlacklist.replace(anchor, quote)

    const matchOtherGenders = (
      prepsAndArticles[oppositeGender][wordBefore]
      || prepsAndArticles.n[wordBefore]
    )
    if (matchOtherGenders) return string.replace(new RegExp(`${wordBefore} ${anchor}`, 'gi'), `${matchOtherGenders} ${quote}`)

    const wordMatchGender = genderRegex[gender].exec(wordBefore)
    if (wordMatchGender) return string.replace(new RegExp(anchor, 'gi'), quote)

    return string.replace(anchor, quote)
  }

  changeNode(node) {
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
              text = this.replaceText(matchedString, text)
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

    this.getNodeList()

    if (langMessages) {
      // @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
      const observer = new MutationObserver((mutationList) => this.onDomChanges(mutationList))
      observer.observe(document.body, { childList: true, subtree: true })
    }
  }
}

new AvoidingCorona().init()
