# chat-widget

# Build the Docker image
```docker build -t static-chat-server .```

# Run the Docker container, mapping port 8585 to port 80
```docker run -p 8585:80 static-chat-server```