# Pendon Architecture

> Notes are not static.
>
> They evolve.

This document defines the core engineering principles behind Pendon.

It is intentionally small.

Every feature should follow these principles.

---

# Vision

Pendon is not another note-taking application.

Pendon is an infinite thinking canvas where every note can evolve into richer objects over time.

A note should never be replaced.

A note should gain new capabilities while preserving its identity.

The product is built around transformation rather than creation.

---

# Product Philosophy

Every object starts as a note.

Examples:

Plain Note

↓

Formula

↓

Checklist

↓

Workflow

↓

Graph

↓

API

↓

AI Assistant

The object remains the same.

Only its behavior changes.

---

# Core Principle

A Pendon object never changes identity.

Only its behavior changes.

This is the single most important rule in the system.

If we violate this principle, Pendon becomes another whiteboard.

---

# Architectural Layers

┌──────────────────────────────┐
│        React UI              │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│      Pendon Behaviors        │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│        Pendon Shape          │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│       tldraw Editor          │
└──────────────────────────────┘

tldraw owns the canvas.

Pendon owns behaviors.

---

# Responsibilities

## tldraw

Responsible for:

- Infinite canvas
- Pan
- Zoom
- Selection
- Dragging
- Resizing
- Undo / Redo
- Clipboard
- Shape persistence
- Collaboration (future)

Pendon should never reimplement these.

---

## Pendon

Responsible for:

- Behaviors
- Behavior registry
- Behavior rendering
- Context actions
- Behavior conversion
- Business logic

Pendon should not implement canvas functionality.

---

# Shape Philosophy

Pendon should have one primary shape.

PendonShape

Not:

FormulaShape

ChecklistShape

WorkflowShape

GraphShape

The same object simply behaves differently.

---

# Behavior Philosophy

A behavior adds capabilities to a note.

It never replaces the note.

Initial behaviors:

- Plain
- Formula

Future behaviors:

- Checklist
- Workflow
- Graph
- Calendar
- Kanban
- API
- AI

Every behavior should be implemented as a plugin.

No behavior should become a special case.

---

# Rendering Flow

Editor

↓

PendonShape

↓

Behavior

↓

Renderer

↓

React Component

React renders.

Behaviors decide.

Editor stores.

---

# Data Flow

User Action

↓

Editor

↓

Shape Updated

↓

Behavior Renderer

↓

UI Updates

React should never become the source of truth.

The Editor is the source of truth.

---

# Design Principles

Objects have memory.

Nothing disappears.

Everything transforms.

Animations should communicate evolution rather than replacement.

Prefer:

- layout transitions
- expansion
- unfolding
- morphing

Avoid:

- fade out
- fade in
- replacing components

The user should always feel they are interacting with the same object.

---

# UI Philosophy

Pendon is not a spreadsheet.

Pendon is not a whiteboard.

Pendon is not a database.

Pendon feels like paper becoming intelligent.

Interfaces should remain:

- spacious
- minimal
- calm
- tactile

Avoid unnecessary controls.

Progressive disclosure over visible complexity.

---

# Engineering Principles

Keep the engine independent.

Keep behaviors modular.

Prefer composition over inheritance.

Avoid feature-specific abstractions.

Do not optimize prematurely.

Build only what the next behavior requires.

---

# V1 Scope

The first milestone proves one idea.

Double Click

↓

Create Note

↓

Right Click

↓

Add Behavior

↓

Formula

↓

Edit Values

↓

Live Total

If users understand this interaction,

Pendon succeeds.

Everything else comes later.

---

# Decision Framework

Before implementing any feature, ask:

Does this make the note feel more alive?

If yes,

build it.

If no,

don't.
