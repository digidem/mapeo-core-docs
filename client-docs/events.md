# Events Reference

## Description

Consolidated list of events that are emitted from the server and can be subscribed to from the server or client.

## Table of Contents

- [`'device:connect'`](#deviceconnect)
- [`'device:disconnect'`](#devicedisconnect)
- [`'device:info'`](#deviceinfo)
- [`'device:sync'`](#devicesync)
- [`'discovery:start'`](#discoverystart)
- [`'discovery:stop'`](#discoverystop)
- [`'sync:start'`](#syncstart)
- [`'sync:stop'`](#syncstop)
- [`'invite:received'`](#invitereceived)
- [`'invite:accepted'`](#inviteaccepted)
- [`'invite:declined'`](#invitedeclined)

---

### `'device:connect'`

`(info: DeviceInfo) => void`

Emits when a peer connects.

```ts
mapeo.on("device:connect", (info: DeviceInfo) => {
  console.log(`Device with id ${info.id} connected`);
});
```

**_TODO: Should the payload include more than just `DeviceInfo`?_**

### `'device:disconnect'`

`(info: DeviceInfo) => void`

Emits when a peer disconnects.

```ts
mapeo.on("device:disconnect", (info: DeviceInfo) => {
  console.log(`Device with id ${info.id} disconnected`);
});
```

**_TODO: Should the payload include more than just `DeviceInfo`?_**

### `'device:info'`

`(info: DeviceInfo) => void`

Emits when information about a peer changes.

```ts
mapeo.on("device:info", (info: DeviceInfo) => {
  // Use updated device information in some way...
});
```

**_TODO: Improve description_**

**_TODO: Improve usage example_**

### `'device:sync'`

`(state: SyncState) => void`

Emits when ongoing sync is occurring with a peer.

```ts
mapeo.on("device:sync", (state: SyncState) => {
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

### `'discovery:start'`

`() => void`

Emits when discovery is enabled.

```ts
mapeo.on("discovery:start", () => {
  console.log("Now seeking new peers");
});
```

### `'discovery:stop'`

`() => void`

Emits when discovery is disabled.

```ts
mapeo.on("discovery:stop", () => {
  console.log("No longer seeking new peers");
});
```

### `'sync:start'`

`() => void`

Emits when sync is enabled.

```ts
mapeo.on("sync:start", () => {
  console.log("Now allowing sync");
});
```

### `'sync:stop'`

`() => void`

Emits when sync is disabled.

```ts
mapeo.on("sync:stop", () => {
  console.log("No longer allowing sync");
});
```

### `'invite:received'`

`(info: { id: string, project: Project, invitedBy: ProjectMember, role: ProjectRole }) => void`

Listen to events emitted when a peer invites you to a project.

```ts
mapeo.on("invite:received", (info) => {
  const { id, project, invitedBy, role } = info;
  console.log(`Invite id is: ${id}`);
  console.log(`You are invited to project: ${project.name || project.id}`);
  console.log(`Invited by: ${invitedBy.id}`);
  console.log(`If you accept, your role will be: ${role}`);
  // We're adamant about being a coordinator...
  if (role === "coordinator") {
    mapeo.$projectsManagement.invite.accept(id, {...});
  } else {
    mapeo.$projectsManagement.invite.decline(id, {...});
  }
});
```

### `'invite:accepted'`

`(id: string, info: { role: ProjectRole }) => void`

Emits when an invited peer has accepted an invitation to join the project. `info` represents information about the invitation that was sent, such as the role.

```ts
mapeo.on("invite:accepted", async (id, info) => {
  console.log(`${id} accepted invite to be ${info.role}`);
  // Should be able to retrieve the project member now
  const member = await mapeo.$project.member.get(id);
});
```

**_TODO: should it be possible to get the member at this point, or should this be responsible for explicitly adding the member to the project? i.e. calling `addMember` in the callback body?_**

### `'invite:declined'`

`(id: string, info: { role: ProjectRole }) => void`

Listen to events that are emitted when an invited peer has declined an invitation to join the project. `info` represents information about the invitation that was sent, such as the role.

```ts
mapeo.on("invite:declined", (id, info) => {
  console.log(`${id} declined invite to be ${info.role}`);
});
```

**_TODO: what other things should be included in `info`?_**
