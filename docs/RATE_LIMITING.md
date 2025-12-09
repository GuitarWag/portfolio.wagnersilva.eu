# Rate Limiting Documentation

## Overview

Rate limiting is implemented to protect against DDoS attacks, control costs, and ensure fair usage of the AI recommendation API.

## Current Configuration

### Endpoint: `/api/recommend` (AI Project Recommendations)

- **Limit**: 10 requests per minute per IP address
- **Window**: 60 seconds (rolling window)
- **Preset**: `STANDARD`
- **Rationale**: Users rarely need more than 10 searches per minute
- **Response**: 429 Too Many Requests when limit exceeded
- **Headers**: Standard rate limit headers included

### Endpoint: `/api/tldr` (AI Project Summaries)

- **Limit**: 30 requests per minute per IP address
- **Window**: 60 seconds (rolling window)
- **Preset**: `RELAXED`
- **Rationale**: Users may browse multiple projects and generate summaries for each, plus different audience levels
- **Response**: 429 Too Many Requests when limit exceeded
- **Headers**: Standard rate limit headers included

### Rate Limit Headers

Every response includes these headers:

```
X-RateLimit-Limit: 10           // Max requests allowed in window
X-RateLimit-Remaining: 7        // Requests remaining in current window
X-RateLimit-Reset: 2025-11-29T... // When the limit resets (ISO 8601)
Retry-After: 45                 // Seconds to wait (only on 429 errors)
```

## Implementation Details

### Strategy

- **In-Memory Store**: Simple Map-based cache for single-server deployments
- **Client Identification**: Uses IP address from headers (x-forwarded-for, x-real-ip, cf-connecting-ip)
- **Automatic Cleanup**: Expired entries removed every 5 minutes
- **Non-Blocking**: Rate limit check adds <1ms latency

### Presets Available

```typescript
RateLimitPresets.STRICT    // 5 req/min  - Very expensive operations
RateLimitPresets.STANDARD  // 10 req/min - Normal API endpoints (current)
RateLimitPresets.RELAXED   // 30 req/min - Lightweight operations
RateLimitPresets.GENEROUS  // 60 req/min - Development/testing
```

## Cost Protection

### Why Rate Limiting Matters

1. **Gemini API Costs**: Each request = API tokens charged to your account
2. **Firestore Writes**: Each query saved to database (costs per write operation)
3. **API Quotas**: Google AI has free tier limits that can be exhausted
4. **Infrastructure**: Prevents server overload and ensures uptime

### Estimated Costs (without rate limiting)

- 1000 malicious requests/hour = ~$5-10 in API costs
- 10,000 Firestore writes = ~$0.18 + storage
- Could exhaust free tier quotas quickly

### With Current Limits

**`/api/recommend`:**
- Max 10 req/min × 60 min = 600 requests/hour per IP
- Reasonable for legitimate users (avg 2-5 queries per session)
- Prevents abuse while maintaining good UX

**`/api/tldr`:**
- Max 30 req/min × 60 min = 1,800 requests/hour per IP
- Allows browsing all 12 projects multiple times
- Accommodates testing different audience levels (technical/business/executive)

## User Experience

### Normal Usage

Users won't notice rate limiting during typical browsing:

**AI Recommendations:**
- Average user: 2-5 queries per session
- Well under 10 queries/minute threshold

**TL;DR Summaries:**
- Average user: 3-8 summaries per session (browsing projects)
- Comfortable buffer with 30/minute limit

### When Limit Hit

Friendly error messages displayed:

**AI Agent:**
> "I'm receiving too many requests right now. Please wait 45 seconds before trying again. 🕐"

**TL;DR Modal:**
> "Too many requests. Please wait a moment before generating another summary."

## Monitoring

### Check Rate Limit Status

From browser console or API client:

```javascript
const response = await fetch('/api/recommend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userInput: 'React projects' })
});

console.log('Limit:', response.headers.get('X-RateLimit-Limit'));
console.log('Remaining:', response.headers.get('X-RateLimit-Remaining'));
console.log('Resets at:', response.headers.get('X-RateLimit-Reset'));
```

### Server-Side Monitoring

Check logs for rate limit violations:

```bash
# Look for 429 responses in logs
grep "POST /api/recommend 429" server.log

# Count rate limit errors
grep -c "Rate limit exceeded" server.log
```

## Scaling Considerations

### Current Setup (Good For)

- Single server deployments
- Low to medium traffic (<1000 req/hour)
- Development and small production sites

### When to Upgrade (Not Yet Needed)

If you need:
- **Multi-server deployments**: Use Upstash Redis or Vercel KV for distributed rate limiting
- **Per-user limits**: Track by user ID instead of IP
- **Dynamic limits**: Different limits for authenticated vs anonymous users
- **Geographic limits**: Different limits by region

### Upgrade Path (Future)

1. **Add Upstash Redis**:
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

2. **Environment Variables**:
   ```env
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

3. **Update rate-limit.ts** to use Redis instead of Map

## Testing

### Test Rate Limiting Locally

```bash
# Send 15 requests rapidly (should get 10 success, 5 failures)
for i in {1..15}; do
  curl -X POST http://localhost:3001/api/recommend \
    -H "Content-Type: application/json" \
    -d '{"userInput":"React projects"}' &
done
wait
```

### Expected Output

- First 10 requests: 200 OK
- Next 5 requests: 429 Too Many Requests
- After 60 seconds: Limit resets, requests succeed again

## Configuration

### Adjust Rate Limits

Edit `/app/api/recommend/route.ts`:

```typescript
// Change from STANDARD to RELAXED for higher limits
const { limit, windowMs } = RateLimitPresets.RELAXED; // 30 req/min
```

### Whitelist IPs (Future Enhancement)

Add to rate-limit.ts if needed:

```typescript
const WHITELISTED_IPS = ['123.456.789.0']; // Your monitoring service, etc.

if (WHITELISTED_IPS.includes(ip)) {
  return { allowed: true, remaining: Infinity, resetAt: Date.now() };
}
```

## Security Best Practices

✅ **Current Implementation**:
- IP-based identification
- Standard HTTP 429 responses
- Graceful error messages
- Automatic cleanup of old entries

🔒 **Additional Recommendations**:
- Monitor for distributed attacks (many IPs)
- Consider CAPTCHA for repeated violations
- Log rate limit violations for security analysis
- Review limits monthly based on usage patterns

## FAQ

**Q: Why 10 requests per minute?**
A: Balances legitimate use (users rarely need >10 queries/min) with cost protection. Adjust if needed based on analytics.

**Q: What if I hit the limit during testing?**
A: Wait 60 seconds, or temporarily change to `RateLimitPresets.GENEROUS` in development.

**Q: Does this work with Vercel/serverless?**
A: Yes for single-instance deployments. For multi-region/serverless at scale, upgrade to Redis-based limiting.

**Q: Can users bypass this?**
A: Not easily. Would require changing IP address for each request. VPN/proxy switching is possible but expensive for attackers.

## Related Files

- `/lib/rate-limit.ts` - Core rate limiting logic
- `/app/api/recommend/route.ts` - API endpoint with rate limiting
- `/components/AIAgent.tsx` - Frontend error handling
