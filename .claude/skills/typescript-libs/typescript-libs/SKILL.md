---
name: typescript-libs
description: Expert guidance for TypeScript development using ts-toolbelt (advanced type utilities), lodash (data manipulation), TanStack Router (type-safe routing), TanStack Query (data fetching/caching), Zod (schema validation), TypeDI (dependency injection), and the p-* family (40+ promise utilities for concurrency, retries, timeouts, debouncing, throttling, etc.). Use when working with TypeScript projects involving these libraries, async operations, promise patterns, type-level programming, routing, state management, validation, or dependency injection.
---

# TypeScript Libraries Expert

## Overview

Provide expert-level guidance on essential TypeScript libraries for modern application development. This skill covers advanced patterns, integrations, and best practices for production-grade TypeScript development.

**Core Libraries:**
- ts-toolbelt, lodash, TanStack Router, TanStack Query, Zod, TypeDI

**Promise Utilities (p-* family):**
- 40+ utilities for async operations including concurrency control, retries, timeouts, debouncing, throttling, and advanced promise patterns

## Core Capabilities

### 1. Type-Level Programming with ts-toolbelt

Use ts-toolbelt when advanced type manipulation is needed:
- Complex union/intersection operations
- Deep object type transformations
- Function type composition and inference
- Conditional type logic based on type properties

**Quick reference**: Load `references/library_patterns.md` for specific patterns.

### 2. Data Manipulation with lodash

Apply lodash for:
- Deep object operations (merge, clone, get/set paths)
- Collection transformations beyond native methods
- Performance utilities (debounce, throttle, memoize)
- Functional programming patterns

**Integration**: Combine with ts-toolbelt for type-safe utility functions.

### 3. Type-Safe Routing with TanStack Router

Implement TanStack Router for:
- Fully type-safe route parameters and search params
- Route-level code splitting and lazy loading
- Data loading patterns with loaders
- Integration with TanStack Query for data fetching

**Key pattern**: Always use Zod for search param validation.

### 4. Server State Management with TanStack Query

Use TanStack Query for:
- Automatic background data synchronization
- Intelligent caching with configurable strategies
- Optimistic updates for responsive UIs
- Infinite scrolling and pagination patterns
- Dependent and parallel query orchestration

**Integration**: Combine with TypeDI for injected query services.

### 5. Schema Validation with Zod

Apply Zod for:
- Runtime validation with TypeScript type inference
- API request/response validation
- Form validation with type safety
- Data transformation and parsing
- Integration with TanStack Router for route validation

**Pattern**: Always infer TypeScript types from schemas using `z.infer<>`.

### 6. Dependency Injection with TypeDI

Implement TypeDI for:
- Decoupled, testable service architecture
- Singleton and transient service lifecycles
- Constructor and property injection
- Factory patterns for complex instantiation
- Mock injection for testing

**Requirement**: Must import 'reflect-metadata' at application entry point.

### 7. Promise Utilities with p-* Family

Use the p-* family for advanced async operations:
- **Concurrency control**: p-map, p-limit, p-queue, p-all for controlled parallel execution
- **Retry & timeout**: p-retry, p-timeout for resilient operations  
- **Function utilities**: p-debounce, p-throttle, p-memoize for optimized async functions
- **Control flow**: p-series, p-waterfall, p-pipe for sequential pipelines
- **Combinators**: p-any, p-some, p-props, p-settle for flexible promise handling
- **Synchronization**: p-mutex, p-wait-for for coordination
- **Advanced patterns**: p-cancelable, p-progress, p-lazy for complex scenarios

**Quick reference**: Load `references/p_family.md` for specific utilities and patterns.

**Integration**: Works seamlessly with TanStack Query for data fetching and TypeDI for service-layer operations.

## Integration Patterns

Common library combinations for specific use cases:

**Full-Stack Type Safety**
```
TanStack Router (routes) + Zod (validation) + TanStack Query (data) + TypeDI (services)
```

**Type-Safe Utilities**
```
ts-toolbelt (type transforms) + lodash (runtime operations)
```

**Service Layer**
```
TypeDI (injection) + Zod (input validation) + TanStack Query (data fetching)
```

**Resilient Data Fetching**
```
TanStack Query + p-retry (retries) + p-timeout (timeouts) + p-limit (rate limiting)
```

**Async Pipeline**
```
p-pipe (pipeline) + p-map (parallel) + p-waterfall (sequential) + Zod (validation)
```

**Controlled Concurrency**
```
p-queue (queue) + p-limit (limiter) + p-throttle (rate limit) + TypeDI (services)
```

## Response Strategy

1. **Quick Questions**: Direct answers with minimal code
2. **Implementation Help**: Complete working examples with context
3. **Architecture Decisions**: Trade-offs, alternatives, best practices
4. **Debugging**: Common issues and solutions
5. **Learning**: Progressive concept explanation

## Quality Standards

All code examples must:
- Compile in TypeScript strict mode
- Follow modern ES6+ conventions
- Use async/await over promise chains
- Include proper error handling
- Be self-contained yet practical
- Demonstrate type safety throughout

## Reference Documentation

Load reference files as needed:

**`references/library_patterns.md`** - Core six libraries:
- Detailed patterns and examples for ts-toolbelt, lodash, TanStack Router, TanStack Query, Zod, and TypeDI
- Common use cases and anti-patterns
- Integration examples showing libraries working together
- Type-level programming techniques

**`references/p_family.md`** - Promise utilities:
- Complete guide to 40+ p-* utilities
- Concurrency control patterns (p-map, p-limit, p-queue)
- Retry and timeout strategies (p-retry, p-timeout)
- Function optimization (p-debounce, p-throttle, p-memoize)
- Control flow patterns (p-series, p-waterfall, p-pipe)
- Advanced async patterns and synchronization
- Integration examples with core libraries

Load when:
- User asks specific questions about library usage
- Complex integration patterns are needed
- Detailed examples or API references required
- User requests best practices or async patterns
