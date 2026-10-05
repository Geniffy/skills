# The REST API

For any language without an SDK. Plain HTTPS with a bearer key; the Python and TypeScript SDKs are thin
layers over these calls. Full reference: https://docs.geniffy.com/api.md. The spec, for generating a
client: https://api.geniffy.com/v1/openapi.json.

## Base address and key

```text
https://api.geniffy.com
Authorization: Bearer <the GENIFFY_API_KEY value>
```

Keys are made in the Geniffy app under **API keys**. A key reaches its owner's memory and every space
beneath it: keep it on the server.

## Spaces

Name the end user in the `X-Geniffy-Space` header, or as `space` in the body or query string. What a request
spells out beats the header. Leave both out only for the account owner's own memory.

## The calls an integration needs

| Call | What it does |
| --- | --- |
| `POST /v1/memories` with `{"text": ...}`, `{"url": ...}` or `{"messages": [...]}` | Save a note, a web page, or a conversation as the framework holds it (`title` optional). Returns `201` with `source` |
| `POST /v1/memories/file` (multipart, field `file`) | Save a PDF or Word (.docx) file |
| `POST /v1/context` with `{"question": ...}` | `context`: put it above the user's message, as it is. Never empty; `empty: true` when nothing bears on the question |
| `POST /v1/ask` with `{"question": ...}` | An answer from memory only, or `answer: null` with a message saying why |
| `POST /v1/search` with `{"q": ..., "limit": 5}` | `memories`: the best matches, ranked, without judging relevance |
| `GET /v1/sources/{id}` | Whether learning from a source has finished |
| `DELETE /v1/spaces/{space}` | Forget everything held for one end user |

## Responses and errors

JSON. Every response carries an `X-Request-ID` header: log it for any failed call, as it finds the call on
the Requests page of the Geniffy app. An error carries a code to branch on and a sentence written for a
person: https://docs.geniffy.com/errors.md. Retry `408`, `429` and `5xx` with backoff; retry a write only
when it never reached the API, or on `429`, so a note is never saved twice.
