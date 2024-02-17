import ChatStyleVariables from '../styles/chat'

class ChatButton {
  private shadowRoot: ShadowRoot
  private buttonElement!: HTMLButtonElement
  private clickCallback: ((event: Event) => void) | null = null

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot
  }

  public initChatButton() {
    this.generateButtonStyle()
    this.createButtonElement()
    this.attachClickEventListener()
  }

  public render() {
    this.shadowRoot.appendChild(this.buttonElement)
  }

  public onClick(callback: (event: Event) => void) {
    this.clickCallback = callback
  }

  public triggerClickEvent() {
    const clickEvent = new Event('customClick', {
      bubbles: true,
      composed: true
    })
    this.buttonElement.dispatchEvent(clickEvent)
    if (this.clickCallback) {
      this.clickCallback(clickEvent)
    }
  }

  private generateButtonStyle() {
    const styleElement = document.createElement('style')
    styleElement.textContent = ChatStyleVariables.chat_button
    this.shadowRoot.appendChild(styleElement)
  }

  private createButtonElement() {
    this.buttonElement = document.createElement('button')
    this.buttonElement.className = 'chat-button'
    this.buttonElement.innerHTML = `
      <span>Click</span>
    `
  }

  private attachClickEventListener() {
    this.buttonElement.addEventListener('click', () => {
      this.triggerClickEvent()
    })
  }
}

export default ChatButton
