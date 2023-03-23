# DataType API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`MapeoDoc`](#mapeodoc)
  - [`MapeoType`](#mapeotype)

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

Datatypes are exposed on the client as fields that are _not_ prefixed with `$`. For example, accessing the interface for an application-defined observation type uses something like `client.observation`.

## Types

### `MapeoDoc`

Basically represents the entity that is stored in the database. Has information about the specific application data in its `value` field, as well as some meta information about the [`Doc`](https://github.com/digidem/mapeo-core-next/blob/main/lib/types.js#L90).

```ts
type DataType<T extends MapeoType> = {
  id: string;
  type: string;
  version: string;
  created_at: string;
  updated_at: string | null;
  links: string[] | null;
  forks: string[] | null;
  value: T;
};
```

### `MapeoType`

Represents any application-specific key-value data associated with a `MapeoDoc`. This can be updated in the database and is generally available on a doc as `doc.value`.

```ts
type MapeoType = Record<string, any>;
```

## Methods

### `create`

`(value: MapeoType) => Promise<MapeoDoc<MapeoType>>`

Create a document with the associated `value`. Resolves with the Mapeo doc containing information created upon saving to the database.

```ts
// Let's say our observation data has this shape
type Observation = {
  lat: number;
  lon: number;
  tags: { type: string };
};

// We can create an observation document like this
const doc = await client.observation.create({
  lat: 0,
  lon: 0,
  tags: { type: "animal" },
});

// We can access the data we specified using `doc.value`
console.log(doc.value); // prints { lat: 0, lon: 0, tags: { type: "animal" } }
```

### `getByDocId`

`(docId: string) => Promise<MapeoDoc<MapeoType>>`

Get a document with the associated `docId`. Note that this will return the most recent version of a document, even if it has been deleted.

```ts
// Create a doc
const createdDoc = await client.observation.create({ ... })

// Get the doc using the id we have after creating it
const retrievedDoc = await client.observation.getByDocId(createdDoc.id)

// Can guarantee that this passes
console.assert(createdDoc.id === retrievedDoc.id)
```

### `getByVersionId`

`(versionId: string) => Promise<MapeoDoc<MapeoType>>`

Get a document for its associated `versionId`.

```ts
// Create a doc
const createdDoc = await client.observation.create({ ... })

// Get the doc using the id we have after creating it
const retrievedDoc = await client.observation.getByVersionId(createdDoc.version)

// Can guarantee that this passes
console.assert(createdDoc.version === retrievedDoc.version)
```

### `getMany`

`(opts?: { includeDeleted?: boolean }) => Promise<MapeoDoc<MapeoType>[]>`

Get many documents, sorted by `created_at` descending (most recent documents first). If no matching documents exist, resolves with an empty array. Can accept the following options (`opts`):

- `includeDeleted` include deleted documents in the result. Defaults to `false`.

```ts
// No docs have been created yet, so empty array is returned
assert((await client.observation.getMany()).length === 0)

// Create a few docs
const doc1 = await client.observation.create({ ... })
const doc2 = await client.observation.create({ ... })
const doc3 = await client.observation.create({ ... })

// Fetch all docs
const allDocs = await client.observation.getMany()
console.assert(allDocs.length === 3)

// Delete a document and refetch to see that resulting count changes
await client.observation.delete(doc3.version)

const nonDeletedDocs = await client.observation.getMany()
console.assert(nonDeletedDocs.length === 2)

// Specifying `includeDeleted: true` will return all docs, including deleted ones
const allDocsIncludingDeleted = await client.observation.getMany({ includeDeleted: true })
console.assert(allDocsIncludingDeleted.length === 3)
```

### `update`

`(versionId: string | string[], value: MapeoType) => Promise<MapeoDoc<MapeoType>>`

Update a document associated with `versionId` with a new `value`. Throws if the document does not exist. Otherwise resolves with the updated Mapeo doc.

```ts
// Create a doc
const doc = await client.observation.create({
  lat: 0,
  lon: 0,
  tags: { type: "animal" },
});

// Update the doc with some new coordinates
const updatedDoc = await client.observation.update(doc.version, {
  ...doc.value,
  lat: 10,
  lon: 10,
});

console.assert(updatedDoc.value.lat === 10);
console.assert(updatedDoc.value.lon === 10);
```

### `delete`

`(versionId: string | string[]) => Promise<MapeoDoc<MapeoType>>`

Delete a document that matches the specified `versionId`. Throws if the document does not exist. Otherwise resolves with the deleted document.

```ts
const doc = await client.observation.create({ ... })

// Delete the doc
const deletedDoc = await client.observation.delete(doc3.versionId)

// The deleted doc will have a `deleted` property equal to `true`
console.assert(deletedDoc.deleted === true)
```
