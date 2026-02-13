# 🌲 Field Ops Advisor

AI-powered Standard Operating Procedure recommendations for field operations in forestry and agriculture.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## 📋 System Overview

This system helps field workers:
1. **Submit observations** about field conditions
2. **Get matched SOPs** using AI-powered semantic search
3. **Receive actionable recommendations** with verified citations
4. **Visualize locations** on an interactive map

## 🏗️ Architecture

### Backend (Express + Azure OpenAI)
- **Framework**: Express.js with ES modules
- **AI**: Azure OpenAI for embeddings (text-embedding-3-large) and LLM (GPT-5)
- **Vector Search**: In-memory cosine similarity (optimized for 1-hour challenge)
- **Data Storage**: In-memory Maps (no database for speed)

### Frontend (React + Vite)
- **Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast development
- **Map**: Leaflet + React-Leaflet for geographic visualization
- **Styling**: Custom CSS with modern design system

### Data Flow
```
User Input (Observation)
    ↓
Embedding Generation (Azure OpenAI)
    ↓
Vector Similarity Search
    ↓
Top 5 SOP Matches
    ↓
Selected SOP → LLM Recommendation
    ↓
Verified Citations + Action Items
    ↓
Display on Map + UI
```

## 🔑 Key Features

### ✅ Implemented
- **Semantic Search**: Vector embeddings + cosine similarity
- **Citation Verification**: All recommendations cite actual SOP text with character positions
- **Graceful Fallback**: If LLM fails, extracts key sentences from SOPs
- **Real-time Map**: Geographic visualization with live updates
- **Region Filtering**: Filter matches by region
- **Responsive Design**: Works on desktop and tablet

### 🎯 Design Decisions

#### 1. In-Memory Vector Store
**Why**: Fastest implementation for 1-hour challenge. Pre-computes embeddings for first 50 SOPs on startup.
**Trade-off**: Doesn't scale to millions of docs, but perfect for demo/prototype.
**Production Alternative**: Use Chroma, Qdrant, or pgvector.

#### 2. Citation Validation Strategy
**How**: Every recommendation quote is verified against source SOP text using substring matching with character positions.
**Why**: Prevents hallucination and ensures user trust.
**Fallback**: If LLM is down, directly extract step-by-step instructions from SOP text.

#### 3. Batch Embedding Generation
**Why**: Generate embeddings for top 50 SOPs at startup to reduce API calls during demo.
**Trade-off**: 10-15 second startup time vs instant responses during use.

#### 4. Simple Cosine Similarity
**Why**: Fast, interpretable, no external dependencies.
**Score Normalization**: Raw similarity (0-1) → Percentage (0-100) for UX.

## 📡 API Endpoints

### `POST /field-note`
Submit field observation, get matched SOPs.

**Request**:
```json
{
  "observation": "Brown spots on pine needles",
  "region": "India",
  "crop_type": "Pine plantation"
}
```

**Response**:
```json
{
  "note_id": "note-abc123",
  "matches": [
    {
      "id": "SOP-0001",
      "title": "Storm Damage Assessment Protocol",
      "relevance_score": 87,
      "evidence_snippet": "Brown needle spots indicate...",
      "char_start": 245,
      "char_end": 312
    }
  ]
}
```

### `GET /recommendation?note_id=X&doc_id=Y`
Generate actionable recommendations for a matched SOP.

**Response**:
```json
{
  "recommendation_id": "rec-xyz",
  "bullets": [
    "Update hazard signage and document with photos",
    "Escalate for replant assessment if damage localized"
  ],
  "citations": [
    {
      "bullet_index": 0,
      "quoted_text": "Update hazard signage...",
      "source_char_range": [450, 530],
      "confidence": "high"
    }
  ],
  "fallback_used": false
}
```

### `GET /sops?region=X&domain=Y`
Browse SOPs with metadata filters.

### `GET /map-state`
Get plot locations with active recommendations.

## 🛡️ Reliability Features

### 1. **LLM Fallback Mode**
If Azure OpenAI is unavailable:
- Extracts step-by-step instructions from SOP text
- Returns structured bullets with verified citations
- Shows "Fallback Mode" badge to user

### 2. **Citation Verification**
- Every quote is checked against source text
- Character positions stored for audit trail
- Confidence level (high/medium) based on match quality

### 3. **Input Validation**
- Observation text required
- Empty responses handled gracefully
- API errors shown to user with friendly messages

### 4. **Request Timeouts**
- Azure OpenAI calls have implicit timeouts
- Errors caught and logged
- Fallback activated automatically

## 🚧 Known Limitations

1. **No Persistence**: Data stored in-memory only (resets on restart)
2. **Limited Scale**: In-memory vector store works for ~1000 docs
3. **No Authentication**: Single-user system
4. **Mock Coordinates**: Plot locations are sample data
5. **Basic Error Handling**: Production would need retry logic, circuit breakers
6. **No Testing**: Prioritized shipping over test coverage for 1-hour challenge

## 🔮 Production Roadmap

If building this for real:

1. **Vector Database**: Migrate to Chroma/Qdrant for scale
2. **Real Database**: PostgreSQL with pgvector for plot/note data
3. **Caching**: Redis for recommendation results
4. **Monitoring**: Structured logging + correlation IDs
5. **Rate Limiting**: Prevent API abuse
6. **Tenant Isolation**: Multi-tenancy with row-level security
7. **Testing**: Unit + integration + E2E tests
8. **CI/CD**: Automated deployment pipeline

## 🏃 What I Intentionally Didn't Build

To ship in 60 minutes, I skipped:

- User authentication/authorization
- Database migrations
- Complex UI animations
- Mobile-responsive map controls
- Real-time collaborative editing
- Export to PDF/Excel
- Email notifications
- Audit logging
- Comprehensive error boundaries
- Performance profiling
- Accessibility features (ARIA labels, keyboard nav)

## 💡 Interview Follow-up Questions

### "Show me where evidence snippets come from"
Every `evidence_snippet` in matches and `quoted_text` in citations comes with `char_start` and `char_end` positions. You can verify by checking `sop.text.substring(char_start, char_end)`.

### "What guarantees you're not hallucinating citations?"
1. Fallback mode uses direct SOP text extraction (no LLM)
2. LLM mode validates every quote with substring search
3. Citations include confidence scores
4. Character positions enable audit trail

### "Scale from 10 docs to 1 million - what changes first?"
1. **Vector store**: Switch to Qdrant/Chroma with HNSW index
2. **Embedding strategy**: Batch pre-compute, cache, incremental updates
3. **Search optimization**: Approximate nearest neighbors (ANN)
4. **Database**: PostgreSQL with partitioning
5. **Caching**: Redis for hot queries

### "Name 2 production failure modes"
1. **LLM Down**: Fallback extracts SOP steps, logs error, shows badge
2. **Long Inputs**: Would add max length validation + truncation
3. **DB Unavailable**: Would need circuit breaker + cached responses

### "Tenant isolation approach?"
Simplest safe approach:
1. Add `tenant_id` to all tables
2. Row-level security (RLS) in PostgreSQL
3. API middleware validates tenant from JWT
4. Separate vector collections per tenant in Chroma

## 📝 Technologies Used

- **Backend**: Node.js, Express, Azure OpenAI SDK
- **Frontend**: React, Vite, Leaflet
- **AI**: Azure OpenAI (GPT-5, text-embedding-3-large), Elevenlabs (Voice Assistant)
- **Styling**: Custom CSS with design system
- **Vector Search**: In-memory cosine similarity

## 🙏 Acknowledgments

Built as a technical interview challenge. Dataset is synthetic and for demonstration purposes only.

---

**Time to complete**: ~60 minutes
**Focus**: Ship working v1 with verified citations and graceful fallbacks
