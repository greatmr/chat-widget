import ChatButton from './button'

const DEFAULT_MESSAGES = [
  "Hi there, I'm Fabio and you?",
  'Nice to meet you',
  'How are you?',
  'Not too bad, thanks',
  'What do you do?',
  "That's awesome",
  'Codepen is a nice place to stay',
  "I think you're a nice person",
  'Why do you think that?',
  'Can you explain?',
  "Anyway I've gotta go now",
  'It was a pleasure chat with you',
  'Time to make a new codepen',
  'Bye',
  ':)'
]

class ChatApp {
  public shadowRoot: ShadowRoot
  private messages: HTMLElement
  private ChatButtonComponent: InstanceType<typeof ChatButton>
  private d: Date
  private h: number
  private m: number
  private i: number
  private msg: string
  private fakeMessages: string[]

  constructor(shadowRoot: ShadowRoot) {
    this.ChatButtonComponent = new ChatButton(shadowRoot)
    this.shadowRoot = shadowRoot
    this.messages = this.shadowRoot.querySelector('.messages-content') as HTMLElement
    this.d = new Date()
    this.h = 0
    this.m = 0
    this.i = 0
    this.msg = ''
    this.fakeMessages = [...DEFAULT_MESSAGES]

    this.listeners()
  }

  private listeners() {
    this.ChatButtonComponent.initChatButton()
    this.ChatButtonComponent.render()

    this.ChatButtonComponent.onClick((event: Event) => {
      debugger
    })

    window.addEventListener('load', () => {
      this.messages = this.shadowRoot.querySelector('.messages-content') as HTMLElement

      setTimeout(() => {
        this.fakeMessage()
      }, 100)
    })

    this.shadowRoot.querySelector('.message-submit')?.addEventListener('click', () => {
      this.insertMessage()
    })

    window.addEventListener('keydown', (e) => {
      if (e.which === 13) {
        this.insertMessage()
        e.preventDefault()
      }
    })
  }

  private updateScrollbar() {
    this.messages.scrollTop = this.messages.scrollHeight
  }

  private setDate() {
    this.d = new Date()
    if (this.m !== this.d.getMinutes()) {
      this.m = this.d.getMinutes()
      const timestamp = document.createElement('div')
      timestamp.className = 'timestamp'
      timestamp.textContent = `${this.d.getHours()}:${this.m}`
      this.shadowRoot.querySelector('.message:last-child')?.appendChild(timestamp)
    }
  }

  private insertMessage() {
    this.msg = (this.shadowRoot.querySelector('.message-input') as HTMLInputElement).value

    if (this.msg.trim() === '') {
      return false
    }

    const newMessageNode = document.createElement('div')
    newMessageNode.className = 'message message-personal new'
    newMessageNode.textContent = this.msg
    this.messages.querySelector('.mCSB_container')?.appendChild(newMessageNode)
    this.setDate()
    ;(this.shadowRoot.querySelector('.message-input') as HTMLInputElement).value = ''
    this.updateScrollbar()
    setTimeout(
      () => {
        this.fakeMessage()
      },
      1000 + Math.random() * 20 * 100
    )
  }

  private fakeMessage() {
    if ((this.shadowRoot.querySelector('.message-input') as HTMLInputElement).value !== '') {
      return false
    }
    const loadingMessage = document.createElement('div')
    loadingMessage.className = 'message loading new'
    loadingMessage.innerHTML =
      '<figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure><span></span>'
    this.messages.querySelector('.mCSB_container')?.appendChild(loadingMessage)
    this.updateScrollbar()

    setTimeout(
      () => {
        this.messages.querySelector('.message.loading')?.remove()
        const newFakeMessage = document.createElement('div')
        newFakeMessage.className = 'message new'
        newFakeMessage.innerHTML = `<figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure>${
          this.fakeMessages[this.i]
        }`
        this.messages
          .querySelector('.mCSB_container')
          ?.appendChild(newFakeMessage)
          .classList.add('new')
        this.setDate()
        this.updateScrollbar()
        this.i++
      },
      1000 + Math.random() * 20 * 100
    )
  }
}

export default ChatApp
