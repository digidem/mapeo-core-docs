# Sync API

## Table Contents

- [Description](#description)
- [Ongoing Questions](#ongoing-questions)
- [Types](#types)

  - [`ConnectionType`](#connectiontype)
  - [`SyncInfo`](#syncinfo)

- [Methods](#methods)

  - [`start`](#start)
  - [`stop`](#stop)
  - [`info`](#info)
  - [`enableDiscovery`](#enablediscovery)
  - [`disableDiscovery`](#disablediscovery)
  - [`enableSync`](#enablesync)
  - [`disableSync`](#disablesync)

## Description

Provides an imperative API for managing project discovery and sync strategies.

## Ongoing Questions

- Consider removing the `$` namespace prefix

## Types

### `ConnectionType`

Represents the connection type used for discovery or sync.

```ts
type ConnectionType = "lan" | "internet";
```

### `SyncInfo`

Information about the kind of sync that is enabled.

```ts
type SyncInfo = {
  discovery: ConnectionType[];
  sync: ConnectionType[];
};
```

## Methods

### `start`

`(opts: {}) => Promise<void>`

Start broadcasting to peers.

```ts
// Start listening and broadcasting to other devices
await mapeo.$sync.start({ ... })
```

**_TODO: What opts are relevant?_**

**_TODO: Is it useful to return info about the subscription? (similar to `.info` return value)_**

### `stop`

`(opts: {}) => Promise<void>`

Stop broadcasting to peers.

```ts
// Start listening and broadcasting to other devices
await mapeo.$sync.start({ ... })

// Stop listening and broadcasting
await mapeo.$sync.stop({ ... })
```

**_TODO: Any relevant opts?_**
**_TODO: Does it need to return anything?_**

### `info`

`() => Promise<SyncInfo>`

Get information about discovery and sync connection types that are enabled.

```ts
// logs "{ discovery: [], sync: [] }"
console.log(await mapeo.$sync.info());

await mapeo.$sync.enableDiscovery(["internet", "lan"]);

// logs "{ discovery: ["internet", "lan"], sync: [] }"
console.log(await mapeo.$sync.info());
```

### `enableDiscovery`

`(connectionTypes: ConnectionType[]) => Promise<void>`

Update the discovery connection types to enable.

```ts
// Enable discovery using only internet
await mapeo.$sync.enableDiscovery(["internet"]);

console.log(await mapeo.$sync.info().discovery); // logs ["internet"]

// Enable both internet and lan discovery
await mapeo.$sync.enableDiscovery(["lan"]);

console.log(await mapeo.$sync.info().discovery); // logs ["internet", "lan"]
```

**_TODO: Should `connectionTypes` override or merge existing value?_**

### `disableDiscovery`

`(connectionTypes: ConnectionType[]) => Promise<void>`

Update the discovery connection types to disable.

```ts
// Enable discovery using both internet and lan
await mapeo.$sync.enableDiscovery(["internet", "lan"]);

console.log(await mapeo.$sync.info().discovery); // logs ["internet", "lan"]

// Disable lan discovery
await mapeo.$sync.disableDiscovery(["lan"]);

console.log(await mapeo.$sync.info().discovery); // logs ["internet"]
```

**_TODO: Should `connectionTypes` override or merge existing value?_**

**_TODO: What happens to sync when you completely disable discovery?_**

### `enableSync`

`(connectionTypes: ConnectionType[]) => Promise<void>`

Update the sync connection types to enable.

```ts
// Enable sync using only internet for sync
await mapeo.$sync.enableSync(["internet"]);

console.log(await mapeo.$sync.info().sync); // logs ["internet"]

// Enable both internet and lan sync
await mapeo.$sync.enableSync(["lan"]);

console.log(await mapeo.$sync.info().sync); // logs ["internet", "lan"]
```

**_TODO: Should `connectionTypes` override or merge existing value?_**

**_TODO: What happens when `enableDiscovery` hasn't been called yet?_**

### `disableSync`

`(connectionTypes: ConnectionType[]) => Promise<void>`

Update the sync connection types to disable.

```ts
// Enable sync using both internet and lan
await mapeo.$sync.enableSync(["internet", "lan"]);

console.log(await mapeo.$sync.info().sync); // logs ["internet", "lan"]

// Disable lan sync
await mapeo.$sync.disableSync(["lan"]);

console.log(await mapeo.$sync.info().sync); // logs ["internet"]
```

**_TODO: Should `connectionTypes` override or merge existing value?_**
