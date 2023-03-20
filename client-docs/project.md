# Project API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`Project`](#project)
  - [`ProjectRole`](#projectrole)
  - [`ProjectMember`](#projectmember)

- [Methods](#methods)

  - [`info`](#info)

  - [`member`](#member)

    - [`member.get`](#memberget)
    - [`member.getMany`](#membergetmany)
    - [`member.add`](#memberadd)
    - [`member.remove`](#memberremove)
    - [`member.update`](#memberupdate)

  - [`invite`](#invite)

    - [`invite.create`](#invitecreate)
    - [`invite.getMany`](#invitegetmany`)

- [Events](#events)

  - [`'invite:accepted'`](#inviteaccepted)
  - [`'invite:declined'`](#invitedeclined)

## Description

Exposes an interface for managing a projects' members and invites.

## Types

### `Project`

Information about the current project. Could potentially look like:

```ts
type Project = {
  id: string;
  name: string;
};
```

**_TODO: what other fields are relevant?_**

### `ProjectRole`

Information about the project role for a member. Could potentially look like:

```ts
type ProjectRole = "creator" | "coordinator" | "member";
```

**_TODO: should `non-member` be included here?_**

### `ProjectMember`

A member that is part of the project. Could potentially look like:

```ts
type ProjectMember = {
  id: string;
  name?: string;
  role: ProjectRole;
};
```

## Methods

### `info`

`() => Promise<Project>`

Get information about the current project.

```ts
const projectInfo = await mapeo.$project.info();
```

### `member`

Interface for managing a project's members.

#### `member.get`

`(id: string) => Promise<ProjectMember | null>`

Get information about a project member (including yourself).

```ts
const member = await mapeo.$project.member.get("abc123");
```

**_TODO: how do we get ourself?_**

#### `member.getMany`

`(opts: {}) => Promise<ProjectMember[]>`

Get all project members and information about each (including yourself).

```ts
const members = await mapeo.$project.member.getMany();
```

**_TODO: any `opts` needed?_**

#### `member.add`

`(id: string, info: {}) => Promise<ProjectMember>`

Add a member to the project. Throws if the member already exists or if the caller does not have the proper permissions. Resolves with the created member.

```ts
const memberPublicKey = 'abc123'
const memberInfo = {...}

const member = await mapeo.$project.member.add(memberPublicKey, memberInfo)
```

**_TODO: consolidate to single object param?_**

**_TODO: what’s needed in `info`?_**

**_TODO: should we not throw if member already exists?_**

#### `member.remove`

`(id: string) => Promise<void>`

Remove a member from the project. Throws if the member does not exist or if the caller does not have the proper permissions.

```ts
// Add the member
const member = await mapeo.$project.member.add('abc123', {...})

// Nevermind, time to remove the member
await mapeo.$project.member.remove(member.id)
```

**_TODO: should we not throw if member not found?_**

**_TODO: should we have a batch method for this?_**

#### `member.update`

`(id: string, info: { role: ProjectRole }) => Promise<ProjectMember>`

Update info about a member. Throws if the member does not exist or if the caller does not have the proper privileges.

```ts
// Add the member
const member = await mapeo.$project.member.add('abc123', {...})

// Update the member
const updatedMember = await mapeo.$project.member.update(member.id, {
  ...member,
  // Any relevant properties you want to update
})
```

**_TODO: should this be limited to just updating role, or are there other things that could be updated?_**

### `invite`

Interface for managing project invites.

#### `invite.create`

`(id: string, role: ProjectRole) => Promise<void>`

Invite a peer to join the project. Note that this adheres to a “fire-and-forget” strategy and should resolve when the invite is successfully _sent_. If you need to subscribe to when the invite is either accepted or declined, add an event listener for the `invite:accepted` or `invite:declined` events, respectively.

```ts
await mapeo.$project.invite.create("some-peer-id", "member");
```

**_TODO: is fire-and-forget okay for this?_**

**_TODO: anything besides role that needs to be added as param?_**

#### `invite.getMany`

`(opts?: { pending?: boolean, accepted?: boolean, declined?: boolean }) => Promise<Invite[]>`

Get invites that have been created. Can use `opts` to filter the returned results based on their status. All opts are `true` by default.

```ts
// Invite some peers
await mapeo.$project.invite.create("peer-a", "coordinator");
await mapeo.$project.invite.create("peer-b", "member");
await mapeo.$project.invite.create("peer-c", "member");

const invites = await mapeo.$project.invite.getMany();

// Assuming none of them have responded yet, outputs 3
console.log(invites.length);
```

## Events

### `'invite:accepted'`

`(id: string, info: { role: ProjectRole }) => void`

Emits when an invited peer has accepted an invitation to join the project. `info` represents information about the invitation that was sent, such as the role.

```ts
mapeo.$project.on("invite:accepted", async (id, info) => {
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
mapeo.$project.on("invite:declined", (id, info) => {
  console.log(`${id} declined invite to be ${info.role}`);
});
```

**_TODO: what other things should be included in `info`?_**
