# Projects Management API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`Project`](#project)

- [Methods](#methods)

  - [`get`](#get)
  - [`getMany`](#getmany)
  - [`create`](#create)
  - [`update`](#update)
  - [`delete`](#delete)

  - [`invite`](#invite)

    - [`invite.accept`](#inviteaccept)
    - [`invite.decline`](#invitedecline)

## Description

Exposes an interface for managing projects and responding to project invites.

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

## Methods

### `get`

`(id: string) => Promise<Project | null>`

Get information about a project with the specified `id`.

```ts
const projects = await client.$projectsManagement.get("abc123");
```

### `getMany`

`(opts?: {}) => Promise<Project[]>`

Get all projects.

```ts
const projects = await client.$projectsManagement.getMany();
```

**_TODO: What does `opts` look like?_**

**_TODO: Should return type be different?_**

### `create`

`(opts: { name: string }) => Promise<Project>`

Create a project.

```ts
const project = await client.$projectsManagement.create({ name: "mapeo" });
```

### `update`

`(projectId: string, newInfo: { name: string }) => Promise<Project>`

Update a project's information. Throws if caller does not have the proper permissions or if the project does not exist.

```ts
const project = await client.$projectsManagement.create({...});

const updatedProject = await client.$projectsManagement.update(project.id, {...});
```

### `delete`

`(id: string) => Promise<Project>`

Delete a project with the specified `id`. Throws if caller does not have the proper permissions or if the project does not exist.

```ts
const project = await client.$projectsManagement.create();

const deletedProject = await client.$projectsManagement.delete(project.id);
```

**_TODO: Does this return a deleted `Project`?_**

### `invite`

#### `invite.accept`

`(id: string, params: { projectKey: string }) => Promise<void>`

Accept an invite received from another peer.

```ts
client.on('invite-received', (invite) => {
  // In reality, probably would perform logic to check it
  client.$projectsManagement.invite.accept(invite.id, { projectKey: ... })
})
```

#### `invite.decline`

`(id: string, params: { projectKey: string }) => Promise<void>`

Decline an invite received from another peer.

```ts
client.on('invite-received', (invite) => {
  // In reality, probably would perform logic to check it
  client.$projectsManagement.invite.decline(invite.id, { projectKey: ... })
})
```
