import ChatStyleVariables from "../styles/chat"

class ChatButton {
  private shadowRoot: ShadowRoot
  private buttonElement!: HTMLButtonElement
  private clickCallback: ((event: Event) => void) | null = null

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot
  }

  public initChatButton(): ChatButton {
    this.generateButtonStyle()
    this.createButtonElement()
    this.attachClickEventListener()
    return this
  }

  public render(): ChatButton {
    this.shadowRoot.appendChild(this.buttonElement)
    return this
  }

  public onClick(callback: (event: Event) => void): ChatButton {
    this.clickCallback = callback
    return this
  }

  public triggerClickEvent(): ChatButton {
    const clickEvent = new Event("customClick", {
      bubbles: true,
      composed: true,
    })
    this.buttonElement.dispatchEvent(clickEvent)
    if (this.clickCallback) {
      this.clickCallback(clickEvent)
    }
    return this
  }

  private generateButtonStyle(): ChatButton {
    const styleElement = document.createElement("style")
    styleElement.textContent = ChatStyleVariables.chat_button
    this.shadowRoot.appendChild(styleElement)
    return this
  }

  private createButtonElement(): ChatButton {
    this.buttonElement = document.createElement("button")
    this.buttonElement.className = "chat-button"
    this.buttonElement.innerHTML = `
      <span>Click</span>
    `
    return this
  }

  private attachClickEventListener(): ChatButton {
    this.buttonElement.addEventListener("click", () => {
      this.triggerClickEvent()
    })
    return this
  }
}

export default ChatButton
