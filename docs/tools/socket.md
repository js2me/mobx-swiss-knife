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

## Constructor parameters

- `url` — WebSocket URL or a function that returns the URL from the payload passed to `open()`.
- `defaultCloseCode` — Default close code used by `close()`.
- `protocols` — WebSocket subprotocols.
- `abortSignal` — Stops the internal lifecycle when destroyed.
- `serializeOutputMessage` — Custom serializer for outgoing messages.
- `deserializeInputMessage` — Custom parser for incoming messages.
- `reconnect` — Reconnect settings such as enabling, timeout, and skipped close codes.

## Public properties

- `isOpen` — Shows whether the socket is currently open.
- `message` — Last successfully received message.
- `isReconnectEnabled` — Shows whether reconnect mode is enabled.

## Public methods

- `open(payload?)` — Opens the socket connection.
- `send(message)` — Sends a message immediately or queues it until the socket is open.
- `close(code?)` — Closes the current socket connection.
- `resendNotSentMessages()` — Sends messages that were queued while the socket was closed.
- `getSocketUrl(payload)` — Resolves the final URL used by the socket.
- `destroy()` — Stops the socket lifecycle.

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