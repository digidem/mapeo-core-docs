# Peer API

## Table of Contents

- [Description](#description)

- [Types](#types)

  - [`Peer`](#peer)

- [Methods](#methods)

  - [`get`](#get)
  - [`getAll`](#getall)

## Description

Exposes interface for getting information about discovered peers.

## Types

### `Peer`

Information about a discovered peer or a project peer.

```ts
type Peer = {
  id: string;
  name: string | null;
  lastSynced: string;
  lastSeen: string;
};
```

## Methods

### `get`

`(id: string) => Promise<Peer | null>`

Retrieve info about a discovered peer with the provided `id`.

```ts
const peer = mapeo.$peer.get("abc123");
```

### `getAll`

`(opts?: {}) => Promise<Peer[]>`

Get all discovered peers. Can use `opts` to filter the results.

```ts
const peers = await mapeo.$peer.getAll();
```

**_TODO: Is the description of this method accurate?_**

**_TODO: What does `opts` look like?_**
