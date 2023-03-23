# Events Reference

## Description

Consolidated list of events that are emitted from the server and can be subscribed to from the server or client.

## Table of Contents

- [Types](#types)

  - [`Peer`](#peer)
  - [`SyncExchangeInfo`](#syncexchangeinfo)
  - [`SyncState`](#syncstate)

- [Events](#events)
  - [`'peer-connect'`](#peer-connect)
  - [`'peer-disconnect'`](#peer-disconnect)
  - [`'peer-info'`](#peer-info)
  - [`'peer-sync'`](#peer-sync)
  - [`'discovery-start'`](#discovery-start)
  - [`'discovery-stop'`](#discovery-stop)
  - [`'sync-start'`](#sync-start)
  - [`'sync-stop'`](#sync-stop)
  - [`'invite-received'`](#invite-received)
  - [`'invite-accepted'`](#invite-accepted)
  - [`'invite-declined'`](#invite-declined)

---

## Types

### `Peer`

Information about a discovered peer or a project peer.

```ts
type Peer = {
  id: string;
  name: string | null;
  lastSynced: string;
  lastSeen: string`;
};
```

### `SyncExchangeInfo`

Information about the amount of data that a peer wants and has relative to another (e.g. yourself).

```ts
type SyncExchangeInfo = {
  has: number;
  wants: number;
};
```

### `SyncState`

Information about the sync state of a peer relative to another (e.g. yourself).

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

### `InviteInfo`

Information about an invite that has been sent, received, accepted, or declined.

```ts
type Invite = {
  id: string;
  project: {
    id: string;
    name: string | null;
  };
  from: {
    id: string;
    name: string | null;
  };
  role: ProjectRole;
};
```

## Events

### `'peer:connect'`

`(peer: Peer) => void`

Emits when a peer connects.

```ts
mapeo.on("peer-connect", (peer) => {
  console.log(`Peer with id ${peer.id} connected`);
});
```

### `'peer-disconnect'`

`(peer: Peer) => void`

Emits when a peer disconnects.

```ts
mapeo.on("peer-disconnect", (peer) => {
  console.log(`Device with id ${peer.id} disconnected`);
});
```

### `'peer-info'`

`(peer: Peer) => void`

Emits when information about a peer changes.

```ts
mapeo.on("peer-info", (peer) => {
  // Use updated peer in some way...
});
```

**_TODO: Improve description_**

**_TODO: Improve usage example_**

### `'peer-sync'`

`(state: SyncState) => void`

Emits when ongoing sync is occurring with a peer.

```ts
mapeo.on("peer-sync", (state) => {
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

### `'discovery-start'`

`() => void`

Emits when discovery is enabled.

```ts
mapeo.on("discovery-start", () => {
  console.log("Now seeking new peers");
});
```

### `'discovery-stop'`

`() => void`

Emits when discovery is disabled.

```ts
mapeo.on("discovery-stop", () => {
  console.log("No longer seeking new peers");
});
```

### `'sync-start'`

`() => void`

Emits when sync is enabled.

```ts
mapeo.on("sync-start", () => {
  console.log("Now allowing sync");
});
```

### `'sync-stop'`

`() => void`

Emits when sync is disabled.

```ts
mapeo.on("sync-stop", () => {
  console.log("No longer allowing sync");
});
```

### `'invite-received'`

`(invite: InviteInfo) => void`

Listen to events emitted when a peer invites you to a project. `invite.from` represents information about the peer that sent the invite.

```ts
mapeo.on("invite-received", (invite) => {
  console.log(`Invite id is: ${invite.id}`);
  console.log(`You are invited to project: ${invite.project.name || invite.project.id}`);
  console.log(`Invited by: ${invite.from.id}`);
  console.log(`If you accept, your role will be: ${invite.role}`);

  // We're adamant about being a coordinator...
  if (invite.role === "coordinator") {
    mapeo.$projectsManagement.invite.accept(invite.id, {...});
  } else {
    mapeo.$projectsManagement.invite.decline(invite.id, {...});
  }
});
```

### `'invite-accepted'`

`(info: InviteInfo) => void`

Emits when an invited peer has accepted an invitation to join the project. `info.from` field represents information about the peer that accepted the invite.

```ts
mapeo.on("invite-accepted", (info) => {
  console.log(`${info.id} accepted invite to be ${info.role}`);
});
```

**_TODO: Will the accepting peer already be added to the project at this point? Or will that need to be handled here using `project.member.add()`?_**

### `'invite-declined'`

`(info: InviteInfo) => void`

Listen to events that are emitted when an invited peer has declined an invitation to join the project. `info.from` represents information about the peer that declined the invite.

```ts
mapeo.on("invite-declined", (info) => {
  console.log(`${info.id} declined invite to be ${info.role}`);
});
```
