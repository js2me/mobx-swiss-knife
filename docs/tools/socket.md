# `Socket`

`Socket` is a typed wrapper around WebSocket. Unlike a direct `WebSocket`, `send()` can be called before the connection opens, and messages are sent after `open`. Incoming data is deserialized into `message`.

## Example: Notification Channel

```ts
import { createSocket } from "mobx-swiss-knife";

type Notification = { type: 'notification'; text: string };
type Command = { type: 'subscribe'; channel: string };

const socket = createSocket<void, Notification, Command>({
  url: 'wss://example.com/ws',
  deserializeInputMessage: (raw) => JSON.parse(raw) as Notification,
  serializeOutputMessage: (message) => JSON.stringify(message),
  reconnect: {
    enabled: true,
    timeout: 2000,
  },
});

socket.open();
socket.send({ type: 'subscribe', channel: 'news' });

console.log(socket.isOpen);
console.log(socket.message);

socket.close();
socket.destroy();
```

A message sent before the actual `OPEN` is placed in the internal queue. `destroy()` ends the lifecycle and cancels reconnect; call it when the owner is removed.

## URL with a Payload

```ts
const socket = createSocket<{ token: string }, Incoming, Outgoing>({
  url: ({ token }) => `wss://example.com/ws?token=${token}`,
});

socket.open({ token: auth.token });
```

## Properties

- `isOpen` — whether the connection is currently in the `OPEN` state.
- `message` — the last successfully parsed incoming message or `null`.
- `isReconnectEnabled` — whether reconnect is enabled.

## Methods and Options

- `open(payload?)` — open the connection; the payload is passed to the `url` function.
- `send(message)` — send or queue a message.
- `close(code?)` — close with the specified code; defaults to `1000`.
- `resendNotSentMessages()` — manually send the accumulated queue.
- `getSocketUrl(payload)` — get the final URL without opening the connection.
- `destroy()` — cancel the lifecycle.
- `reconnect: { enabled, timeout?, skipCodes? }` — reconnect; close codes `1001` and `1005` are skipped by default.
