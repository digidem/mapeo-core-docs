---
title: Common properties
sidebar_position: 1
---

These properties are shared by all objects in the Mapeo database. They are managed by the database engine and cannot be assigned by the client, with the exception of `links` when updating a record. Create and Update operations operate on the `value` property, which has a different schema for each Mapeo record type.

| Property                        | Type       | Required     | Nullable |
| ------------------------------- | ---------- | ------------ | -------- |
| [created_at](#created_at)       | `string`   | **Required** | No       |
| [deviceId](#deviceid)           | `string`   | Optional     | No       |
| [creatorId](#creatorId)         | `string`   | Optional     | No       |
| [id](#id)                       | `string`   | **Required** | No       |
| [links](#links)                 | `string[]` | Optional     | No       |
| [schemaVersion](#schemaversion) | `number`   | Optional     | No       |
| [timestamp](#timestamp)         | `string`   | Optional     | No       |
| [type](#type)                   | `string`   | **Required** | No       |
| [version](#version)             | `string`   | **Required** | No       |
| [value](#value)                 | `Object`   | **Required** | No       |
| `*`                             | any        | Additional   | Yes      |

## `created_at`

RFC3339-formatted datetime of when the first version of the element was created

- is **required**
- type: `string`

  - format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))

## `deviceId`

ID of the device that made this edit

- is optional
- type: `string`

## `creatorId`

:::info
Not yet implemented
:::

ID of the device that originally created this record

- is optional
- type: `string`

## `id`

Unique value that identifies this element

- is **required**
- type: `string`

## `links`

Version ids of the previous document versions this one is replacing

- is optional
- type: `string[]`

  - Array type
  - All items must be of the type: `string`

## `schemaVersion`

Version of schema. Should increment for breaking changes to the schema

- is optional
- type: `number`

  - minimum value: `1`

## `timestamp`

RFC3339-formatted datetime of when this version of the element was created

- is optional
- type: `string`

  - format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))

## `type`

enum that defines the type of document in the database (defines which schema should be used)

- is **required**
- type: `string`

## `version`

Unique value that identifies this particular version of this element

- is **required**
- type: `string`
