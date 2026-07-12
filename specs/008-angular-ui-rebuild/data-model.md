# UI Data Model: Modern Angular UI Rebuild

## Persistent Data

This feature introduces no new catalog, collection, scan, import, transfer, or identity persistence model. Existing backend entities and Identity data remain authoritative.

## Client Models

### Session Context

Represents the current browser session.

| Field | Meaning | Validation |
|-------|---------|------------|
| `isAuthenticated` | Whether the current cookie session is authenticated | Derived from server response |
| `displayName` | User-facing account name | Non-empty when authenticated |
| `roles` | Granted roles used to show allowed navigation/actions | Derived from server authorization |
| `setupRequired` | Whether application setup blocks normal workflows | Derived from server setup state |

### Navigation Item

Defines one shell navigation entry.

| Field | Meaning | Validation |
|-------|---------|------------|
| `labelKey` | Localized label identifier | Must resolve in every supported language |
| `route` | Angular route | Must map to a registered screen |
| `requiredRole` | Optional role requirement | Hidden/blocked when not granted |
| `active` | Current-route state | Derived from router |

### UI State

Standard state model shared by primary screens.

| State | Meaning | Required presentation |
|-------|---------|-----------------------|
| `loading` | Request or route transition in progress | Meaningful progress/loading feedback |
| `empty` | Request succeeded with no data | Explanation and next action |
| `success` | Action completed | Clear confirmation without misleading persistence claims |
| `warning` | User attention required, action may continue | Visible warning and next step |
| `error` | Action failed | User-understandable explanation and recovery action |
| `accessDenied` | Session lacks permission | Navigation to an allowed area |
| `notFound` | No matching route/resource | Navigation to a valid screen |

### Screen Inventory Entry

Tracks parity before the cutover.

| Field | Meaning | Validation |
|-------|---------|------------|
| `legacyRoute` | Current user-facing route | Unique across inventory |
| `replacementRoute` | Angular replacement route | Must be routable under server fallback |
| `migrationBehavior` | Redirect, guided replacement, or retired explanation | Required for every legacy route |
| `workflow` | User workflow represented | Must map to a feature screen |
| `parityStatus` | Planned, implemented, verified | Must be verified before legacy retirement |
| `acceptanceJourney` | End-to-end proof reference | Required for every primary workflow |

### Operation Status View

Normalizes long-running import, transfer, scan, and batch-scan display.

| Field | Meaning | Validation |
|-------|---------|------------|
| `operationType` | Import, transfer, scan, or batch scan | One supported backend operation type |
| `status` | Current backend status | Derived from server response |
| `progress` | Optional completed/total or phase details | Display loading/progress while active |
| `warnings` | Warning count/details | Visible when non-zero |
| `errors` | Error count/details | Visible with recovery/report action |
| `actions` | Allowed cancel/resume/retry/review actions | Derived from state and authorization |

## Relationships

```text
Application Shell
  ├── Session Context
  ├── Navigation Items → Primary Workflow Screens
  └── UI States

Primary Workflow Screen
  ├── Screen Inventory Entry
  └── Operation Status View (when long-running)
```

## State Transitions

```text
Route requested → loading → content | empty | accessDenied | notFound | error
User action → loading → success | warning | error
Long-running operation → loading/progress → success | warning | error | cancelled
```
