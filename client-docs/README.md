# Mapeo Core Client API

## Table of Contents

- [Mapeo API Client](#mapeo-api-client)

  - [Types](#types)
  - [`client.createProject`](#clientcreateproject)
  - [`client.getProject`](#clientgetproject)
  - [`client.listProjects`](#clientlistprojects)
  - [`client.invite`](#clientinvite)
    - [`invite.accept`](#inviteaccept)
    - [`invite.reject`](#invitereject)
    - Events
      - [`'invite-received'`](#invite-received)

- [Project Instance](#project-instance)
  - [Types](#types-1)
  - [`project.$getProjectSettings`](#projectgetprojectsettings)
  - [`project.$updateProjectSettings`](#projectupdateprojectsettings)
  - [`project.$leave`](#projectleave)
  - [`project.$sync`](#projectsync)
    - [`$sync.getState`](#syncgetstate)
    - [`$sync.setDiscovery`](#syncsetdiscovery)
    - [`$sync.setSync`](#syncsetsync)
    - [`$sync.stop`](#syncstop)
    - Events
      - [`'sync-state'`](#sync-state)
  - [`project.$member`](#projectmember)
    - [`$member.invite`](#memberinvite)
    - [`$member.getById`](#membergetbyid)
    - [`$member.getMany`](#membergetmany)
    - [`$member.update`](#memberupdate)
    - [`$member.remove`](#memberremove)
    - Events
      - [`'member-update'`](#member-update)
  - [`project.$blob`](#projectblob)
    - [`$blob.getUrl`](#blobgeturl)
    - [`$blob.create`](#blobcreate)
  - [DataType](#datatype)
    - [Types](#types-2)
    - [`dataType.create`](#datatypecreate)
    - [`dataType.getByDocId`](#datatypegetbydocid)
    - [`dataType.getByVersionId`](#datatypegetbyversionid)
    - [`dataType.getMany`](#datatypegetmany)
    - [`dataType.update`](#datatypeupdate)
    - [`dataType.delete`](#datatypedelete)

## Mapeo API Client

Client interface for managing projects and invites. Provides an event emitter-like interface so it can emit and subscribe to events.

### Types

```ts
import { Opaque } from "type-fest";

type ProjectId = Opaque<string>;

type ProjectInfo = {
  id: ProjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
};

type ProjectRole = "creator" | "coordinator" | "member";

type Invite = {
  projectId: ProjectId;
  projectName: string;
  role: ProjectRole;
};
```

### `client.createProject`

`(opts: { name?: string }) => Promise<MapeoProject>`

Create a new project instance. Resolves with a `MapeoProject` that exposes the [Project Instance](#project-instance) API.

Accepts the following `opts`:

- `name`: the name of the project

### `client.getProject`

`(projectId: string) => Promise<MapeoProject>`

Retrieve a project client instance. Returns a `MapeoProject` that exposes the [Project Instance](#project-instance) API for the desired project.

### `client.listProjects`

`() => Promise<Array<ProjectInfo>>`

Retrieve information about all projects.

### `client.invite`

Namespace for managing project invites. Provides an event emitter-like interface so it can emit and subscribe to events.

#### `invite.accept`

`(projectId: string) => Promise<MapeoProject>`

Accept an invitation that was received for the project associated with `projectId`.

#### `invite.reject`

`(projectId: string) => Promise<void>`

Reject an invitation that was received for the project associated with `projectId`.

#### Events

##### `'invite-received'`

`invite.addEventListener('invite-received', (invite: Invite) => void)`

Emits when a device invites you to a project.

## Project Instance

Client interface for managing and interacting with a project instance. Built-in API methods and namespaces are prefixed with `$` to distinguish them from dynamic, application-specific namespaces that are created based on the [DataType](#datatype) API.

### Types

```ts
import { Opaque } from "type-fest";

type ProjectSettings = {
  // TODO
};

type VersionId = Opaque<string>;

type ConnectionType = "lan" | "internet";

type SyncInfo = {
  discovery: ConnectionType[];
  sync: ConnectionType[];
};

type Member = {
  deviceId: string;
  name: string | null;
  lastSynced: Date;
  lastSeen: Date;
  connected: boolean;
} & SyncInfo;

type InviteResponse = "ACCEPT" | "REJECT" | "READY";

type BlobId =
  | {
      type: "photo";
      variant: "original" | "preview" | "thumbnail";
      name: string;
      driveId: string;
    }
  | {
      type: "audio";
      variant: "original";
      name: string;
      driveId: string;
    }
  | {
      type: "video";
      variant: "original";
      name: string;
      driveId: string;
    };
```

### `project.$getProjectSettings`

`() => Promise<ProjectInfo & ProjectSettings>`

Get information about the project and its settings.

### `project.$updateProjectSettings`

`(versionId: string | Array<string>, info: ProjectInfo) => Promise<ProjectInfo & ProjectSettings>`

Update information about the project.

### `project.$leave`

`() => Promise<void>`

Leave the project.

### `project.$sync`

Namespace for getting information about sync and managing sync strategy.

#### `$sync.getState`

`() => Promise<SyncInfo>`

Get information about discovery and sync connection types that are enabled.

#### `$sync.setDiscovery`

`(connectionTypes: ConnectionType[] | null) => Promise<void>`

Set the discovery connection types to enable. If `setDiscovery` has not been previously called with a valid connection type, discovery becomes enabled. If `connectionTypes` is `null` or `[]`, discovery becomes disabled. Do not rely on the resolving of this method to know when the process starts or stops. Instead, listen to the [`'sync-state'`](#sync-state) event on `$sync`.

Note that turning off discovery does not stop existing connections, it only stops the device from searching for and connecting to new devices.

#### `$sync.stop`

_Not implemented_

Force stop discovery and sync.

#### `$sync.setSync`

`(connectionTypes: ConnectionType[] | null) => Promise<void>`

Set the sync connection types to enable. If `setSync` has not been previously called with a valid connection type, sync becomes enabled. If `connectionTypes` is `null` or `[]`, sync becomes disabled. Do not rely on the resolving of this method to know when the process starts or stops. Instead, listen to the [`'sync-state'`](#sync-state) event.

Note that there existing syncing processes with other peers happening, disabling sync does not close these immediately. The server will attempt to gracefully finish or close them and eventually emit the appropriate [`'sync-state'`](#sync-state) event.

#### Events

##### `'sync-state'`

`$sync.addEventListener('sync-state', (info: SyncInfo) => void)`

Emits when the discovery or sync strategy changes.

### `project.$member`

Namespace for managing members of the project. Provides an event emitter-like interface so it can emit and subscribe to events.

#### `$member.invite`

`(deviceId: string, opts: { role: ProjectRole, timeout?: number }) => Promise<InviteResponse>`

Invite a device to the project. Throws if the caller does not have the proper permissions or if the specified `timeout` is reached. Resolves with the response provided by the receiving device.

Accepts the following `opts`:

- `role`: the role to grant for the invited device
- `timeout`: the maximum amount of time in seconds to wait for a response.

#### `$member.getById`

`(deviceId: string) => Promise<Member>`

Get the project member with the associated `deviceId`.

#### `$member.getMany`

`(opts: {}) => Promise<Array<Member>>`

Get all project members.

#### `$member.update`

`(deviceId: string, info: { name?: string | null, role?: ProjectRole }) => Promise<Member>`

Update information for a project member. Update is done by merging the `info` fields, as opposed to overwriting. Throws if the member does not exist or if the caller does not have the proper permissions. Resolves with the updated member information.

#### `$member.remove`

`(deviceId: string) => Promise<void>`

Remove a member from the project. Throws if the member does not exist or if the caller does not have the proper permissions.

#### Events

##### `'member-update'`

`$member.addEventListener('member-update', (member: Member) => void)`

Emits when a new device is added to the project or information about a project member is updated.

### `project.$blob`

Namespace for creating blobs and getting blob info. Provides an event emitter-like interface so it can emit and subscribe to events.

#### `$blob.create`

`(filePaths: { original: string, preview?: string, thumbnail?: string }, metadata: { mimeType: string }) => Promise<BlobId>`

Create a blob. Resolves with information about the blob that is created.

Accepts the following `filePaths`:

- `original`: file path to the original version of the file
- `preview`: file path to the preview version of the file
- `thumbnail`: file path to the thumbnail version of the file

Accepts the following `metadata`:

- `mimeType`: MIME type for file

#### `$blob.getUrl`

`(blobId: BlobId) => string`

Get the http URL pointing to the desired blob. Note that this is _synchronous_ and returns the contructed URL.

### DataType

A DataType represents application-specific data. Each DataType has a schema that it adheres to, which can be used on the application level as well as for querying purposes at the core level. This API provides a CRUD interface to manage and work with such data.

DataTypes are exposed on the client as fields on the project client instance. These fields are not prefixed with `$`. For example, accessing the interface for an application-defined "observation" type would be done so using `project.observation`. DataTypes provide an event emitter-like interface so it can emit and subscribe to events.

#### Types

```ts
import { Opaque } from "type-fest";

type DocId = Opaque<string>;
type VersionId = Opaque<string>;

// Represents any application-specific key-value data associated with a DataType.
// This can be updated in the database.
type MapeoType = {
  [key: string]: any;
};

type DataType<T extends MapeoType> = Readonly<
  T & {
    docId: DocId;
    versionId: VersionId;
    schemaName: string;
    createdAt: Date;
    updatedAt: Date;
    links: Array<VersionId>;
    forks: Array<VersionId>;
  }
>;
```

#### `dataType.create`

`(value: MapeoType) => Promise<DataType<MapeoType>>`

Create a document with the associated `value`. Resolves with the Mapeo document containing information created upon saving to the database.

#### `dataType.getByDocId`

`(docId: string) => Promise<DataType<MapeoType>>`

Get a document with the associated `docId`. Note that this will return the most recent version of a document, even if it has been deleted.

#### `dataType.getByVersionId`

`(versionId: string) => Promise<DataType<MapeoType> & { deleted?: true }>`

Get a document for its associated `versionId`. If this returns a deleted document, a `deleted` field with value `true` is present and the `updatedAt` field refers to the deletion date.

#### `dataType.getMany`

`<Opts extends { includeDeleted?: boolean }>(opts?: Opts) => Promise<Array<Opts extends { includeDeleted: true } ? DataType<MapeoType> & { deleted?: true } : DataType<MapeoType>>>`

Get many documents, sorted by `createdAt` descending (most recent documents first). If no matching documents exist, resolves with an empty array.

Accepts the following `opts`:

- `includeDeleted` include deleted documents in the result. Defaults to `false`.

#### `dataType.update`

`(versionId: VersionId | Array<VersionId>, value: MapeoType) => Promise<DataType<MapeoType>>`

Update a document associated with `versionId` with a new `value`. If `versionId` is an array, it must have a length of at least 1. Throws if the document does not exist. Otherwise resolves with the updated document.

#### `dataType.delete`

`(versionId: VersionId | Array<VersionId>) => Promise<DataType<MapeoType> & { deleted: true }>`

Delete a document that matches the specified `versionId`. If `versionId` is an array, it must have a length of at least 1. Throws if the document does not exist. Otherwise resolves with the deleted document.
