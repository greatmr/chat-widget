import ChatStyleVariables from "../styles/chat"
import ChatApp from "./chat-app"
import ChatInitializer from "./chat-initializer"

class ChatWidget extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: "open" })

    const chatBox: HTMLDivElement = document.createElement("div")
    chatBox.className = "chat-box"

    const chatInitializer = new ChatInitializer()
    shadowRoot!.appendChild(chatInitializer.appendHTML())

    this.appendStylesheet(shadowRoot)

    new ChatApp(shadowRoot)
  }

  public appendStylesheet(shadowRoot: ShadowRoot) {
    const styleElement = document.createElement("style")
    styleElement.textContent = ChatStyleVariables.chat
    shadowRoot.appendChild(styleElement)
  }
}

export default ChatWidget
