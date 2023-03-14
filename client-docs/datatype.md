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

A DataType can be defined when instantiating the client using an object that maps to the corresponding JSON schema. For example:

```ts
import { createClient } from "mapeo-core-client";

// Can alternatively use any library that generates a valid JSON schema
const ObservationSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://mapeo.world/schemas/observation.json",
  title: "Observation",
  type: "object",
  additionalProperties: false,
  properties: {
    lat: { type: "number" },
    lon: { type: "number" },
    tags: {
      type: "object",
      properties: {},
      additionalProperties: true,
    },
  },
};

const PresetSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://mapeo.world/schemas/preset.json",
  title: "Preset",
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    fields: {
      type: "array",
      items: { type: "string" },
    },
    tags: {
      type: "object",
      properties: {},
      additionalProperties: true,
    },
  },
};

const mapeo = createClient({
  dataTypes: {
    observation: ObservationSchema,
    preset: PresetSchema,
  },
});

// Now you can use the CRUD methods with the
// mapeo.observation and mapeo.preset namespaces!
```

## Types

### `MapeoDoc`

Basically represents the entity that’s stored in the database. Has information about the specific application data in its `value` field, as well as some meta information about the [`Doc`](https://github.com/digidem/mapeo-core-next/blob/main/lib/types.js#L90) as top level fields, such as `id`, `version`, `deleted`, `links`, `forks`, `created_at`, and `updated_at`.

### `MapeoType`

Represents any application-specific key-value data associated with a `MapeoDoc`. This can be updated in the database and is generally available on a doc as `doc.value`

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
const doc = await mapeo.observation.create({
  lat: 0,
  lon: 0,
  tags: { type: "animal" },
});

// We can access the data we specified using `doc.value`
console.log(doc.value); // prints { lat: 0, lon: 0, tags: { type: "animal" } }
```

### `getByDocId`

`(docId: string, opts?: { deleted?: boolean }) => Promise<MapeoDoc<MapeoType>>`

Get a document with the associated `docId`. `opts.deleted` can be specified to include or exclude a result based on whether the document was deleted or not. By default, `opts.deleted` is `true`.

```ts
// Create a doc
const createdDoc = await mapeo.observation.create({ ... })

// Get the doc using the id we have after creating it
const retrievedDoc = await mapeo.observation.getByDocId(createdDoc.id)

// Can guarantee that this passes
console.assert(createdDoc.id === retrievedDoc.id)
```

### `getByVersionId`

`(versionId: string, opts?: { deleted?: boolean }) => Promise<MapeoDoc<MapeoType>>`

Get a document with the associated `versionId`. `opts.deleted` can be specified to include or exclude a result based on whether the document was deleted or not. By default, `opts.deleted` is `true`.

```ts
// Create a doc
const createdDoc = await mapeo.observation.create({ ... })

// Get the doc using the id we have after creating it
const retrievedDoc = await mapeo.observation.getByVersionId(createdDoc.version)

// Can guarantee that this passes
console.assert(createdDoc.version === retrievedDoc.version)
```

### `getMany`

`(opts?: { deleted?: boolean, limit?: number}) => Promise<MapeoDoc<MapeoType>[]>`

Get many documents, sorted by `created_at` descending. If no matching documents exist, resolves with an empty array. Can accept the following options (`opts`):

- `deleted` include deleted documents in the result. Defaults to `false`.
- `limit` specify max number of documents to return (inclusive)

```ts
// No docs have been created yet, so empty array is returned
assert((await mapeo.observation.getMany()).length === 0)

// Create a few docs
const doc1 = await mapeo.observation.create({ ... })
const doc2 = await mapeo.observation.create({ ... })
const doc3 = await mapeo.observation.create({ ... })

// Fetch all docs
const allDocs = await mapeo.observation.getMany()
console.assert(allDocs.length === 3)

// Use the limit option to adjust how many docs are retrieved
const docsWithLimit = await mapeo.observation.getMany({ limit: 1 })
console.assert(docsWithLimit.length === 1)

// Delete a document and refetch to see that resulting count changes
await mapeo.observation.delete(doc3.version)

const nonDeletedDocs = await mapeo.observation.getMany()
console.assert(nonDeletedDocs.length === 2)

// Specifying `deleted: true` will return all docs, including deleted ones
const allDocsIncludingDeleted = await mapeo.observation.getMany({ deleted: true })
console.assert(allDocsIncludingDeleted.length === 3)
```

### `update`

`(versionId: string | string[], value: MapeoType) => Promise<MapeoDoc<MapeoType>>`

Update a document associated with `versionId` with a new `value`. Throws if the document does not exist. Otherwise resolves with the updated Mapeo doc.

```ts
// Create a doc
const doc = await mapeo.observation.create({
  lat: 0,
  lon: 0,
  tags: { type: "animal" },
});

// Update the doc with some new coordinates
const updatedDoc = await mapeo.observation.update(doc.version, {
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
const doc = await mapeo.observation.create({ ... })

// Delete the doc
const deletedDoc = await mapeo.observation.delete(doc3.versionId)

// The deleted doc will have a `deleted` property equal to `true`
console.assert(deletedDoc.deleted === true)
```
