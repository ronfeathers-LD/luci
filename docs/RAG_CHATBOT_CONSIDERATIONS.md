# RAG Chatbot for Account Data Page - Pre-Implementation Considerations

## Overview
Add a RAG (Retrieval-Augmented Generation) chatbot to `/account/[id]/data` that provides account-specific insights using only that account's data as context.

---

## 1. Data Sources & Context Scope

### Available Account Data
Based on `AccountDataPage.js`, the following data is available per account:

#### Account Information
- Account name, tier, contract value
- Industry, annual revenue
- Account manager/owner
- Salesforce account ID

#### Contacts
- Contact names, emails, titles
- Contact status
- LinkedIn profile data (if enriched)
- Apollo.io enrichment data (buying signals, engagement metrics)
- Employment history, skills, technologies

#### Cases/Tickets
- Case numbers, subjects, descriptions
- Status, priority, type, reason
- Created/closed dates
- Contact involvement (who submitted cases)
- Case resolution timelines

#### Transcriptions (Avoma)
- Meeting transcripts
- Speaker information
- Meeting dates, duration
- Attendees
- Meeting subjects

#### Sentiment Analyses
- Historical sentiment scores (1-10)
- Analysis insights and recommendations
- Analysis timestamps

### Questions to Answer
- **What data should be included?** All of the above, or a subset?
- **How much historical data?** Last 30/60/90 days? All time?
- **Should we include sentiment analysis results** as part of the context, or just raw data?
- **How do we handle data freshness?** Real-time or cached?

---

## 2. Vector Database & Embeddings

### Current State
- ✅ Using Supabase (PostgreSQL 15)
- ❌ No vector database currently configured
- ❌ No embeddings infrastructure

### Options

#### Option A: Supabase pgvector Extension (Recommended)
**Pros:**
- Already using Supabase - no new infrastructure
- PostgreSQL extension - native integration
- Free tier available
- Good performance for moderate scale
- Single database for all data

**Cons:**
- Requires enabling pgvector extension
- May need migration to add vector columns
- Less specialized than dedicated vector DBs

**Implementation:**
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to account_data table
ALTER TABLE account_data ADD COLUMN embedding vector(768);
```

#### Option B: Dedicated Vector Database
**Options:**
- Pinecone (managed, easy to use, good free tier)
- Weaviate (self-hosted or cloud)
- Qdrant (open source, self-hosted)

**Pros:**
- Optimized for vector search
- Better performance at scale
- Advanced features (hybrid search, filtering)

**Cons:**
- Additional infrastructure to manage
- Additional cost
- Data synchronization complexity
- Another service to maintain

### Recommendation
**Start with Supabase pgvector** - simplest path, leverages existing infrastructure, can migrate later if needed.

---

## 3. Embedding Model Selection

### Options

#### Option A: Google Gemini Embeddings (Recommended)
**Pros:**
- Already using Gemini API for sentiment analysis
- Consistent with existing stack
- Good quality embeddings
- Unified API key management

**Cons:**
- Need to check if Gemini has embedding API
- May need to use text-embedding model instead

#### Option B: OpenAI text-embedding-3
**Pros:**
- High quality embeddings
- Well-documented
- Good performance

**Cons:**
- Additional API key to manage
- Additional cost
- Different provider from Gemini

#### Option C: Open Source Models (via Supabase)
**Pros:**
- Free (self-hosted)
- No API costs
- Privacy-friendly

**Cons:**
- Requires model hosting
- More complex setup
- May need GPU resources

### Recommendation
**Use Gemini's embedding API if available**, otherwise **OpenAI text-embedding-3-small** (cost-effective, good quality).

---

## 4. Data Chunking Strategy

### What Needs Chunking?
- **Transcriptions**: Can be very long (multiple pages)
- **Case descriptions**: Variable length
- **Contact notes**: If available
- **Sentiment analysis reports**: Structured but can be long

### Chunking Approaches

#### Option A: Semantic Chunking
- Split by meaning/topic
- Preserve context
- Better retrieval quality

#### Option B: Fixed-Size Chunking
- Simple to implement
- Predictable
- May break context

#### Option C: Hybrid
- Fixed-size with overlap
- Preserve context boundaries
- Balance simplicity and quality

### Chunk Metadata
Each chunk should include:
- `account_id` (for filtering)
- `data_type` (transcription, case, contact, etc.)
- `source_id` (original record ID)
- `timestamp` (for recency)
- `metadata` (JSONB for flexible attributes)

### Recommendation
**Start with fixed-size chunks (500-1000 tokens) with 100-token overlap**, optimize later based on query quality.

---

## 5. LLM Selection for Chat

### Current Stack
- ✅ Using Google Gemini for sentiment analysis
- ✅ Already have `GEMINI_API_KEY` configured

### Options

#### Option A: Google Gemini (Recommended)
**Pros:**
- Already integrated
- No new API keys
- Consistent with sentiment analysis
- Good performance
- Cost-effective

**Cons:**
- Need to verify chat/streaming capabilities

#### Option B: OpenAI GPT-4/GPT-3.5
**Pros:**
- Excellent chat capabilities
- Great streaming support
- Well-documented

**Cons:**
- Additional API key
- Additional cost
- Different provider

### Recommendation
**Use Gemini for consistency**, but design the API to be model-agnostic for future flexibility.

---

## 6. RAG Architecture

### Components Needed

1. **Embedding Service**
   - Convert account data to embeddings
   - Store in vector database
   - Update when data changes

2. **Retrieval System**
   - Query vector database
   - Filter by account_id
   - Return top-k relevant chunks
   - Re-rank if needed

3. **Context Assembly**
   - Combine retrieved chunks
   - Add account metadata
   - Format for LLM prompt

4. **Chat Interface**
   - Message history management
   - Streaming responses
   - Error handling
   - Rate limiting

5. **Data Sync**
   - When to re-embed?
   - How to handle updates?
   - Incremental vs. full refresh

### Architecture Pattern

```
User Query
    ↓
[Query Embedding] → [Vector Search] → [Top-K Chunks]
    ↓
[Context Assembly] → [LLM Prompt] → [Gemini API]
    ↓
[Stream Response] → [UI Update]
```

---

## 7. Security & Access Control

### Critical Considerations

#### Account Isolation
- **MUST ensure users can only query their assigned accounts**
- Verify `user_accounts` relationship before allowing queries
- Filter vector search by account_id
- Never return data from other accounts

#### API Security
- Rate limiting per user
- Input validation
- Sanitize user queries
- Prevent prompt injection

#### Data Privacy
- PII handling (emails, names in transcriptions)
- Compliance considerations (GDPR, etc.)
- Audit logging of queries

### Implementation
```javascript
// Verify access before processing query
const hasAccess = await verifyAccountAccess(userId, accountId);
if (!hasAccess) {
  return sendErrorResponse(new Error('Access denied'), 403);
}
```

---

## 8. Cost Considerations

### Cost Factors

1. **Embedding Generation**
   - Initial: Embed all account data
   - Ongoing: Embed new/updated data
   - Cost: ~$0.0001 per 1K tokens (OpenAI)

2. **Vector Storage**
   - Supabase: Included in plan
   - Pinecone: $70/month for starter

3. **LLM API Calls**
   - Gemini: ~$0.00025 per 1K input tokens
   - Each query: ~500-2000 tokens input
   - Each response: ~200-1000 tokens output

4. **Data Refresh**
   - Re-embedding on updates
   - Frequency of updates

### Cost Estimation (Example)
- 100 accounts × 10MB data each = 1GB
- Embedding cost: ~$10-20 one-time
- Monthly queries: 1000 queries × $0.001 = $1-2/month
- **Total: ~$15-25/month** (excluding infrastructure)

### Optimization Strategies
- Cache embeddings (don't re-embed unchanged data)
- Batch embedding requests
- Use smaller embedding models for cost
- Limit context window size
- Implement query caching

---

## 9. Performance & Scalability

### Performance Targets
- Query response time: < 3 seconds
- Embedding generation: Background job
- Vector search: < 500ms

### Scalability Considerations
- **How many accounts?** (affects total data volume)
- **How many concurrent users?** (affects API rate limits)
- **Query frequency?** (affects cost and load)

### Optimization
- Index vector columns properly
- Use approximate nearest neighbor (ANN) search
- Cache frequent queries
- Background embedding jobs
- Connection pooling

---

## 10. Data Freshness & Updates

### Update Scenarios

1. **New Transcription Added**
   - Should auto-embed and add to vector DB
   - Real-time or batch?

2. **Case Status Changed**
   - Update existing embedding or re-embed?
   - How to handle updates?

3. **New Contact Added**
   - Embed immediately or batch?

4. **Account Data Updated**
   - Full re-embed or incremental?

### Strategies

#### Option A: Real-Time Updates
- Embed immediately on data change
- Pros: Always fresh
- Cons: Higher API costs, complexity

#### Option B: Batch Updates
- Daily/hourly batch job
- Pros: Cost-effective, simpler
- Cons: Stale data possible

#### Option C: Hybrid
- Critical data: Real-time
- Less critical: Batch

### Recommendation
**Start with batch updates (hourly/daily)**, add real-time for critical data later.

---

## 11. User Experience

### UI/UX Considerations

1. **Chat Interface**
   - Where to place it? (Sidebar, modal, dedicated section)
   - Mobile responsiveness
   - Message history persistence
   - Typing indicators

2. **Query Suggestions**
   - Pre-built prompts?
   - Example questions?
   - Auto-complete?

3. **Response Formatting**
   - Markdown support?
   - Code blocks?
   - Tables?
   - Links to source data?

4. **Error Handling**
   - Clear error messages
   - Retry mechanisms
   - Fallback responses

5. **Loading States**
   - Streaming vs. wait-for-complete
   - Progress indicators

### Recommendation
**Start with a collapsible sidebar chat**, streaming responses, basic markdown support.

---

## 12. Prompt Engineering

### System Prompt Design

Key elements:
- Role definition (account analyst assistant)
- Context scope (this account only)
- Response style (concise, actionable)
- Data limitations (only what's in context)
- Citation requirements (mention source data)

### Example Structure
```
You are an AI assistant helping analyze account data for [Account Name].

You have access to:
- Account information (tier, contract value, industry)
- Contacts and their details
- Support cases and tickets
- Meeting transcriptions
- Historical sentiment analyses

Your responses should:
- Be concise and actionable
- Cite specific data when making claims
- Focus on insights and recommendations
- Acknowledge when you don't have information

IMPORTANT: Only use data provided in the context. Do not make assumptions.
```

---

## 13. Monitoring & Observability

### What to Track

1. **Usage Metrics**
   - Queries per user/account
   - Query types
   - Response times

2. **Quality Metrics**
   - User feedback (thumbs up/down)
   - Query success rate
   - Retrieval relevance

3. **Cost Metrics**
   - API costs per query
   - Embedding costs
   - Total monthly spend

4. **Error Tracking**
   - Failed queries
   - API errors
   - Timeout issues

### Tools
- Vercel Analytics (already available?)
- Custom logging
- Database query logs
- API monitoring

---

## 14. Implementation Phases

### Phase 1: MVP (Minimum Viable Product)
- [ ] Enable pgvector in Supabase
- [ ] Create embedding API endpoint
- [ ] Embed account data (one account for testing)
- [ ] Basic vector search
- [ ] Simple chat interface
- [ ] Gemini integration
- [ ] Account access verification

### Phase 2: Production Ready
- [ ] Batch embedding for all accounts
- [ ] Data update pipeline
- [ ] Improved UI/UX
- [ ] Error handling
- [ ] Rate limiting
- [ ] Monitoring

### Phase 3: Optimization
- [ ] Query caching
- [ ] Re-ranking
- [ ] Advanced chunking
- [ ] Real-time updates
- [ ] Analytics dashboard

---

## 15. Technical Decisions Summary

### Recommended Stack
1. **Vector DB**: Supabase pgvector extension
2. **Embedding Model**: OpenAI text-embedding-3-small (or Gemini if available)
3. **LLM**: Google Gemini (for consistency)
4. **Chunking**: Fixed-size (500-1000 tokens) with overlap
5. **Updates**: Batch (hourly/daily) initially
6. **UI**: Collapsible sidebar chat with streaming

### Key Questions to Answer Before Starting

1. **What's the primary use case?** (Quick questions vs. deep analysis)
2. **How much historical data?** (affects embedding volume)
3. **Real-time or batch updates?** (affects architecture)
4. **Budget constraints?** (affects model choices)
5. **Expected query volume?** (affects scaling needs)

---

## Next Steps

1. **Decision Meeting**: Review this document and make key decisions
2. **Proof of Concept**: Build MVP for one account
3. **Test & Iterate**: Validate approach with real queries
4. **Scale Up**: Roll out to all accounts
5. **Optimize**: Improve based on usage patterns

---

## Additional Resources

- [Supabase pgvector Documentation](https://supabase.com/docs/guides/ai/vector-columns)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)

