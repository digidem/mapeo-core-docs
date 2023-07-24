# DataType API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`DataType`](#datatype)

- [Methods](#methods)

  - [`create`](#create)
  - [`getByDocId`](#getbydocid)
  - [`getByVersionId`](#getbyversionid)
  - [`getMany`](#getmany)
  - [`update`](#update)
  - [`delete`](#delete)

## Description

A DataType represents application-specific data. Each DataType has a schema that it adheres to, which can be used on the application level as well as for querying purposes at the core level. This API provides a CRUD interface to manage and work with such data.

For now, exposed DataTypes are determined by the server-implementation that uses Mapeo Core. In the future, we would like to support application-defined DataTypes to flexibly support a wide variety of applications.

DataTypes are exposed on the client as project-specific fields that are _not_ prefixed with `$`. For example, accessing the interface for an application-defined observation type uses something like `project.observation`.

## Types

### `DataType`

Basically represents the entity that is stored in the database. Has information about the specific application data as well as some meta information about the document.

```ts
import { Opaque } from "type-fest";

type DocId = Opaque<string>;
type VersionId = Opaque<string>;

// Represents any application-specific key-value data associated with a `DataType`. This can be updated in the database.
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
    links: Array<VersionId>; //
    forks: Array<VersionId>;
  }
>;
```

## Methods

### `create`

`(value: MapeoType) => Promise<DataType<MapeoType>>`

Create a document with the associated `value`. Resolves with the Mapeo document containing information created upon saving to the database.

```ts
// Let's say our observation data has this shape
type Observation = {
  lat: number;
  lon: number;
  tags: { type: string };
};

// We can create an observation document like this
const doc = await project.observation.create({
  lat: 0,
  lon: 0,
  tags: { type: "animal" },
});

// We can access the data we specified using `doc.value`

console.log({
  lat: doc.lat,
  lon: doc.lon,
  tags: doc.tags,
}); // prints { lat: 0, lon: 0, tags: { type: "animal" } }
```

### `getByDocId`

`(docId: string) => Promise<DataType<MapeoType>>`

Get a document with the associated `docId`. Note that this will return the most recent version of a document, even if it has been deleted.

```ts
// Create a doc
const createdDoc = await project.observation.create({ ... })

// Get the doc using the id we have after creating it
const retrievedDoc = await project.observation.getByDocId(createdDoc.docId)

// Can guarantee that this passes
console.assert(createdDoc.docId === retrievedDoc.docId)
```

### `getByVersionId`

`(versionId: string) => Promise<DataType<MapeoType> & { deleted?: true }>`

Get a document for its associated `versionId`. If this returns a deleted document, a `deleted` field with value `true` is present and the `updatedAt` field refers to the deletion date.

```ts
// Create a doc
const createdDoc = await project.observation.create({ ... })

// Get the doc using the id we have after creating it
const retrievedDoc = await project.observation.getByVersionId(createdDoc.version)

// Can guarantee that this passes
console.assert(createdDoc.version === retrievedDoc.version)
```

### `getMany`

`<Opts extends { includeDeleted?: boolean }>(opts?: Opts) => Promise<Array<Opts extends { includeDeleted: true } ? DataType<MapeoType> & { deleted?: true } : DataType<MapeoType>>>`

Get many documents, sorted by `createdAt` descending (most recent documents first). If no matching documents exist, resolves with an empty array. Can accept the following options (`opts`):

- `includeDeleted` include deleted documents in the result. Defaults to `false`.

```ts
// No docs have been created yet, so empty array is returned
assert((await project.observation.getMany()).length === 0)

// Create a few docs
const doc1 = await project.observation.create({ ... })
const doc2 = await project.observation.create({ ... })
const doc3 = await project.observation.create({ ... })

// Fetch all docs
const allDocs = await project.observation.getMany()
console.assert(allDocs.length === 3)

// Delete a document and refetch to see that resulting count changes
await project.observation.delete(doc3.version)

const nonDeletedDocs = await project.observation.getMany()
console.assert(nonDeletedDocs.length === 2)

// Specifying `includeDeleted: true` will return all docs, including deleted ones
const allDocsIncludingDeleted = await project.observation.getMany({ includeDeleted: true })
console.assert(allDocsIncludingDeleted.length === 3)
```

### `update`

`(versionId: VersionId | Array<VersionId>, value: MapeoType) => Promise<DataType<MapeoType>>`

Update a document associated with `versionId` with a new `value`. If `versionId` is an array, it must have a length of at least 1. Throws if the document does not exist. Otherwise resolves with the updated document.

```ts
// Create a doc
const doc = await project.observation.create({
  lat: 0,
  lon: 0,
  tags: { type: "animal" },
});

// Update the doc with some new coordinates
const updatedDoc = await project.observation.update(doc.version, {
  lat: 10,
  lon: 10,
});

console.assert(updatedDoc.value.lat === 10);
console.assert(updatedDoc.value.lon === 10);
```

### `delete`

`(versionId: VersionId | Array<VersionId>) => Promise<DataType<MapeoType> & { deleted: true }>`

Delete a document that matches the specified `versionId`. If `versionId` is an array, it must have a length of at least 1. Throws if the document does not exist. Otherwise resolves with the deleted document.

```ts
const doc = await project.observation.create({ ... })

// Delete the doc
const deletedDoc = await project.observation.delete(doc.versionId)

// The deleted doc will have a `deleted` property equal to `true`
console.assert(deletedDoc.deleted === true)
```
