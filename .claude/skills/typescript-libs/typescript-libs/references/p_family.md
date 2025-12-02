# P-* Family - Promise Utilities Reference

The p-* family provides powerful utilities for working with promises and async operations. All packages are from [Sindre Sorhus](https://github.com/sindresorhus) and follow consistent patterns.

## Installation

```bash
# Install individual packages as needed
npm install p-map p-limit p-queue p-retry p-timeout
npm install p-debounce p-throttle p-memoize
npm install p-all p-any p-some p-props p-settle
npm install p-series p-waterfall p-pipe
npm install delay yoctodelay
```

## Core Utilities

### pify - Promisify Callbacks

Convert callback-style functions to promise-based.

```typescript
import pify from 'pify';
import fs from 'fs';

// Single function
const readFile = pify(fs.readFile);
await readFile('package.json', 'utf8');

// Entire module
const fsPromises = pify(fs);
await fsPromises.readFile('file.txt', 'utf8');

// Custom error handling
const custom = pify(callbackFn, {
  errorFirst: true,
  multiArgs: false
});
```

**Use cases**: Legacy callback APIs, Node.js fs operations, third-party callback libraries

### delay - Promise Delay

Delay a promise for a specified time.

```typescript
import delay from 'delay';

// Basic delay
await delay(1000); // Wait 1 second

// With value
const result = await delay(500, { value: 'done' });

// Abortable
const controller = new AbortController();
const delayPromise = delay(1000, { signal: controller.signal });
controller.abort(); // Cancel the delay

// Conditional delays
if (needsRateLimit) {
  await delay(1000);
}
```

**Use cases**: Rate limiting, retry backoff, animation timing, testing

### yoctodelay - Precise Delays

Ultra-precise delays using `performance.now()`.

```typescript
import yoctodelay from 'yoctodelay';

// More precise than delay for short intervals
await yoctodelay(100); // 100ms with high precision

// Critical for time-sensitive operations
for (let i = 0; i < 10; i++) {
  await yoctodelay(50);
  updateAnimation();
}
```

**Use cases**: Animation frames, high-frequency polling, precise timing requirements

## Concurrency Control

### p-map - Concurrent Mapping

Map over promises with concurrency control.

```typescript
import pMap from 'p-map';

const urls = ['url1', 'url2', 'url3', ...];

// Concurrent with limit
const results = await pMap(urls, async (url) => {
  return fetch(url).then(r => r.json());
}, { concurrency: 3 }); // Max 3 concurrent requests

// With stop on error control
const results = await pMap(items, processItem, {
  concurrency: 5,
  stopOnError: false // Continue even if some fail
});
```

**Use cases**: Batch API calls, parallel file processing, controlled scraping

### p-all - Run Functions Concurrently

Execute promise-returning functions with optional concurrency limit.

```typescript
import pAll from 'p-all';

const tasks = [
  () => fetchUser(1),
  () => fetchUser(2),
  () => fetchUser(3),
];

// All at once
const results = await pAll(tasks);

// With concurrency limit
const results = await pAll(tasks, { concurrency: 2 });

// Lazy evaluation - functions only called when slot available
const lazyTasks = Array.from({ length: 100 }, (_, i) => 
  () => expensiveOperation(i)
);
await pAll(lazyTasks, { concurrency: 5 });
```

**Use cases**: Task queues, controlled parallel execution, resource management

### p-limit - Concurrency Limiter

Create a function that limits promise concurrency.

```typescript
import pLimit from 'p-limit';

const limit = pLimit(2); // Max 2 concurrent

const urls = ['url1', 'url2', 'url3', 'url4'];

// Each call respects the limit
const promises = urls.map(url => 
  limit(() => fetch(url))
);

await Promise.all(promises);

// With priority
const highPriority = limit(() => criticalTask(), 10);
const lowPriority = limit(() => normalTask(), 1);
```

**Use cases**: API rate limiting, database connection pooling, resource throttling

### p-queue - Advanced Queue

Promise queue with priority and concurrency control.

```typescript
import PQueue from 'p-queue';

const queue = new PQueue({
  concurrency: 2,
  interval: 1000,
  intervalCap: 5 // Max 5 per second
});

// Add tasks
queue.add(() => fetchData(1));
queue.add(() => fetchData(2), { priority: 1 });

// Wait for queue
await queue.onIdle();

// Pause/resume
queue.pause();
queue.start();

// Size and pending
console.log(queue.size); // Queued tasks
console.log(queue.pending); // Running tasks

// Events
queue.on('active', () => console.log('Task started'));
queue.on('idle', () => console.log('Queue empty'));
```

**Use cases**: Task scheduling, rate-limited APIs, job processing, background workers

## Function Utilities

### p-debounce - Promise Debouncing

Debounce promise-returning functions.

```typescript
import pDebounce from 'p-debounce';

const search = pDebounce(async (query: string) => {
  return fetch(`/api/search?q=${query}`).then(r => r.json());
}, 300);

// Only the last call within 300ms executes
search('a'); // Cancelled
search('ab'); // Cancelled
search('abc'); // Executes after 300ms
```

**Use cases**: Search autocomplete, form validation, resize handlers

### p-throttle - Promise Throttling

Throttle promise-returning functions.

```typescript
import pThrottle from 'p-throttle';

const throttle = pThrottle({
  limit: 5,
  interval: 1000 // 5 calls per second
});

const throttledFetch = throttle(async (url: string) => {
  return fetch(url);
});

// Automatic rate limiting
for (const url of urls) {
  await throttledFetch(url); // Respects rate limit
}
```

**Use cases**: API rate limiting, network request throttling, controlled polling

### p-memoize - Promise Memoization

Memoize promise-returning functions.

```typescript
import pMemoize from 'p-memoize';

const expensiveOp = pMemoize(async (id: number) => {
  return fetchFromDatabase(id);
}, {
  maxAge: 5000 // Cache for 5 seconds
});

// First call hits database
await expensiveOp(1); 

// Second call returns cached
await expensiveOp(1);

// Custom cache key
const memoized = pMemoize(fn, {
  cacheKey: (args) => JSON.stringify(args)
});
```

**Use cases**: Database query caching, API response caching, expensive computations

## Timeout & Retry

### p-timeout - Promise Timeout

Timeout a promise after specified time.

```typescript
import pTimeout from 'p-timeout';

// Basic timeout
const result = await pTimeout(
  fetch('https://slow-api.com'),
  5000 // 5 second timeout
);

// With fallback
const result = await pTimeout(
  riskyOperation(),
  1000,
  () => 'fallback value'
);

// Custom error
await pTimeout(promise, 1000, () => {
  throw new CustomTimeoutError('Too slow!');
});
```

**Use cases**: Network requests, user operations, health checks

### p-retry - Retry Failed Promises

Retry failed operations with backoff.

```typescript
import pRetry from 'p-retry';

// Basic retry
const result = await pRetry(
  () => fetch('https://api.example.com'),
  { retries: 3 }
);

// With exponential backoff
const result = await pRetry(
  async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed');
    return response.json();
  },
  {
    retries: 5,
    factor: 2, // Exponential backoff
    minTimeout: 1000,
    maxTimeout: 60000,
    onFailedAttempt: (error) => {
      console.log(`Attempt ${error.attemptNumber} failed`);
    }
  }
);
```

**Use cases**: Network failures, transient errors, flaky APIs, database reconnection

## Promise Combinators

### p-any - First Fulfilled

Wait for any promise to fulfill.

```typescript
import pAny from 'p-any';

// First successful
const fastest = await pAny([
  fetch('https://api1.com'),
  fetch('https://api2.com'),
  fetch('https://api3.com')
]);

// All failed throws AggregateError
try {
  await pAny([
    Promise.reject('fail1'),
    Promise.reject('fail2')
  ]);
} catch (error) {
  console.log(error.errors); // ['fail1', 'fail2']
}
```

**Use cases**: Fallback sources, fastest mirror, redundant APIs

### p-some - Wait for N Promises

Wait for a specified number of promises to fulfill.

```typescript
import pSome from 'p-some';

// Wait for 2 fastest
const fastest2 = await pSome(
  [
    fetch('url1'),
    fetch('url2'),
    fetch('url3'),
    fetch('url4')
  ],
  { count: 2 }
);

// Filter option
const results = await pSome(promises, {
  count: 3,
  filter: (result) => result.status === 'success'
});
```

**Use cases**: Partial results, fastest N responses, voting systems

### p-props - Promise Object/Map

Like `Promise.all()` but for objects and Maps.

```typescript
import pProps from 'p-props';

// Object of promises
const results = await pProps({
  user: fetchUser(),
  posts: fetchPosts(),
  comments: fetchComments()
});
// results: { user: User, posts: Post[], comments: Comment[] }

// Map of promises
const map = new Map([
  ['key1', promise1],
  ['key2', promise2]
]);
const results = await pProps(map);

// With concurrency
const results = await pProps(promiseObject, {
  concurrency: 2
});
```

**Use cases**: Parallel data fetching, dependent resource loading, dashboard data

### p-settle - Settle All Promises

Get fulfillment value or rejection reason for all promises.

```typescript
import pSettle from 'p-settle';

const results = await pSettle([
  Promise.resolve('success'),
  Promise.reject(new Error('failed')),
  fetchData()
]);

// Results with status
results.forEach(result => {
  if (result.isFulfilled) {
    console.log('Success:', result.value);
  } else {
    console.log('Error:', result.reason);
  }
});

// With concurrency
const results = await pSettle(promises, { concurrency: 3 });
```

**Use cases**: Batch operations, error collection, partial success handling

## Control Flow

### p-series - Serial Execution

Run promises in series, one after another.

```typescript
import pSeries from 'p-series';

const tasks = [
  () => step1(),
  () => step2(),
  () => step3()
];

// Execute sequentially
const results = await pSeries(tasks);

// Early termination on error
try {
  await pSeries(tasks);
} catch (error) {
  // Stops at first error
}
```

**Use cases**: Sequential operations, ordered processing, migration scripts

### p-waterfall - Pass Results Forward

Run promises in series, passing results to next function.

```typescript
import pWaterfall from 'p-waterfall';

const result = await pWaterfall([
  () => fetchUser(1),
  (user) => fetchUserPosts(user.id),
  (posts) => enrichPosts(posts),
  (enriched) => saveToDB(enriched)
]);

// Result is final value
```

**Use cases**: Data transformation pipelines, sequential processing with context

### p-pipe - Reusable Pipeline

Compose promise functions into reusable pipeline.

```typescript
import pPipe from 'p-pipe';

const pipeline = pPipe(
  fetchData,
  validateData,
  transformData,
  saveData
);

// Reusable
const result1 = await pipeline(input1);
const result2 = await pipeline(input2);

// Type-safe with TypeScript
const typedPipeline = pPipe<number, string, boolean>(
  async (n: number) => String(n),
  async (s: string) => s.length > 0
);
```

**Use cases**: Data processing, middleware chains, ETL operations

### p-whilst & p-do-whilst - Conditional Loops

Loop while condition is true.

```typescript
import pWhilst from 'p-whilst';

let count = 0;

// Whilst - check first
await pWhilst(
  () => count < 5,
  async () => {
    await processItem(count);
    count++;
  }
);

// Do-whilst - execute first
import pDoWhilst from 'p-do-whilst';

await pDoWhilst(
  async () => {
    const item = await fetchNext();
    await process(item);
    return item;
  },
  (item) => item !== null
);
```

**Use cases**: Polling, pagination, event waiting

### p-forever - Infinite Loop

Run until manually stopped.

```typescript
import pForever from 'p-forever';

const stopFlag = { stopped: false };

const loop = pForever(async () => {
  if (stopFlag.stopped) {
    throw new Error('Stopped');
  }
  await pollForUpdates();
  await delay(1000);
});

// Stop it later
setTimeout(() => {
  stopFlag.stopped = true;
}, 60000);
```

**Use cases**: Background workers, continuous polling, monitoring

### p-times - Repeat N Times

Execute a function N times concurrently.

```typescript
import pTimes from 'p-times';

// Create 10 users concurrently
const users = await pTimes(10, async (i) => {
  return createUser(`user${i}`);
});

// With concurrency limit
const results = await pTimes(100, async (i) => {
  return processItem(i);
}, { concurrency: 5 });
```

**Use cases**: Batch creation, load testing, initialization

## Synchronization

### p-mutex - Mutual Exclusion

Ensure only one operation accesses a resource at a time.

```typescript
import pMutex from 'p-mutex';

const mutex = pMutex();

async function criticalSection() {
  const release = await mutex.lock();
  try {
    // Only one execution at a time
    await modifySharedResource();
  } finally {
    release();
  }
}

// Multiple calls serialize automatically
await Promise.all([
  criticalSection(),
  criticalSection(),
  criticalSection()
]);
```

**Use cases**: File access, shared state, database transactions

### p-wait-for - Wait for Condition

Wait until a condition becomes true.

```typescript
import pWaitFor from 'p-wait-for';

// Wait for condition
await pWaitFor(
  () => document.querySelector('.loaded'),
  { interval: 100, timeout: 5000 }
);

// Async condition
await pWaitFor(
  async () => {
    const status = await checkStatus();
    return status === 'ready';
  },
  { interval: 500 }
);
```

**Use cases**: DOM ready, resource availability, state changes

## Advanced Patterns

### p-cancelable - Cancelable Promises

Create promises that can be canceled.

```typescript
import PCancelable from 'p-cancelable';

const promise = new PCancelable((resolve, reject, onCancel) => {
  const timeout = setTimeout(() => resolve('done'), 5000);
  
  onCancel(() => {
    clearTimeout(timeout);
  });
});

// Cancel it
promise.cancel();
```

**Use cases**: User-initiated cancellation, navigation changes, timeout alternatives

### p-progress - Progress Reporting

Create promises that report progress.

```typescript
import PProgress from 'p-progress';

const promise = new PProgress((resolve, reject, progress) => {
  let completed = 0;
  const total = 100;
  
  const interval = setInterval(() => {
    completed += 10;
    progress(completed / total);
    
    if (completed >= total) {
      clearInterval(interval);
      resolve('done');
    }
  }, 100);
});

promise.onProgress(p => {
  console.log(`${Math.round(p * 100)}% complete`);
});

await promise;
```

**Use cases**: File uploads, large computations, batch processing

### p-lazy - Lazy Promises

Defer execution until `.then()` or `.catch()` is called.

```typescript
import PLazy from 'p-lazy';

const lazy = new PLazy((resolve) => {
  console.log('Executing now!'); // Only logs when awaited
  resolve('result');
});

// Not executed yet
await delay(1000);

// Executes now
await lazy;
```

**Use cases**: Conditional execution, resource optimization, deferred loading

### p-defer - Deferred Promises

Create a promise with external resolve/reject.

```typescript
import pDefer from 'p-defer';

const deferred = pDefer<string>();

// Resolve from anywhere
setTimeout(() => {
  deferred.resolve('done');
}, 1000);

// Or reject
// deferred.reject(new Error('failed'));

const result = await deferred.promise;
```

**Use cases**: Event-driven promises, complex control flow, integration bridges

## Utilities

### p-min-delay - Minimum Delay

Ensure a promise takes at least a minimum time.

```typescript
import pMinDelay from 'p-min-delay';

// Ensure spinner shows for at least 1s
const result = await pMinDelay(
  fetchData(),
  1000
);
```

**Use cases**: Loading indicators, UX smoothness, rate limiting

### p-time - Measure Time

Measure how long a promise takes to resolve.

```typescript
import pTime from 'p-time';

const { value, milliseconds } = await pTime(async () => {
  return expensiveOperation();
});

console.log(`Took ${milliseconds}ms`);
```

**Use cases**: Performance monitoring, benchmarking, profiling

### p-race - Better Promise.race

Improved `Promise.race()` with error handling.

```typescript
import pRace from 'p-race';

const fastest = await pRace([
  fetch('api1'),
  fetch('api2')
]);

// Cancels slower promises
```

**Use cases**: Fastest response, timeout with fallback, redundant operations

## Integration Patterns

### With TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query';
import pRetry from 'p-retry';
import pTimeout from 'p-timeout';

const fetchWithRetry = (url: string) => 
  pRetry(
    () => pTimeout(fetch(url), 5000),
    { retries: 3 }
  );

const query = useQuery({
  queryKey: ['data'],
  queryFn: () => fetchWithRetry('/api/data')
});
```

### With TypeDI

```typescript
import { Service } from 'typedi';
import pLimit from 'p-limit';
import pMemoize from 'p-memoize';

@Service()
class ApiService {
  private limit = pLimit(5);
  
  private cachedFetch = pMemoize(
    async (url: string) => {
      return this.limit(() => fetch(url));
    },
    { maxAge: 60000 }
  );
  
  async getData(id: number) {
    return this.cachedFetch(`/api/data/${id}`);
  }
}
```

### Batch Processing Pipeline

```typescript
import pMap from 'p-map';
import pRetry from 'p-retry';
import pSettle from 'p-settle';
import pPipe from 'p-pipe';

const pipeline = pPipe(
  (items) => pMap(items, processItem, { concurrency: 10 }),
  (processed) => pMap(processed, validateItem, { concurrency: 5 }),
  (validated) => pSettle(validated.map(saveItem))
);

const results = await pipeline(inputItems);
```
