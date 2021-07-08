---
title: Instantiating the client
sidebar_position: 1
---

The following example demonstrates how to import and instantiate the Mapeo Core client.

```js
import { MapeoClient } from '@mapeo/client'

const mapeo = new MapeoClient()
```

### Connecting and disconnecting

`MapeoClient` connects and disconnects to the Mapeo Core database using the following two methods:

- `$connect()`
- `$disconnect()`

## `$connect()`

```ts
const onmessage: (message: any) => void =
  mapeo.$connect(postMessage: (message: any) => void)
```

Connect the client to the backend via postMessage and onmessage handlers. For example, to connect using a [`MessagePort`](http://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API):

```ts
const mapeo = new MapeoClient()

const { port1, port2 } = new MessageChannel()

const onmessage = mapeo.$connect(msg => port1.postMessage(msg))
port1.onmessage = e => onmessage(e.data)
```

## `$disconnect()`

Disconnect the Mapeo client from the onmessage and postMessage handlers.
