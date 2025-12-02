# TypeScript Libraries Reference

## ts-toolbelt

Type-level utility library for advanced TypeScript type manipulation.

### Common Patterns

**Union Operations**
```typescript
import { U } from 'ts-toolbelt';

// Extract specific types from union
type Strings = U.Select<string | number | boolean, string>; // string
type Numbers = U.Exclude<string | number | boolean, string>; // number | boolean

// Check if type exists in union
type HasString = U.Has<string | number, string>; // 1 (true)
```

**Object Operations**
```typescript
import { O } from 'ts-toolbelt';

// Deep partial/required
type Config = { db: { host: string; port: number } };
type PartialConfig = O.Partial<Config, 'deep'>; // All nested props optional
type RequiredConfig = O.Required<Config, 'deep'>; // All nested props required

// Path-based access
type DbHost = O.Path<Config, ['db', 'host']>; // string

// Merge objects with type safety
type Merged = O.Merge<{ a: string }, { b: number }>; // { a: string; b: number }

// Make specific keys optional/required
type PartialDb = O.Optional<Config, 'db'>; // db is now optional
```

**Function Operations**
```typescript
import { F } from 'ts-toolbelt';

// Extract function parameters/return types
type Params = F.Parameters<(a: string, b: number) => void>; // [string, number]
type Return = F.Return<() => string>; // string

// Compose function types
type Pipe = F.Pipe<[
  (x: number) => string,
  (x: string) => boolean
]>; // (x: number) => boolean
```

**List/Tuple Operations**
```typescript
import { L } from 'ts-toolbelt';

// Tuple manipulation
type First = L.Head<[1, 2, 3]>; // 1
type Rest = L.Tail<[1, 2, 3]>; // [2, 3]
type Length = L.Length<[1, 2, 3]>; // 3
```

### Use Cases
- Building type-safe APIs with complex transformations
- Generic utility functions requiring advanced type inference
- Creating domain-specific type helpers
- Conditional type logic based on type properties

## Lodash

Utility library for common data manipulation.

### Common Patterns

**Object Manipulation**
```typescript
import _ from 'lodash';

// Deep operations
const merged = _.merge(target, source); // Deep merge
const cloned = _.cloneDeep(obj); // Deep clone
const picked = _.pick(obj, ['key1', 'key2']); // Extract keys
const omitted = _.omit(obj, ['key1']); // Remove keys

// Path-based access (null-safe)
const value = _.get(obj, 'deeply.nested.path', defaultValue);
_.set(obj, 'deeply.nested.path', newValue);
_.has(obj, 'path.to.check'); // Check existence
```

**Array Operations**
```typescript
// Chunking and grouping
const chunks = _.chunk(array, 3); // [[1,2,3], [4,5,6]]
const grouped = _.groupBy(users, 'role');
const partitioned = _.partition(items, item => item.active);

// Deduplication
const unique = _.uniq(array);
const uniqueBy = _.uniqBy(objects, 'id');

// Set operations
const union = _.union([1, 2], [2, 3]); // [1, 2, 3]
const intersection = _.intersection([1, 2], [2, 3]); // [2]
const difference = _.difference([1, 2], [2, 3]); // [1]
```

**Function Utilities**
```typescript
// Debouncing/Throttling
const debounced = _.debounce(fn, 300);
const throttled = _.throttle(fn, 1000);

// Memoization
const memoized = _.memoize(expensiveFn);
const memoizedWithKey = _.memoize(fn, (...args) => JSON.stringify(args));

// Currying
const curried = _.curry((a, b, c) => a + b + c);
const result = curried(1)(2)(3); // 6
```

**Collection Operations**
```typescript
// Sorting
const sorted = _.orderBy(items, ['date', 'priority'], ['desc', 'asc']);
const sortedBy = _.sortBy(items, [o => o.date]);

// Finding
const found = _.find(items, { active: true });
const filtered = _.filter(items, item => item.score > 50);

// Mapping/Reducing
const mapped = _.map(collection, 'propertyName');
const reduced = _.reduce(array, (sum, n) => sum + n, 0);
```

### Use Cases
- Data transformation pipelines
- Deep object manipulation without mutation
- Performance optimization (debounce, throttle, memoize)
- Collection operations beyond native array methods

## TanStack Router

Type-safe routing for React applications.

### Setup Pattern
```typescript
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

// Root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Nested routes with type-safe params
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/$userId',
  component: UserPage,
  // Type-safe params validation
  parseParams: (params) => ({
    userId: Number(params.userId),
  }),
  // Type-safe search params with Zod
  validateSearch: (search) => 
    z.object({
      page: z.number().optional(),
      filter: z.string().optional(),
    }).parse(search),
});

// Route tree
const routeTree = rootRoute.addChildren([indexRoute, userRoute]);

// Router instance
const router = createRouter({ routeTree });

// Type declaration for inference
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
```

### Navigation Patterns
```typescript
import { useNavigate, Link, useParams, useSearch } from '@tanstack/react-router';

function Component() {
  const navigate = useNavigate();
  
  // Type-safe navigation
  navigate({ 
    to: '/users/$userId', 
    params: { userId: 123 },
    search: { page: 1 } 
  });
  
  // Type-safe params
  const { userId } = useParams({ from: '/users/$userId' });
  
  // Type-safe search params
  const { page, filter } = useSearch({ from: '/users/$userId' });
  
  return (
    <Link 
      to="/users/$userId" 
      params={{ userId: 123 }}
      search={{ page: 1 }}
    >
      User
    </Link>
  );
}
```

### Data Loading Pattern
```typescript
const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/$userId',
  loader: async ({ params }) => {
    const user = await fetchUser(params.userId);
    return { user };
  },
  component: ({ useLoaderData }) => {
    const { user } = useLoaderData();
    return <div>{user.name}</div>;
  },
});
```

### Use Cases
- Type-safe SPAs with complex routing requirements
- Apps needing route-level code splitting
- Applications with search params and path params
- Integrating with TanStack Query for data fetching

## TanStack Query

Powerful data synchronization for React.

### Setup Pattern
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

### Query Patterns
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Basic query
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,
  enabled: !!userId, // Conditional fetching
});

// Query with dependent data
const userQuery = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

const postsQuery = useQuery({
  queryKey: ['posts', userQuery.data?.id],
  queryFn: () => fetchUserPosts(userQuery.data!.id),
  enabled: !!userQuery.data, // Only run when user is loaded
});

// Infinite query (pagination)
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

### Mutation Patterns
```typescript
// Basic mutation
const mutation = useMutation({
  mutationFn: (newUser: User) => createUser(newUser),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

// Optimistic updates
const updateMutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ['users', newUser.id] });
    const previous = queryClient.getQueryData(['users', newUser.id]);
    
    queryClient.setQueryData(['users', newUser.id], newUser);
    
    return { previous };
  },
  onError: (err, newUser, context) => {
    queryClient.setQueryData(['users', newUser.id], context?.previous);
  },
  onSettled: (data, error, variables) => {
    queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
  },
});

// Usage
mutation.mutate({ name: 'New User' });
```

### Cache Management
```typescript
const queryClient = useQueryClient();

// Invalidate queries
queryClient.invalidateQueries({ queryKey: ['users'] });

// Prefetch data
await queryClient.prefetchQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
});

// Set query data manually
queryClient.setQueryData(['user', userId], newUser);

// Get query data
const user = queryClient.getQueryData(['user', userId]);
```

### Use Cases
- Server state management with automatic caching
- Background data synchronization
- Optimistic updates for responsive UIs
- Infinite scrolling and pagination
- Dependent queries and parallel queries

## Zod

TypeScript-first schema validation.

### Schema Patterns
```typescript
import { z } from 'zod';

// Primitives
const stringSchema = z.string().min(3).max(100);
const numberSchema = z.number().positive().int();
const booleanSchema = z.boolean();
const dateSchema = z.date();

// Objects
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18).optional(),
  role: z.enum(['admin', 'user', 'guest']),
});

// Infer TypeScript type from schema
type User = z.infer<typeof userSchema>;

// Arrays
const usersSchema = z.array(userSchema);
const tupleSchema = z.tuple([z.string(), z.number()]);

// Unions and discriminated unions
const resultSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('success'), data: z.any() }),
  z.object({ status: z.literal('error'), error: z.string() }),
]);

// Records and maps
const recordSchema = z.record(z.string(), z.number());
const mapSchema = z.map(z.string(), userSchema);
```

### Validation Patterns
```typescript
// Safe parsing (returns result object)
const result = userSchema.safeParse(data);
if (result.success) {
  const user = result.data; // Type-safe
} else {
  console.error(result.error.issues); // Validation errors
}

// Throwing parse (throws on error)
try {
  const user = userSchema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues.forEach(issue => {
      console.log(`${issue.path.join('.')}: ${issue.message}`);
    });
  }
}
```

### Transformation Patterns
```typescript
// Transform/refine data
const trimmedStringSchema = z.string().transform(s => s.trim());

const passwordSchema = z.string()
  .min(8)
  .refine(s => /[A-Z]/.test(s), 'Must contain uppercase')
  .refine(s => /[0-9]/.test(s), 'Must contain number');

// Preprocessing
const numberFromString = z.preprocess(
  (val) => Number(val),
  z.number()
);

// Custom error messages
const customSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  age: z.number().min(18, { message: 'Must be 18 or older' }),
});
```

### Integration Patterns
```typescript
// With TanStack Router
const searchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  sort: z.enum(['asc', 'desc']).optional(),
});

const route = createRoute({
  path: '/users',
  validateSearch: searchSchema,
});

// With TanStack Query
const fetchUsers = async (params: z.infer<typeof searchSchema>) => {
  const validated = searchSchema.parse(params);
  return api.getUsers(validated);
};

// Form validation
const formSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

### Use Cases
- API request/response validation
- Form validation with type safety
- Configuration validation
- Runtime type checking
- Data transformation and parsing
- Integration with TanStack Router for search params

## TypeDI

Dependency injection container for TypeScript.

### Setup Pattern
```typescript
import 'reflect-metadata'; // Required import at entry point
import { Container, Service, Inject } from 'typedi';

// Service registration
@Service()
class UserRepository {
  async findById(id: number) {
    // Implementation
  }
}

@Service()
class UserService {
  constructor(
    private userRepository: UserRepository // Auto-injected
  ) {}
  
  async getUser(id: number) {
    return this.userRepository.findById(id);
  }
}

// Usage
const userService = Container.get(UserService);
```

### Dependency Patterns
```typescript
// Constructor injection (preferred)
@Service()
class OrderService {
  constructor(
    private userService: UserService,
    private paymentService: PaymentService
  ) {}
}

// Property injection
@Service()
class OrderService {
  @Inject()
  private userService!: UserService;
}

// Token-based injection
const DATABASE_TOKEN = new Token<Database>('DATABASE');

Container.set(DATABASE_TOKEN, new PostgresDatabase());

@Service()
class UserRepository {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database
  ) {}
}
```

### Lifecycle Management
```typescript
// Singleton (default)
@Service()
class ConfigService {} // Single instance

// Transient (new instance each time)
@Service({ transient: true })
class RequestHandler {}

// Multiple instances
@Service({ id: 'logger.console' })
class ConsoleLogger {}

@Service({ id: 'logger.file' })
class FileLogger {}

// Usage
const consoleLogger = Container.get<Logger>('logger.console');
const fileLogger = Container.get<Logger>('logger.file');
```

### Factory Pattern
```typescript
// Factory service
@Service()
class DatabaseFactory {
  create(config: DbConfig): Database {
    if (config.type === 'postgres') {
      return new PostgresDatabase(config);
    }
    return new MySQLDatabase(config);
  }
}

// Factory function
Container.set('database', () => {
  const config = Container.get(ConfigService);
  return new Database(config.dbUrl);
});
```

### Testing Patterns
```typescript
// Mock dependencies for testing
import { Container } from 'typedi';

describe('UserService', () => {
  beforeEach(() => {
    Container.reset(); // Clear all services
  });
  
  it('should fetch user', async () => {
    // Mock repository
    const mockRepo = {
      findById: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
    };
    
    Container.set(UserRepository, mockRepo);
    
    const service = Container.get(UserService);
    const user = await service.getUser(1);
    
    expect(user.name).toBe('Test');
    expect(mockRepo.findById).toHaveBeenCalledWith(1);
  });
});
```

### Use Cases
- Large applications with complex dependencies
- Testable code with mock injections
- Configurable service implementations
- Avoiding circular dependencies
- Managing singletons and transient services
- Decoupling business logic from infrastructure

## Integration Patterns

### TanStack Router + Query + Zod
```typescript
import { createRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.number().default(1),
  filter: z.string().optional(),
});

const userRoute = createRoute({
  path: '/users/$userId',
  validateSearch: searchSchema,
  loader: async ({ params, search }) => {
    const validated = searchSchema.parse(search);
    return { userId: params.userId, ...validated };
  },
  component: ({ useLoaderData, useSearch }) => {
    const { userId } = useLoaderData();
    const search = useSearch({ from: '/users/$userId' });
    
    const { data } = useQuery({
      queryKey: ['user', userId, search],
      queryFn: () => fetchUser(userId, search),
    });
    
    return <div>{data?.name}</div>;
  },
});
```

### TypeDI + Zod for Service Layer
```typescript
import { Service } from 'typedi';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

@Service()
class UserService {
  async createUser(input: unknown) {
    const validated = createUserSchema.parse(input);
    // Type-safe from here
    return this.repository.create(validated);
  }
}
```

### Lodash + ts-toolbelt for Type-Safe Utilities
```typescript
import _ from 'lodash';
import { O } from 'ts-toolbelt';

// Deep partial with lodash operations
type DeepPartial<T> = O.Partial<T, 'deep'>;

function mergeDeep<T extends object>(
  target: T,
  source: DeepPartial<T>
): T {
  return _.merge(_.cloneDeep(target), source);
}
```

## Additional Resources

For advanced promise and async patterns, see `references/p_family.md`:
- 40+ promise utilities (p-map, p-retry, p-timeout, etc.)
- Concurrency control patterns
- Promise combinators and control flow
- Integration patterns with these libraries
