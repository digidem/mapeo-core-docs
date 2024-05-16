---
title: CRUD
sidebar_position: 2
---

This page describes how to perform CRUD operations with the Mapeo Client API.
CRUD is an acronym that stands for:

- [Create](#create)
- [Read](#read)
- [Update](#update)
- [Delete](#delete)

## Create

### Create a single record

The following query creates a new observation:

```ts
const observation = mapeo.observation.create({
  value: {
    lat: 51.46,
    lon: 1.542,
    tags: {
      type: "house",
    },
  },
});
```

## Read

### Get current forks (heads) of a record by `id`

Get all forks of a record by `id`, sorted descending by timestamp (modification
date). Normally there will be a single "fork" for each record, but if two
devices modify the same record and then sync, then this can lead to two or more
forks.

This will also return deleted records, with the property `deleted=true`. It is
possible that a record may have two forks, one of them deleted and one not
deleted.

```ts
const forks = await mapeo.observation.getForksById(id);
const observation = forks?.[0];
```

### Get by version

Get the record by unique `version` identifier. Each update in a record's history
can be referenced by a `version` identifier.

```ts
const observation: Observation | null = await mapeo.observation.getByVersion(
  versionId
);
```

### Get all records

The following `findMany` query returns _all_ `Observation` records as a
nested array of forks (each item in the returned array is an array of one or more forks of records with the same `id`).

```ts
const observations: Observation[][] = await mapeo.observation.findMany();
```

### Get a filtered list of records

#### Filter by a single field value

```ts
const observations = await mapeo.observation.findMany({
  where: {
    timestamp: {
      gte: new Date('2020-03-19T14:21:00+0200')
    }
  }
})
```

## Update

Update an existing database record. You must pass the `id` of the record to
update and an array of `links` to the record version you are updating:

```ts
const observation = mapeo.observation.update({
  id: "ff3b33e3e13d12d5ab4233c67eaf923a",
  links: [prevVersionId],
  value: {
    lat: 52,
    lon: 2.3,
    tags: {
      type: "school",
    },
  },
});
```

## Delete

To delete a record, you must past both the `id` and an array of one or more
`links` to the version that you are deleting. This is necessary because another
user could edit the same record that you delete, resulting in a fork (one is
deleted, the other edited).

```ts
const deletedObservation = mapeo.observation.delete({
  id: "7ce1971ad1769af452797409959b2e2f",
  links: [prevVersionId],
});
```
