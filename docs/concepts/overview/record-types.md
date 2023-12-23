---
title: Mapeo record types
sidebar_position: 3
---
## Elements

**Elements** are the basic components of Mapeo Core's conceptual data model of the physical world, inspired by [OpenStreetMap](https://wiki.openstreetmap.org/wiki/Elements). There are four types:

* [nodes](#node) (defining points in space)
* [ways](#way) (defining linear features and area boundaries)
* [relations](#relation) (which are sometimes used to explain how other elements work together)
* [observations](#observation) (an observation of a point, line or area feature with attached media)

All of the above can have one or more associated tags (which describe the meaning of a particular element).

### Node

A node represents a specific point on the earth's surface defined by its latitude and longitude. Each node comprises at least an `id` and a pair of coordinates.

Nodes can be used to define standalone point features. For example, a node could represent a park bench or a water well.

Nodes are also used to define the shape of a way. When used as points along ways, nodes usually have no tags, though some of them could. For example, highway=traffic_signals marks traffic signals on a road, and power=tower represents a pylon along an electric power line.

A node can be included as member of relation. The relation also may indicate the member's role: that is, the node's function in this particular set of related data elements.

### Way

A way is an ordered list of nodes that define a polyline. Ways are used to represent linear features such as rivers and roads.

Ways can also represent the boundaries of areas (solid polygons) such as buildings or forests. In this case, the way's first and last node will be the same. This is called a "closed way".

Note that closed ways occasionally represent loops, such as roundabouts on highways, rather than solid areas. The way's tags must be examined to discover which it is.

Areas with holes, or with boundaries of more than 2,000 nodes, cannot be represented by a single way. Instead, the feature will require a more complex multipolygon relation data structure.

### Relation

A relation is a multi-purpose data structure that documents a relationship between two or more data elements (nodes, ways, and/or other relations). Examples include:

* A boundary relation, which defines the boundary of a country or region from multiple ways e.g. a river and a coastline.
* A multipolygon that describes an area (whose boundary is the 'outer way') with holes (the 'inner ways').

Thus, relations can have different meanings. The relation's meaning is defined by its tags. Typically, the relation will have a 'type' tag. The relation's other tags need to be interpreted in light of the type tag.

The relation is primarily an ordered list of nodes, ways, or other relations. These objects are known as the relation's members.

Each element can optionally have a role within the relation. For example, a turn restriction would have members with "from" and "to" roles, describing the particular turn that is forbidden.

A single element, such as a particular way, may appear multiple times in a relation.

### Observation

An [observation](../../reference/record-types/observation) records an
individual's observation that something exists at a certain location. It is a
subjective statement of 'I saw/heard this, here'. An observation normally
includes the location of the observer (recorded with a GPS). Mapeo nodes and
ways are often created on the basis of observations, but they might not be in
the same location. E.g. a Mapeo user might record their observation of a school
building while they are standing on the street in front of the building. The
observation location would be the point on the street where the observer was
standing.

Observations _should_ link to nodes and ways that are created from observations (NB: At this time Mapeo apps do not have this functionality). They provide an auditable history of how/why a node or way was created. A node or way might have multiple linked observations from multiple visits by Mapeo users over time, verifying the location of a node or documenting change to the node (e.g. a school might become an abandoned building, and the linked observations would document who observed this change and when).

## Changeset

:::info
Not currently used in Mapeo Core
:::

Changesets are created by edits in the territory view, and are part of the [OpenStreetMap data model](https://wiki.openstreetmap.org/wiki/API_v0.6#Changesets_2). Mapeo does not currently use changesets for anything.

## Preset

[Presets](../../reference/record-types/preset) define how map entities are displayed to the user. They define the icon used on the map, and the fields /
questions shown to the user when they create or edit the entity on the map. The `tags` property of a preset is used to
match the preset with observations, nodes, ways and relations. If multiple presets match, the one that matches the most
tags is used.

## Field

[Fields](../../reference/record-types/field) are reusable form elements that are associated with presets. For example a field "name" might define a text field for entering the name of a place. This field might be used by multiple different presets. Currently Mapeo supports:

- Text fields
- Select fields (select a value from a list of options)
- Multi-select fields (select multiple values from a list of options)

## Device

:::info
Not yet implemented
:::

The Mapeo security model is based on device. Each device with Mapeo installed can be invited to a project to collaborate with other devices. Devices have a unique `id` and a user-editable name. Only the device owner can edit their device's name. Devices can also have a `removed=true` property, which will ban them from syncing with other devices in a project and will wipe their copy of the project data when they attempt to sync. A device that is an administrator is able to invite other devices to a project

## Project

:::info
Not yet implemented
:::

All data in a Mapeo Core database must be part of a project. One or more devices can participate in a project and synchronize data. Administrator devices are able to invite new devices to a project.
