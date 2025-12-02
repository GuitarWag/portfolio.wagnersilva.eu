# React Performance Optimization Skill

## Purpose
Analyze React components for performance anti-patterns and provide recommendations for proper memoization using `useMemo`, `useCallback`, and constant definitions outside components.

## Key Detection Patterns

### 1. Objects/Arrays in JSX
Detect inline object/array creation in render that causes unnecessary re-renders:
- `<Component style={{}} />`
- `<Component data={[]} />`
- `<Component config={{ key: 'value' }} />`

### 2. Functions in JSX
Detect inline function definitions in render:
- `<button onClick={() => {}} />`
- `<Component onEvent={function() {}} />`
- `<Component render={() => <div />} />`

### 3. Missing useMemo for Expensive Computations
Detect expensive operations in render without memoization:
- Array transformations (map, filter, reduce)
- Object manipulations
- Complex calculations
- Derived state

### 4. Missing useCallback for Function Props
Detect function definitions that should use useCallback:
- Event handlers passed to child components
- Functions in dependency arrays
- Callbacks passed to memoized components

## Analysis Rules

### Rule 1: Inline Objects in Props
```javascript
// ❌ Bad - Creates new object on every render
<MyComponent style={{ margin: 10 }} />

// ✅ Good - Define outside component
const componentStyle = { margin: 10 };
function MyComponent() {
  return <Child style={componentStyle} />;
}

// ✅ Good - Use useMemo for dynamic values
function MyComponent({ isActive }) {
  const style = useMemo(() => ({ 
    margin: 10, 
    opacity: isActive ? 1 : 0.5 
  }), [isActive]);
  return <Child style={style} />;
}
```

### Rule 2: Inline Arrays in Props
```javascript
// ❌ Bad - Creates new array on every render
<MyComponent items={[]} />
<MyComponent options={['a', 'b', 'c']} />

// ✅ Good - Define outside component
const emptyArray = [];
const defaultOptions = ['a', 'b', 'c'];

// ✅ Good - Use useMemo for dynamic arrays
function MyComponent({ data }) {
  const filteredItems = useMemo(() => 
    data.filter(item => item.active), 
    [data]
  );
  return <List items={filteredItems} />;
}
```

### Rule 3: Inline Functions
```javascript
// ❌ Bad - Creates new function on every render
<button onClick={() => console.log('clicked')}>Click</button>

// ✅ Good - Use useCallback
function MyComponent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return <button onClick={handleClick}>Click</button>;
}

// ✅ Good - For functions with dependencies
function MyComponent({ userId }) {
  const handleClick = useCallback(() => {
    saveUser(userId);
  }, [userId]);
  return <button onClick={handleClick}>Save</button>;
}
```

### Rule 4: Expensive Computations
```javascript
// ❌ Bad - Recalculates on every render
function MyComponent({ items }) {
  const sortedItems = items.sort((a, b) => a.value - b.value);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return <div>{total}</div>;
}

// ✅ Good - Use useMemo
function MyComponent({ items }) {
  const sortedItems = useMemo(() => 
    [...items].sort((a, b) => a.value - b.value),
    [items]
  );
  
  const total = useMemo(() => 
    items.reduce((sum, item) => sum + item.value, 0),
    [items]
  );
  
  return <div>{total}</div>;
}
```

### Rule 5: Constants Outside Component
```javascript
// ❌ Bad - Recreated on every render
function MyComponent() {
  const CONFIG = { maxItems: 10, theme: 'dark' };
  const EMPTY_ARRAY = [];
  return <Child config={CONFIG} items={EMPTY_ARRAY} />;
}

// ✅ Good - Define outside component
const CONFIG = { maxItems: 10, theme: 'dark' };
const EMPTY_ARRAY = [];

function MyComponent() {
  return <Child config={CONFIG} items={EMPTY_ARRAY} />;
}
```

## Detection Patterns

### Pattern 1: JSX Attribute Analysis
Look for JSX attributes with inline values:
- `style={{...}}`
- `className={...}`
- Any prop with inline object literal `{}`
- Any prop with inline array literal `[]`
- Any prop with arrow function `() =>`
- Any prop with function expression `function()`

### Pattern 2: Variable Declaration Analysis
Look for variables declared inside component body:
- `const arr = []` or `const arr = [...]`
- `const obj = {}` or `const obj = {...}`
- `const fn = () => {}` or `const fn = function() {}`

Check if they:
1. Don't depend on props/state → should be outside component
2. Depend on props/state → should use useMemo/useCallback

### Pattern 3: Computation Analysis
Look for expensive operations without memoization:
- Array methods: `.map()`, `.filter()`, `.reduce()`, `.sort()`
- Object methods: `Object.keys()`, `Object.entries()`, spread operator
- String operations on arrays/objects
- Complex calculations

### Pattern 4: Memoized Component Analysis
Check if component uses `React.memo`:
```javascript
const MemoizedChild = React.memo(Child);

// Props passed to memoized components should be stable
<MemoizedChild 
  onEvent={handleEvent} // Should use useCallback
  data={processedData}  // Should use useMemo
/>
```

## Recommendation Priorities

### Priority 1: Critical Performance Issues
- Inline functions passed to memoized components
- Inline objects/arrays passed to frequently re-rendering children
- Expensive computations without memoization in hot paths

### Priority 2: Important Optimizations
- Inline functions in event handlers of complex components
- Array/object transformations without memoization
- Constants that should be outside component scope

### Priority 3: Good Practices
- useCallback for all functions passed as props
- useMemo for all derived state
- Proper dependency arrays

## Analysis Output Format

For each issue found, provide:

1. **Issue Type**: Inline Object | Inline Array | Inline Function | Missing useMemo | Missing useCallback | Should be Constant
2. **Location**: File, line number, component name
3. **Current Code**: The problematic code snippet
4. **Impact**: High | Medium | Low (based on component complexity and render frequency)
5. **Recommendation**: Specific fix with code example
6. **Rationale**: Why this matters for performance

## Example Analysis Output

```markdown
### Issue 1: Inline Object in JSX
**Location**: `UserProfile.tsx:45`
**Impact**: High (component re-renders on parent state changes)

**Current:**
```javascript
<UserCard style={{ padding: 20, margin: 10 }} />
```

**Recommended:**
```javascript
const userCardStyle = { padding: 20, margin: 10 };

function UserProfile() {
  return <UserCard style={userCardStyle} />;
}
```

**Rationale**: UserCard is memoized, but the inline style object breaks memoization causing unnecessary re-renders. Moving the style object outside the component ensures reference stability.

---

### Issue 2: Missing useCallback
**Location**: `TodoList.tsx:67`
**Impact**: Medium (passed to child components)

**Current:**
```javascript
<TodoItem onComplete={(id) => completeTodo(id)} />
```

**Recommended:**
```javascript
const handleComplete = useCallback((id) => {
  completeTodo(id);
}, [completeTodo]);

return <TodoItem onComplete={handleComplete} />;
```

**Rationale**: The arrow function is recreated on every render, causing TodoItem to re-render even when other props haven't changed.
```

## Special Considerations

### When NOT to Optimize
- Simple components that render infrequently
- Components without children that could benefit from memoization
- Development/debugging scenarios where clarity > performance
- Inline functions that don't trigger expensive re-renders

### Trade-offs
- useMemo/useCallback have overhead - don't optimize prematurely
- Readability vs performance - document why optimization is needed
- Bundle size - memoization adds code

## Integration with Development Workflow

### Pre-commit Hook Analysis
Scan staged React files for common anti-patterns

### CI/CD Integration
Automated analysis on pull requests with performance impact report

### IDE Integration
Real-time suggestions while coding

## Advanced Patterns

### Pattern: Stabilizing Object Dependencies
```javascript
// ❌ Bad - options object changes every render
function MyComponent({ config }) {
  const options = { ...config, extra: 'value' };
  const result = useMemo(() => process(options), [options]);
}

// ✅ Good - Stabilize with useMemo
function MyComponent({ config }) {
  const options = useMemo(() => 
    ({ ...config, extra: 'value' }), 
    [config]
  );
  const result = useMemo(() => process(options), [options]);
}
```

### Pattern: Factory Functions
```javascript
// ❌ Bad - Factory function recreated every render
function MyComponent() {
  const createHandler = (id) => () => handleClick(id);
  return items.map(item => 
    <Item onClick={createHandler(item.id)} />
  );
}

// ✅ Good - Memoized factory
function MyComponent() {
  const createHandler = useCallback(
    (id) => () => handleClick(id),
    []
  );
  return items.map(item => 
    <Item onClick={createHandler(item.id)} />
  );
}
```

## Metrics to Track

- Number of unnecessary re-renders prevented
- Components analyzed vs optimized
- Performance improvement (using React DevTools Profiler)
- Bundle size impact of optimizations

## Tools Integration

- React DevTools Profiler for measuring impact
- ESLint rules: `react-hooks/exhaustive-deps`
- Custom ESLint plugin for inline object/array detection
- Bundle analyzer for optimization overhead tracking
