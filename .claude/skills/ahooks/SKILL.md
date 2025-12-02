# ahooks - React Hooks Library Skill

## Purpose
Provide comprehensive guidance on using ahooks, a high-quality and reliable React Hooks library maintained by Alibaba. This skill helps developers understand, implement, and optimize React applications using ahooks' extensive collection of custom hooks.

## Overview

**ahooks** is a comprehensive React Hooks library that provides:
- 60+ custom hooks for common use cases
- TypeScript support out of the box
- SSR (Server-Side Rendering) compatibility
- Well-tested and production-ready
- Maintained by Alibaba

**Installation:**
```bash
npm install ahooks
# or
yarn add ahooks
# or
pnpm add ahooks
```

**Documentation:** https://ahooks.js.org/

---

## Hook Categories

### 1. State Hooks
Hooks for managing component state efficiently.

#### useBoolean
Toggle boolean state with helper methods.

```typescript
import { useBoolean } from 'ahooks';

function Component() {
  const [state, { toggle, setTrue, setFalse }] = useBoolean(false);
  
  return (
    <div>
      <p>State: {state ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Set True</button>
      <button onClick={setFalse}>Set False</button>
    </div>
  );
}
```

**Use Cases:**
- Modal/dialog visibility
- Feature toggles
- Loading states
- Form field visibility

#### useToggle
Toggle between two values.

```typescript
import { useToggle } from 'ahooks';

function Component() {
  const [state, { toggle, set, setLeft, setRight }] = useToggle('light', 'dark');
  
  return (
    <div className={`theme-${state}`}>
      <button onClick={toggle}>Toggle Theme</button>
      <button onClick={() => set('light')}>Light</button>
      <button onClick={() => set('dark')}>Dark</button>
    </div>
  );
}
```

**Use Cases:**
- Theme switching
- View mode toggles (list/grid)
- Language switching
- Any binary state

#### useSetState
Manage object state like React class components.

```typescript
import { useSetState } from 'ahooks';

function Component() {
  const [state, setState] = useSetState({
    name: '',
    email: '',
    age: 0
  });
  
  return (
    <form>
      <input 
        value={state.name}
        onChange={e => setState({ name: e.target.value })}
      />
      <input 
        value={state.email}
        onChange={e => setState({ email: e.target.value })}
      />
    </form>
  );
}
```

**Advantages over useState:**
- Automatically merges state (like class component setState)
- Cleaner updates for object state
- No manual spreading needed

#### useLocalStorageState / useSessionStorageState
Persist state in browser storage.

```typescript
import { useLocalStorageState } from 'ahooks';

function Component() {
  const [user, setUser] = useLocalStorageState('user', {
    defaultValue: { name: '', token: '' }
  });
  
  // State automatically syncs with localStorage
  // Persists across page refreshes
  
  return (
    <div>
      <input 
        value={user?.name || ''}
        onChange={e => setUser({ ...user, name: e.target.value })}
      />
    </div>
  );
}
```

**Use Cases:**
- User preferences
- Authentication tokens
- Shopping cart data
- Form draft saving

---

### 2. Effect Hooks
Enhanced useEffect variations for common patterns.

#### useMount / useUnmount
Execute code on component mount/unmount.

```typescript
import { useMount, useUnmount } from 'ahooks';

function Component() {
  useMount(() => {
    console.log('Component mounted');
    // Fetch initial data
    // Start subscriptions
  });
  
  useUnmount(() => {
    console.log('Component unmounting');
    // Cleanup subscriptions
    // Save state
  });
  
  return <div>Component</div>;
}
```

**Advantages over useEffect:**
- More explicit intent
- No dependency array needed
- Cleaner code
- ESLint-friendly

#### useUpdateEffect / useUpdateLayoutEffect
Skip effect on initial render, only run on updates.

```typescript
import { useUpdateEffect } from 'ahooks';

function Component({ userId }) {
  useUpdateEffect(() => {
    // Only runs when userId changes, NOT on mount
    fetchUserData(userId);
  }, [userId]);
  
  return <div>User: {userId}</div>;
}
```

**Use Cases:**
- Sync with external data on prop changes
- Analytics tracking on updates
- Dependent data fetching

#### useDebounceEffect / useThrottleEffect
Debounced/throttled effects.

```typescript
import { useDebounceEffect } from 'ahooks';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  
  useDebounceEffect(
    () => {
      // Only runs 500ms after user stops typing
      performSearch(searchTerm);
    },
    [searchTerm],
    { wait: 500 }
  );
  
  return (
    <input 
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  );
}
```

**Use Cases:**
- Search input handling
- API calls on user input
- Window resize handlers
- Scroll event handlers

#### useInterval / useTimeout
Declarative timers with automatic cleanup.

```typescript
import { useInterval } from 'ahooks';

function Timer() {
  const [count, setCount] = useState(0);
  
  useInterval(() => {
    setCount(count + 1);
  }, 1000); // Runs every second
  
  return <div>Count: {count}</div>;
}
```

**Advantages:**
- Automatic cleanup
- No memory leaks
- Works with React strict mode
- Can be paused/resumed

---

### 3. Request Hooks
Manage async data fetching and loading states.

#### useRequest
Powerful async request management with caching, retry, and more.

```typescript
import { useRequest } from 'ahooks';

async function fetchUser(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

function UserProfile({ userId }) {
  const { data, loading, error, run, refresh } = useRequest(
    () => fetchUser(userId),
    {
      manual: false, // Auto-run on mount
      cacheKey: `user-${userId}`,
      staleTime: 5000, // Cache for 5 seconds
      retryCount: 3,
      onSuccess: (data) => {
        console.log('User loaded:', data);
      },
      onError: (error) => {
        console.error('Failed to load user:', error);
      }
    }
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

**Key Features:**
- Loading states management
- Error handling
- Automatic retries
- Request caching
- Polling support
- Debounce/throttle
- Manual trigger
- Parallel/sequential requests
- Request cancellation

**Advanced Patterns:**

```typescript
// Pagination
const { data, loading, pagination } = useRequest(
  ({ current, pageSize }) => fetchList(current, pageSize),
  {
    paginated: true,
    defaultPageSize: 10
  }
);

// Load more (infinite scroll)
const { data, loading, loadMore, loadingMore } = useRequest(
  (lastId) => fetchItems(lastId),
  {
    loadMore: true,
    isNoMore: (data) => data.length === 0
  }
);

// Polling
const { data, cancel } = useRequest(fetchStatus, {
  pollingInterval: 3000, // Poll every 3 seconds
  pollingWhenHidden: false // Stop when tab hidden
});

// Debounced search
const { data, run } = useRequest(searchAPI, {
  manual: true,
  debounceWait: 300
});
```

---

### 4. DOM Hooks
Interact with DOM elements and events.

#### useEventListener
Add event listeners with automatic cleanup.

```typescript
import { useEventListener } from 'ahooks';

function Component() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  useEventListener('mousemove', (event: MouseEvent) => {
    setCoords({ x: event.clientX, y: event.clientY });
  });
  
  return <div>Mouse: {coords.x}, {coords.y}</div>;
}

// Listen to specific element
function ClickTracker() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEventListener(
    'click',
    () => console.log('Div clicked!'),
    { target: ref }
  );
  
  return <div ref={ref}>Click me</div>;
}
```

**Use Cases:**
- Global keyboard shortcuts
- Mouse tracking
- Scroll events
- Resize handlers
- Custom element events

#### useClickAway
Detect clicks outside an element.

```typescript
import { useClickAway } from 'ahooks';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useClickAway(() => {
    setIsOpen(false);
  }, ref);
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div className="dropdown">Content</div>}
    </div>
  );
}
```

**Use Cases:**
- Dropdowns
- Modals
- Popovers
- Context menus
- Tooltips

#### useHover / useFocusWithin
Track hover and focus states.

```typescript
import { useHover } from 'ahooks';

function Card() {
  const ref = useRef<HTMLDivElement>(null);
  const isHovering = useHover(ref);
  
  return (
    <div ref={ref} className={isHovering ? 'card-hover' : 'card'}>
      {isHovering ? 'Hovering!' : 'Hover me'}
    </div>
  );
}
```

#### useSize / useScroll
Monitor element size and scroll position.

```typescript
import { useSize, useScroll } from 'ahooks';

function Component() {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const scroll = useScroll(ref);
  
  return (
    <div ref={ref} style={{ height: 500, overflow: 'auto' }}>
      <p>Width: {size?.width}</p>
      <p>Height: {size?.height}</p>
      <p>Scroll Top: {scroll?.top}</p>
      <p>Scroll Left: {scroll?.left}</p>
    </div>
  );
}
```

---

### 5. Lifecycle Hooks

#### useLockFn
Prevent concurrent function execution.

```typescript
import { useLockFn } from 'ahooks';

function Component() {
  const submit = useLockFn(async () => {
    // Even if clicked multiple times,
    // only one execution at a time
    await api.submit();
  });
  
  return <button onClick={submit}>Submit</button>;
}
```

**Use Cases:**
- Form submissions
- API calls
- File uploads
- Payment processing

#### useDebounce / useThrottle
Debounce or throttle values.

```typescript
import { useDebounce } from 'ahooks';

function SearchInput() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, { wait: 500 });
  
  useEffect(() => {
    // Only runs 500ms after user stops typing
    if (debouncedValue) {
      searchAPI(debouncedValue);
    }
  }, [debouncedValue]);
  
  return (
    <input 
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
```

---

### 6. Advanced Hooks

#### useReactive
Reactive state like Vue.

```typescript
import { useReactive } from 'ahooks';

function Component() {
  const state = useReactive({
    count: 0,
    user: {
      name: '',
      email: ''
    },
    increment() {
      state.count++;
    },
    updateName(name: string) {
      state.user.name = name;
    }
  });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={state.increment}>+1</button>
      <input 
        value={state.user.name}
        onChange={e => state.updateName(e.target.value)}
      />
    </div>
  );
}
```

**Advantages:**
- Mutable updates (easier to reason about)
- No need for setters
- Nested object updates simplified
- Methods co-located with state

#### useCreation
useMemo/useRef alternative that guarantees single creation.

```typescript
import { useCreation } from 'ahooks';

function Component() {
  const expensiveObject = useCreation(
    () => new ExpensiveClass(),
    [] // Only created once
  );
  
  // expensiveObject is guaranteed to be the same instance
  // Better than useMemo which React might recreate
  
  return <div>{expensiveObject.value}</div>;
}
```

**Use Cases:**
- Expensive class instantiation
- Third-party library instances
- Complex object initialization

#### useWhyDidYouUpdate
Debug why component re-rendered.

```typescript
import { useWhyDidYouUpdate } from 'ahooks';

function Component({ userId, data }) {
  useWhyDidYouUpdate('Component', { userId, data });
  
  // Logs which props changed and caused re-render
  
  return <div>User: {userId}</div>;
}
```

---

## Best Practices

### 1. Choose the Right Hook

```typescript
// ❌ Don't use useState for simple toggles
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(!isOpen);

// ✅ Use useBoolean
const [isOpen, { toggle }] = useBoolean(false);

// ❌ Don't manually debounce in useEffect
const [search, setSearch] = useState('');
useEffect(() => {
  const timer = setTimeout(() => {
    performSearch(search);
  }, 500);
  return () => clearTimeout(timer);
}, [search]);

// ✅ Use useDebounceEffect
const [search, setSearch] = useState('');
useDebounceEffect(() => {
  performSearch(search);
}, [search], { wait: 500 });
```

### 2. Request Hook Patterns

```typescript
// ✅ Use caching for frequently accessed data
const { data } = useRequest(fetchUserProfile, {
  cacheKey: 'user-profile',
  staleTime: 60000 // 1 minute cache
});

// ✅ Use manual mode for user-triggered actions
const { run: deleteUser } = useRequest(deleteUserAPI, {
  manual: true,
  onSuccess: () => {
    message.success('Deleted');
  }
});

// ✅ Use polling for real-time updates
const { data } = useRequest(fetchOrderStatus, {
  pollingInterval: 5000,
  pollingWhenHidden: false,
  pollingErrorRetryCount: 3
});
```

### 3. Combine Hooks Effectively

```typescript
function SearchComponent() {
  // Combine multiple ahooks
  const [keyword, setKeyword] = useLocalStorageState('search-keyword');
  const debouncedKeyword = useDebounce(keyword, { wait: 300 });
  
  const { data, loading } = useRequest(
    () => searchAPI(debouncedKeyword),
    {
      refreshDeps: [debouncedKeyword],
      cacheKey: `search-${debouncedKeyword}`,
      ready: !!debouncedKeyword
    }
  );
  
  return (
    <div>
      <input 
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      {loading ? <Spin /> : <Results data={data} />}
    </div>
  );
}
```

### 4. TypeScript Integration

```typescript
import { useRequest } from 'ahooks';

interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

function Component() {
  // TypeScript automatically infers types
  const { data, loading } = useRequest(() => fetchUser('123'));
  
  // data is typed as User | undefined
  // loading is typed as boolean
  
  return <div>{data?.name}</div>;
}
```

---

## Common Patterns & Recipes

### Pattern 1: Master-Detail View

```typescript
function MasterDetailView() {
  const [selectedId, setSelectedId] = useLocalStorageState('selected-id');
  
  const { data: items } = useRequest(fetchItems, {
    cacheKey: 'items-list'
  });
  
  const { data: detail, loading } = useRequest(
    () => fetchDetail(selectedId!),
    {
      ready: !!selectedId,
      refreshDeps: [selectedId],
      cacheKey: `detail-${selectedId}`
    }
  );
  
  return (
    <div>
      <List items={items} onSelect={setSelectedId} />
      {loading ? <Spin /> : <Detail data={detail} />}
    </div>
  );
}
```

### Pattern 2: Optimistic Updates

```typescript
function TodoList() {
  const { data, mutate } = useRequest(fetchTodos);
  
  const { run: toggleTodo } = useRequest(toggleTodoAPI, {
    manual: true,
    onBefore: (id) => {
      // Optimistic update
      mutate((todos) => 
        todos.map(todo => 
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      );
    },
    onError: () => {
      // Revert on error
      mutate();
    }
  });
  
  return (
    <div>
      {data?.map(todo => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onToggle={() => toggleTodo(todo.id)}
        />
      ))}
    </div>
  );
}
```

### Pattern 3: Infinite Scroll

```typescript
function InfiniteList() {
  const { data, loading, loadingMore, loadMore, noMore } = useRequest(
    ({ page = 1 }) => fetchItems(page),
    {
      loadMore: true,
      ref: containerRef,
      isNoMore: (data) => data?.length === 0
    }
  );
  
  return (
    <div ref={containerRef}>
      {data?.map(item => <Item key={item.id} data={item} />)}
      {loadingMore && <Spin />}
      {noMore && <div>No more data</div>}
    </div>
  );
}
```

---

## Migration Guide

### From useState to ahooks

```typescript
// Before
const [isVisible, setIsVisible] = useState(false);
const show = () => setIsVisible(true);
const hide = () => setIsVisible(false);
const toggle = () => setIsVisible(!isVisible);

// After
const [isVisible, { setTrue: show, setFalse: hide, toggle }] = useBoolean();
```

### From useEffect to ahooks

```typescript
// Before
useEffect(() => {
  fetchData();
}, []);

// After
useMount(() => {
  fetchData();
});

// Before
useEffect(() => {
  if (mounted) {
    fetchData();
  }
}, [userId]);

// After
useUpdateEffect(() => {
  fetchData();
}, [userId]);
```

---

## Performance Optimization Tips

1. **Use cacheKey for expensive requests**
```typescript
const { data } = useRequest(expensiveAPI, {
  cacheKey: 'expensive-data',
  staleTime: 300000 // 5 minutes
});
```

2. **Prevent unnecessary rerenders with useCreation**
```typescript
const instance = useCreation(() => new HeavyClass(), []);
```

3. **Debounce user input**
```typescript
const debouncedValue = useDebounce(inputValue, { wait: 300 });
```

4. **Lock async functions**
```typescript
const submit = useLockFn(async () => {
  await submitForm();
});
```

---

## Common Pitfalls to Avoid

❌ **Don't forget manual mode for user actions**
```typescript
// Bad - runs on mount
const { run: deleteUser } = useRequest(deleteAPI);

// Good - only runs when called
const { run: deleteUser } = useRequest(deleteAPI, { manual: true });
```

❌ **Don't use useEffect when ahooks has a better alternative**
```typescript
// Bad
useEffect(() => {
  const timer = setInterval(() => {
    fetchStatus();
  }, 3000);
  return () => clearInterval(timer);
}, []);

// Good
useRequest(fetchStatus, { pollingInterval: 3000 });
```

❌ **Don't ignore loading states**
```typescript
// Bad
const { data } = useRequest(fetchData);
return <div>{data.value}</div>; // Can crash if data is undefined

// Good
const { data, loading } = useRequest(fetchData);
if (loading) return <Spin />;
return <div>{data?.value}</div>;
```

---

## Troubleshooting

### Hook not updating?
- Check if `ready` option is set correctly
- Verify `refreshDeps` array
- Ensure manual mode isn't preventing execution

### Memory leak warnings?
- ahooks handles cleanup automatically
- Check custom cleanup in callbacks
- Verify unmount behavior with useUnmount

### TypeScript errors?
- Ensure async functions return typed Promises
- Use generic types for useRequest: `useRequest<DataType>`
- Check ahooks version for latest TypeScript support

---

## Resources

- **Official Docs**: https://ahooks.js.org/
- **GitHub**: https://github.com/alibaba/hooks
- **NPM**: https://www.npmjs.com/package/ahooks
- **TypeScript**: Full TypeScript support included
- **Bundle Size**: Tree-shakeable, import only what you use

---

## Quick Reference

**State**: useBoolean, useToggle, useSetState, useLocalStorageState
**Effects**: useMount, useUnmount, useUpdateEffect, useDebounceEffect
**Requests**: useRequest (with caching, retry, polling)
**DOM**: useEventListener, useClickAway, useHover, useSize, useScroll
**Performance**: useDebounce, useThrottle, useLockFn, useCreation
**Debug**: useWhyDidYouUpdate
**Advanced**: useReactive, useMemoizedFn, useSafeState
