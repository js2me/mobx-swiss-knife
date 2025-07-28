# `Socket`  

Tool for `WebSocket` usage.

## Usage  

```ts
import { Socket, createSocket } from "mobx-swiss-knife";
import { reaction } from "mobx";

const socket = new Socket({
  url: 'wss:/api.com/api/v1/ws',
});
const socket = createSocket({
  url: 'wss:/api.com/api/v1/ws',
});

socket.open();

socket.resendNotSentMessages();
socket.message; //
socket.isOpen; //
socket.isReconnectEnabled; //

```