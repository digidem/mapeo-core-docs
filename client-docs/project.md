# Project API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`Project`](#project)
  - [`ProjectRole`](#projectrole)
  - [`ProjectMember`](#projectmember)
  - [`CreatedInvite`](#createdinvite)

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

## Description

Exposes an interface for managing a projects' members and invites.

## Types

### `Project`

Information about the current project.

```ts
type Project = {
  id: string;
  name: string;
};
```

**_TODO: what other fields are relevant?_**

### `ProjectRole`

Information about the project role for a member.

```ts
type ProjectRole = "creator" | "coordinator" | "member";
```

**_TODO: should `non-member` be included here?_**

### `ProjectMember`

A member that is part of the project.

```ts
type ProjectMember = {
  id: string;
  name: string | null;
  role: ProjectRole;
};
```

### `CreatedInvite`

Information about an invite that has been created.

```ts
type CreatedInvite = {
  id: string;
  to: {
    id: string;
  };
  role: ProjectRole;
  status: "pending" | "accepted" | "declined" | "rescinded";
};
```

## Methods

### `info`

`() => Promise<Project>`

Get information about the current project.

```ts
const projectInfo = await client.$project.info();
```

### `member`

Interface for managing a project's members.

#### `member.get`

`(id: string) => Promise<ProjectMember | null>`

Get information about a project member (including yourself).

```ts
const member = await client.$project.member.get("abc123");
```

**_TODO: how do we get ourself?_**

#### `member.getMany`

`(opts: {}) => Promise<ProjectMember[]>`

Get all project members and information about each (including yourself).

```ts
const members = await client.$project.member.getMany();
```

**_TODO: any `opts` needed?_**

#### `member.add`

`(id: string, info: {}) => Promise<ProjectMember>`

Add a member to the project. Throws if the member already exists or if the caller does not have the proper permissions. Resolves with the created member.

```ts
const memberPublicKey = 'abc123'
const memberInfo = {...}

const member = await client.$project.member.add(memberPublicKey, memberInfo)
```

**_TODO: consolidate to single object param?_**

**_TODO: what’s needed in `info`?_**

**_TODO: should we not throw if member already exists?_**

#### `member.remove`

`(id: string) => Promise<void>`

Remove a member from the project. Throws if the member does not exist or if the caller does not have the proper permissions.

```ts
// Add the member
const member = await client.$project.member.add('abc123', {...})

// Nevermind, time to remove the member
await client.$project.member.remove(member.id)
```

**_TODO: should we not throw if member not found?_**

**_TODO: should we have a batch method for this?_**

#### `member.update`

`(id: string, info: { role: ProjectRole }) => Promise<ProjectMember>`

Update info about a member. Throws if the member does not exist or if the caller does not have the proper privileges.

```ts
// Add the member
const member = await client.$project.member.add('abc123', {...})

// Update the member
const updatedMember = await client.$project.member.update(member.id, {
  ...member,
  // Any relevant properties you want to update
})
```

**_TODO: should this be limited to just updating role, or are there other things that could be updated?_**

### `invite`

Interface for managing project invites.

#### `invite.create`

`(id: string, role: ProjectRole) => Promise<void>`

Invite a peer to join the project. Note that this adheres to a “fire-and-forget” strategy and should resolve when the invite is successfully _sent_. If you need to subscribe to when the invite is either accepted or declined, use the `invite-accepted` or `invite-declined` events, respectively.

```ts
await client.$project.invite.create("some-peer-id", "member");
```

**_TODO: is fire-and-forget okay for this?_**

**_TODO: anything besides role that needs to be added as param?_**

#### `invite.getMany`

`(opts?: { pending?: boolean, accepted?: boolean, declined?: boolean, rescinded?: boolean }) => Promise<CreatedInvite[]>`

Get invites that have been created. Can use `opts` to filter the returned results based on their status. All opts are `true` by default.

```ts
// Invite some peers
await client.$project.invite.create("peer-a", "coordinator");
await client.$project.invite.create("peer-b", "member");
await client.$project.invite.create("peer-c", "member");

const invites = await client.$project.invite.getMany();

console.log(invites.length); // logs 3
```
