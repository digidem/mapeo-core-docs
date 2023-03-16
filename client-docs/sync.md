# Sync API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`ConnectionType`](#connectiontype)
  - [`SyncInfo`](#syncinfo)

- [Methods](#methods)

  - [`info`](#info)
  - [`setDiscovery`](#setdiscovery)
  - [`setSync`](#setsync)

- [Events](#events)

  - [`'discovery:start'`](#discoverystart)
  - [`'discovery:stop'`](#discoverystop)
  - [`'sync:start'`](#syncstart)
  - [`'sync:stop'`](#syncstop)

## Description

Provides an imperative API for managing project discovery and sync strategies.

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

### `setDiscovery`

`(connectionTypes: ConnectionType[] | null) => Promise<void>`

Set the discovery connection types to enable. If `setDiscovery` has not been previously called with a valid connection type, discovery becomes enabled. If `connectionTypes` is `null` or `[]`, discovery becomes disabled. Do not rely on the resolving of this method to know when the process starts or stops. Instead, listen to the `'discovery:start'` and `'discovery:stop'` events.

Note that there existing syncing processes with other peers happening, disabling discovery does not disable these immediately. Use `setSync` to handle this more explicitly.

```ts
// Enable discovery
await mapeo.$sync.setDiscovery(["internet", "lan"]);

// Only enable LAN discovery
await mapeo.$sync.setDiscovery(["lan"]);

// Disable discovery
await mapeo.$sync.setDiscovery(null);
```

### `setSync`

`(connectionTypes: ConnectionType[] | null) => Promise<void>`

Set the sync connection types to enable. If `setSync` has not been previously called with a valid connection type, sync becomes enabled. If `connectionTypes` is `null` or `[]`, sync becomes disabled. Do not rely on the resolving of this method to know when the process starts or stops. Instead, listen to the `'sync:start'` and `'sync:stop'` events.

Note that there existing syncing processes with other peers happening, disabling sync does not close these immediately. The server will attempt to gracefully finish or close them and eventually emit the `'sync:stop'` event.

```ts
// Enable sync
await mapeo.$sync.setSync(["internet", "lan"]);

// Only enable LAN sync
await mapeo.$sync.setSync(["lan"]);

// Disable sync
await mapeo.$sync.setSync(null);
```

## Events

### `'discovery:start'`

`() => void`

Emits when discovery is enabled.

```ts
mapeo.$sync.on("discovery:start", () => {
  console.log("Now seeking new peers");
});
```

### `'discovery:stop'`

`() => void`

Emits when discovery is disabled.

```ts
mapeo.$sync.on("discovery:stop", () => {
  console.log("No longer seeking new peers");
});
```

### `'sync:start'`

`() => void`

Emits when sync is enabled.

```ts
mapeo.$sync.on("sync:start", () => {
  console.log("Now allowing sync");
});
```

### `'sync:stop'`

`() => void`

Emits when sync is disabled.

```ts
mapeo.$sync.on("sync:stop", () => {
  console.log("No longer allowing sync");
});
```
