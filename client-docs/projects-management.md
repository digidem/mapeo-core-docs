# Projects Management API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`Project`](#project)
  - [`ProjectRole`](#projectrole)
  - [`ProjectMember`](#projectmember)

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

`(opts?: {}) => Promise<Project>`

Create a project.

```ts
const project = await client.$projectsManagement.create({...});
```

**_TODO: What does `opts` look like?_**

### `update`

`(projectId: string, newInfo: {}) => Promise<Project>`

Update a project's information. Throws if caller does not have the proper permissions.

```ts
const project = await client.$projectsManagement.create({...});

const updatedProject = await client.$projectsManagement.update(project.id, {...});
```

**_TODO: What does `newInfo` look like?_**

### `delete`

`(id: string) => Promise<Project>`

Delete a project with the specified `id`. Throws if caller does not have the proper permissions.

```ts
const project = await client.$projectsManagement.create();

const deletedProject = await client.$projectsManagement.delete(project.id);
```

**_TODO: Does this return a deleted `Project`?_**

### `invite`

#### `invite.accept`

`(id: string, params: {}) => Promise<void>`

Accept an invite received from another peer.

```ts
client.$projectsManagement.on('invite:received', (info) => {
  // In reality, probably would perform logic to check it
  client.$projectsManagement.invite.accept(info.id, {...})
})
```

**_TODO: What does `params` look like?_**

**_TODO: Does this belong in this API?_**

#### `invite.decline`

`(id: string, params: {}) => Promise<void>`

Decline an invite received from another peer.

```ts
client.$projectsManagement.on('invite:received', (info) => {
  // In reality, probably would perform logic to check it
  client.$projectsManagement.invite.decline(info.id, {...})
})
```

**_TODO: What does `params` look like?_**
