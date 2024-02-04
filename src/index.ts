import ChatWidget from "./components/chat-widget"

export {}

declare global {
  interface Window {
    ChatWidget: typeof ChatWidget
  }
}

customElements.define("chat-widget", ChatWidget)

const ChatWidgetElement: ChatWidget = new ChatWidget()
document.body.appendChild(ChatWidgetElement)

window.ChatWidget = ChatWidget

export default ChatWidget
