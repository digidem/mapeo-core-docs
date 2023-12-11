# Mapeo Core Client API

## Table of Contents

- [Mapeo API Client](#mapeo-api-client)

  - [Types](#types)
  - [Methods](#methods)
  - [`client.createProject()`](#clientcreateproject)
  - [`client.getProject()`](#clientgetproject)
  - [`client.addProject()`](#clientaddProject)
  - [`client.listProjects()`](#clientlistprojects)
  - [`client.listLocalPeers()`](#clientlistlocalpeers)
  - Events
    - [`'local-peers'`](#local-peers)
  - [Properties](#properties)
    - [`client.invite`](#clientinvite)
      - [`invite.accept()`](#inviteaccept)
      - [`invite.reject()`](#invitereject)
      - Events
        - [`'invite-received'`](#invite-received)

- [Project Instance](#project-instance)
  - [Types](#types-1)
  - [Methods](#methods-1)
    - [`project.$getProjectSettings()`](#projectgetprojectsettings)
    - [`project.$setProjectSettings()`](#projectsetprojectsettings)
    - [`project.$leave()`](#projectleave)
  - [Properties](#properties-1)
    - [`project.$sync`](#projectsync)
      - [`$sync.getState()`](#syncgetstate)
      - [`$sync.start()`](#syncstart)
      - [`$sync.stop()`](#syncstop)
      - [`$sync.waitForSync()`](#syncwaitforsync)
      - Events
        - [`'sync-state'`](#sync-state)
    - [`project.$member`](#projectmember)
      - [`$member.invite()`](#memberinvite)
      - [`$member.getById()`](#membergetbyid)
      - [`$member.getMany()`](#membergetmany)
      - [`$member.update()`](#memberupdate)
      - [`$member.remove()`](#memberremove)
      - Events
        - [`'member-update'`](#member-update)
    - [`project.$blob`](#projectblob)
      - [`$blob.getUrl()`](#blobgeturl)
      - [`$blob.create()`](#blobcreate)
    - [MapeoDoc](#mapeodoc)
      - [Types](#types-2)
      - [`mapeoDoc.create()`](#mapeodoccreate)
      - [`mapeoDoc.getByDocId()`](#mapeodocgetbydocid)
      - [`mapeoDoc.getByVersionId()`](#mapeodocgetbyversionid)
      - [`mapeoDoc.getMany()`](#mapeodocgetmany)
      - [`mapeoType.update()`](#mapeodocupdate)
      - [`mapeoDoc.delete()`](#mapeodocdelete)

## Mapeo API Client

Client interface for managing projects and invites. Provides an event emitter-like interface so it can emit and subscribe to events.

### Types

```ts
import { Opaque } from "type-fest";

type ProjectId = Opaque<string>;

type ProjectInfo = {
  projectId: ProjectId;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectRole = "creator" | "coordinator" | "member";

type Invite = {
  projectId: ProjectId;
  projectName: string;
  role: ProjectRole;
};
```

### Methods

#### `client.createProject()`

`(opts: { name?: string }) => Promise<ProjectId>`

Create a new project. Resolves with the `ProjectId` of the created project.

Accepts the following `opts`:

- `name`: the name of the project

#### `client.getProject()`

`(projectId: string) => Promise<MapeoProject>`

Retrieve a project client instance. Returns a `MapeoProject` that exposes the [Project Instance](#project-instance) API for the desired project.

#### `client.addProject()`

`(projectId: string) => Promise<MapeoProject>`

Add an existing project. Returns a `MapeoProject` that exposes the [Project Instance](#project-instance) API for the desired project.

#### `client.listProjects()`

`() => Promise<Array<ProjectInfo & ProjectSettings>>`

Retrieve information about all projects.

#### `client.listLocalPeers()`

`() => Promise<Array<{ peerId: string, name?: string, connected: boolean }>>`

Retrieve a list of locally discovered peers, includes peers that are and are not members of the same projects as the device. Peers that have been previously connected but then disconnected are still returned, with `connected: false`.

### Events

#### `'local-peers'`

Emits when the list of local peers updates (new peers are discovered, or a peer's connection status changes)

### Properties

#### `client.invite`

Namespace for managing project invites. Provides an event emitter-like interface so it can emit and subscribe to events.

##### `invite.accept()`

`(projectId: string) => Promise<MapeoProject>`

Accept an invitation that was received for the project associated with `projectId`.

##### `invite.reject()`

`(projectId: string) => Promise<void>`

Reject an invitation that was received for the project associated with `projectId`.

##### Events

###### `'invite-received'`

`invite.addEventListener('invite-received', (invite: Invite) => void)`

Emits when a device invites you to a project.

## Project Instance

Client interface for managing and interacting with a project instance. Built-in API methods and namespaces are prefixed with `$` to distinguish them from dynamic, application-specific namespaces that are created based on the [MapeoDoc](#mapeodoc) API.

### Types

```ts
import { Opaque } from "type-fest";

type ProjectSettings = {
  name?: string;
};

type VersionId = Opaque<string>;

type PartialSyncState = {
  /** Number of blocks we have locally */
  have: number,
  /** Number of blocks we want from connected peers */
  want: number,
  /** Number of blocks that connected peers want from us */
  wanted: number,
  /** Number of blocks missing (we don't have them, but connected peers don't have them either) */
  missing: number,
  /** Is there data available to sync? (want > 0 || wanted > 0) */
  dataToSync: boolean,
  /** Are we currently syncing? */
  syncing: boolean,
}

type SyncState = {
  /** State of initial sync (sync of auth, metadata and project config) */
  initial: PartialSyncState,
  /** State of data sync (observations, map data, photos, audio, video etc.) */
  data: PartialSyncState,
  /** Number of connected peers */
  connectedPeers: number
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

### Methods

#### `project.$getProjectSettings()`

`() => Promise<ProjectInfo & ProjectSettings>`

Get information about the project and its settings.

#### `project.$setProjectSettings()`

`(settings: ProjectSettings) => Promise<ProjectInfo & ProjectSettings>`

Set information about the project.

#### `project.$leave()`

`() => Promise<void>`

Leave the project.

### Properties

#### `project.$sync`

Namespace for getting information about sync and managing sync strategy. Mapeo will automatically connect to local peers (peers that are discoverable on the local network) and will automatically sync project metadata (project member authentication, project config and metadata about how much data needs to be synced), which we call 'initial' sync. Data sync (observations, map data, photos, audio, video etc.) is disabled by default. To enable data sync, call `start()`. Provides an event emitter-like interface so it can emit and subscribe to events.

##### `$sync.getState()`

`() => Promise<SyncState>`

Get current state of sync with connected peers. The sync state is divided into 'initial' sync and 'data' sync. Initial sync refers to the sync of auth, metadata and project config. Data sync refers to the sync of observations, map data, photos, audio, video etc. The sync state is further divided into 'have', 'want', 'wanted' and 'missing' blocks. `have` is the number of blocks we have locally. `want` is the number of blocks we want from connected peers. `wanted` is the number of blocks that connected peers want from us. `missing` is the number of blocks that we don't have, but connected peers don't have either. `dataToSync` refers to whether there is data available to sync (want > 0 || wanted > 0). `syncing` refers to whether we are currently syncing this subset of data (initial metadata or data).

##### `$sync.start()`

`() => Promise<void>`

Start data sync (observations, map data and media). If data sync is already enabled, this is a no-op. Do not rely on the resolving of this method to know when the process starts. Instead, listen to the [`'sync-state'`](#sync-state) event.

##### `$sync.stop()`

Stop data sync (observations, map data and media). Syncing of metadata (project member authentication, project config and metadata about how much data needs to be synced) will continue in the background. Listen to the [`'sync-state'`](#sync-state) event to know when additional data is available to sync.

##### `$sync.waitForSync(type)`

`(type: 'initial' | 'data') => Promise<void>`

Wait for sync to complete for the specified `type`. If `type` is `'initial'`, this will wait for initial sync (sync of auth, metadata and project config) to complete. If `type` is `'data'`, this will wait for data sync (observations, map data and media) to complete. It will resolve when the sync is complete. Note that if additional peers connect or if connected peers add new data after this has resolved, then there will still be data to sync. To watch for changes subscribe to the `sync-state` event (see below).


##### Events

###### `'sync-state'`

`$sync.addEventListener('sync-state', (state: SyncState) => void)`

Emits when sync state changes (e.g. number of blocks we have, want, are wanted or missing changes, or when we connect to a new peer or a peer disconnects). See the [type definition](#types-1) for more information about the sync state.

#### `project.$member`

Namespace for managing members of the project. Provides an event emitter-like interface so it can emit and subscribe to events.

##### `$member.invite()`

`(deviceId: string, opts: { role: ProjectRole, timeout?: number }) => Promise<InviteResponse>`

Invite a device to the project. Throws if the caller does not have the proper permissions or if the specified `timeout` is reached. Resolves with the response provided by the receiving device.

Accepts the following `opts`:

- `role`: the role to grant for the invited device
- `timeout`: the maximum amount of time in seconds to wait for a response.

##### `$member.getById()`

`(deviceId: string) => Promise<Member>`

Get the project member with the associated `deviceId`.

##### `$member.getMany()`

`(opts?: { connectedOnly?: boolean }) => Promise<Array<Member>>`

Get all project members. Accepts the following `opts`:

- `connectedOnly`: Only return members that are connected. Defaults to `false`.

##### `$member.update()`

`(deviceId: string, info: { name?: string | null, role?: ProjectRole }) => Promise<Member>`

Update information for a project member. Update is done by merging the `info` fields, as opposed to overwriting. Throws if the member does not exist or if the caller does not have the proper permissions. Resolves with the updated member information.

##### `$member.remove()`

`(deviceId: string) => Promise<void>`

Remove a member from the project. Throws if the member does not exist or if the caller does not have the proper permissions.

##### Events

###### `'member-update'`

`$member.addEventListener('member-update', (member: Member) => void)`

Emits when a new device is added to the project or information about a project member is updated.

#### `project.$blob`

Namespace for creating blobs and getting blob info. Provides an event emitter-like interface so it can emit and subscribe to events.

##### `$blob.create()`

`(filePaths: { original: string, preview?: string, thumbnail?: string }, metadata?: { mimeType?: string }) => Promise<BlobId>`

Create a blob. Resolves with information about the blob that is created.

Accepts the following `filePaths`:

- `original`: file path to the original version of the file
- `preview`: file path to the preview version of the file
- `thumbnail`: file path to the thumbnail version of the file

Accepts the following `metadata`:

- `mimeType`: MIME type for file

##### `$blob.getUrl()`

`(blobId: BlobId) => string`

Get the http URL pointing to the desired blob. Note that this is _synchronous_ and returns the constructed URL.

#### MapeoDoc

A MapeoDoc represents a record that is stored in the Mapeo database. Every MapeoDoc is made up of a set of "common" fields (i.e. defined for all docs, referred to as the MapeoCommon type) and application-specific fields defined by a MapeoValue type. Each MapeoValue has a schema that it adheres to, which can be used on the application level as well as for querying purposes at the core level. The MapeoDoc API provides a CRUD interface to manage and work with such data.

The MapeoDoc API for a MapeoValue is exposed on the client as fields on the project instance. These fields are not prefixed with `$`. For example, accessing the interface for an application-defined "observation" type would be done so using `project.observation`. MapeoDocs provide an event emitter-like interface so it can emit and subscribe to events.

##### Types

```ts
import { Opaque } from "type-fest";

type DocId = Opaque<string>;
type VersionId = Opaque<string>;

type MapeoCommon = ReadOnly<{
  docId: DocId;
  versionId: VersionId;
  schemaName: string;
  createdAt: Date;
  updatedAt: Date;
  links: Array<VersionId>;
  forks: Array<VersionId>;
}>;

// Represents any application-specific key-value data associated with a MapeoDoc.
// This can be updated in the database.
type MapeoValue = ReadOnly<{
  [key: string]: any;
}>;

type MapeoDoc = MapeoValue & MapeoCommon;
```

##### `mapeoDoc.create()`

`(value: MapeoValue) => Promise<MapeoDoc>`

Create a document with the associated `value`. Resolves with the Mapeo document containing information created upon saving to the database.

##### `mapeoDoc.getByDocId()`

`(docId: string) => Promise<MapeoDoc>`

Get a document with the associated `docId`. Note that this will return the most recent version of a document, even if it has been deleted.

##### `mapeoDoc.getByVersionId()`

`(versionId: string) => Promise<MapeoDoc & { deleted?: true }>`

Get a document for its associated `versionId`. If this returns a deleted document, a `deleted` field with value `true` is present and the `updatedAt` field refers to the deletion date.

##### `mapeoDoc.getMany()`

`<Opts extends { includeDeleted?: boolean }>(opts?: Opts) => Promise<Array<Opts extends { includeDeleted: true } ? MapeoDoc & { deleted?: true } : MapeoDoc>>`

Get many documents, sorted by `createdAt` descending (most recent documents first). If no matching documents exist, resolves with an empty array.

Accepts the following `opts`:

- `includeDeleted` include deleted documents in the result. Defaults to `false`.

##### `mapeoDoc.update()`

`(versionId: VersionId | Array<VersionId>, value: MapeoType) => Promise<MapeoDoc>`

Update a document associated with `versionId` with a new `value`. If `versionId` is an array, it must have a length of at least 1. Throws if the document does not exist. Otherwise resolves with the updated document.

##### `mapeoDoc.delete()`

`(versionId: VersionId | Array<VersionId>) => Promise<MapeoDoc & { deleted: true }>`

Delete a document that matches the specified `versionId`. If `versionId` is an array, it must have a length of at least 1. Throws if the document does not exist. Otherwise resolves with the deleted document.
