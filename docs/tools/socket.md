# `Socket`

Simplifies working with `WebSocket` in an application. It is useful for chats, notifications, online statuses, and any scenario where you need to keep a live connection with the server.

## When to use

- When you want to open and close the connection from one place.
- When it is important to track whether the connection is currently open.
- When you want to safely send messages even during reconnects.

## What it can do

- Open and close the socket.
- Send messages and expose the latest incoming message.
- Support reconnect behavior when it is enabled in the configuration.

## Usage example

```ts
import { createSocket } from "mobx-swiss-knife";

const socket = createSocket({
  url: "wss://example.com/ws",
  reconnect: {
    enabled: true,
  },
});

socket.open();

socket.send({
  type: "ping",
});

console.log(socket.isOpen);
console.log(socket.message);

socket.close();
socket.destroy();
```