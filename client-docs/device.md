# Device API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`DeviceInfo`](#deviceinfo)
  - [`SyncExchangeInfo`](#syncexchangeinfo)
  - [`SyncState`](#syncstate)

- [Methods](#methods)

  - [`get`](#get)
  - [`getAll`](#getall)

- [Events](#events)
  - [`'connect'`](#connect)
  - [`'disconnect'`](#disconnect)
  - [`'info'`](#info)
  - [`'sync'`](#sync)

## Description

Exposes interface for getting information about discovered devices and subscribing to device info and sync state changes.

## Types

### `DeviceInfo`

Information about a discovered device or a device in a project. Potential shape could be:

```ts
type DeviceInfo = {
  id: string;
  deviceId: string;
  name?: string;
  lastSynced: number;
  lastSeen: number;
};
```

**_TODO: Figure out shape of `DeviceInfo` (see [ref](https://github.com/digidem/mapeo-core-next/blob/b95bfbfcac7bc9ad68181cfa4b86047c46c8fb4a/lib/authstore/authtypes.js#L65))_**

### `SyncExchangeInfo`

Information about the amount of data that a peer wants and has relative to another (e.g. yourself). Potential shape could be:

```ts
type SyncExchangeInfo = {
  // Number of bytes that the peer has that you want
  has: number;
  // Number of bytes that the peer wants that you have
  wants: number;
};
```

### `SyncState`

Information about the sync state of a peer relative to another (e.g. yourself). Potential shape could be:

```ts
type SyncState = {
  // Peer id
  id: string;
  // Sync exchange info for database records
  db: SyncExchangeInfo;
  // Sync exchange info for media
  media: SyncExchangeInfo;
  // Snapshot of the sync exchange info when the sync started
  atSyncStart: {
    timestamp: string;
    db: SyncExchangeInfo;
    media: SyncExchangeInfo;
  };
  // The last time a sync completed
  lastCompletedAt: string;
  // Populated if an error occurred when trying to sync
  syncError: {
    timestamp: string;
    error: string;
  } | null;
  // Populated if an error occurrred when trying to connect to peer
  connectionError: {
    timestamp: string;
    error: string;
  } | null;
};
```

## Methods

### `get`

`(id: string) => Promise<DeviceInfo | null>`

Retrieve info about a discovered device with the provided `id`.

```ts
const device = mapeo.$device.get("abc123");
```

### `getAll`

`(opts?: {}) => Promise<DeviceInfo[]>`

Get all discovered devices. Can use `opts` to filter the results.

```ts
const devices = await mapeo.$device.getAll();
```

**_TODO: Is the description of this method accurate?_**

**_TODO: What does `opts` look like?_**

## Events

### `'connect'`

`(info: DeviceInfo) => void`

Emits when a peer connects.

```ts
mapeo.$device.on("connect", (info: DeviceInfo) => {
  console.log(`Device with id ${info.id} connected`);
});
```

**_TODO: Should the payload include more than just `DeviceInfo`?_**

### `'disconnect'`

`(info: DeviceInfo) => void`

Emits when a peer disconnects.

```ts
mapeo.$device.on("disconnect", (info: DeviceInfo) => {
  console.log(`Device with id ${info.id} disconnected`);
});
```

**_TODO: Should the payload include more than just `DeviceInfo`?_**

### `'info'`

`(info: DeviceInfo) => void`

Emits when information about a peer changes.

```ts
mapeo.$device.on("info", (info: DeviceInfo) => {
  // Use updated device information in some way...
});
```

**_TODO: Improve description_**

**_TODO: Improve usage example_**

### `'sync'`

`(state: SyncState) => void`

Emits when ongoing sync is occurring with a peer.

```ts
mapeo.$device.on("sync", (state: SyncState) => {
  // Check for sync errors
  if (state.syncError) {
    // Handle sync error...
    return;
  }

  // Check for connection errors
  if (state.connectionError) {
    // Handle connection error...
    return;
  }

  let gaveEverything = false;
  let receivedEverything = false;

  // They have given everything that we wanted
  if (state.db.has === 0 && state.media.has === 0) {
    gaveEverything = true;
  }

  // They have received everything that they wanted
  if (state.db.want === 0 && state.media.want === 0) {
    receivedEverything = true;
  }

  if (gaveEverything && receivedEverything) {
    console.log("Sync basically done!");
  }
});
```

**_TODO: Should there be a separate event for when sync is done?_**
