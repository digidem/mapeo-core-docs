---
title: CRUD
sidebar_position: 2
---

This page describes how to perform CRUD operations with the Mapeo Client API. CRUD is an acronym that stands for:

- [Create](#create)
  - [Create a single record](#create-a-single-record)
  - [Update](#update)

## Create

### Create a single record

The following query creates a new observation:

```ts
const observation = mapeo.observation.create({
  lat: 51.46,
  lon: 1.542,
  tags: {
    type: 'house'
  }
})
```

### Update

Update an existing database record. You must pass the `id` of the record to update and an array of links to the record version you are updating:

```ts
const observation = mapeo.observation.update({
  data: {
    lat: 52,
    lon: 2.3,
    tags: {
      type: 'school;
    }
  }
})
```
