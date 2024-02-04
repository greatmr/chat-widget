class ChatInitializer {
  constructor() {
    this.appendHTML()
  }

  public appendHTML() {
    const container = document.createElement("div")
    const chatContainer = document.createElement("div")
    chatContainer.className = "chat"
    chatContainer.innerHTML = `
        <div class="chat-title">
          <h1>Fabio Ottaviani</h1>
          <h2>Supah</h2>
          <figure class="avatar">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" />
          </figure>
        </div>
        <div class="messages">
          <div class="messages-content mCustomScrollbar _mCS_1 mCS_no_scrollbar">
            <div class="mCSB_container"></div>
          </div>
        </div>
        <div class="message-box">
          <textarea type="text" class="message-input" placeholder="Type message..."></textarea>
          <button type="submit" class="message-submit">Send</button>
        </div>
      `

    const backgroundDiv = document.createElement("div")
    backgroundDiv.className = "bg"

    container.appendChild(chatContainer)
    container.appendChild(backgroundDiv)

    return container
  }
}

export default ChatInitializer
