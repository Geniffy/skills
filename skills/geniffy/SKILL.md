---
name: geniffy
description: Add long-term memory to an app or AI agent with Geniffy (Python and TypeScript SDKs named geniffy, or the REST API). Use when the user wants their app to remember each of its users across sessions, asks to integrate Geniffy, or the code uses GENIFFY_API_KEY, client.space(), context(), ask() or memories.add().
---

# Building with Geniffy

Geniffy gives an app a memory of each of its users. The app saves what a user says, and before its model
answers, it asks Geniffy what is known that bears on the question. Every memory keeps the sentence it came
from, and when nothing is known, Geniffy says so in words instead of returning nothing.

Docs: https://docs.geniffy.com (every page has a Markdown copy: add `.md` to its address).

## The integration, in eight steps

Do these in order, keep the change small, and match the project's own style.

1. **Install the SDK** for the project's language: `pip install geniffy` (Python 3.9+) or `npm install
   geniffy` (Node 18+, Deno, Bun, edge). Any other language uses the REST API: see
   [references/rest.md](references/rest.md). Read the key from the `GENIFFY_API_KEY` environment variable
   only: never hard-code it, never send it to a browser, never log it.
2. **One client per process**, reused: `Geniffy()` in Python (`AsyncGeniffy()` in async code), `new
   Geniffy()` in TypeScript. Both read `GENIFFY_API_KEY` themselves.
3. **One space per end user.** Where the code knows which user a request is for, bind a client to them
   once and use only that below: `mem = client.space(f"user_{user_id}")` /
   ``const mem = client.space(`user_${userId}`)``. A space exists from its first write. Never call memory
   methods on the unbound client for an end user's data: that writes to the account owner's own memory,
   with every user mixed together. `space()` refuses a blank or missing id, so where a request can arrive
   without a signed-in user, skip memory for it rather than binding.
4. **Save what is worth remembering.** After a user tells the app something about themselves, their work
   or their plans: `mem.memories.add(text)`. A whole conversation, as the framework already holds it:
   `mem.memories.add(messages=history)` / `mem.memories.add({ messages: history })`. Files (PDF, Word
   .docx): `add_file` / `addFile`. Web pages: `add(url=...)` / `add({ url })`.
5. **Recall before the model answers.** Put `mem.context(question)` above the user's message in the prompt,
   as it is. It is never empty: when nothing is known it returns a sentence telling the model to say so,
   so add no fallback of your own. For a direct answer instead, `mem.ask(question)`; when its `answer` is
   null, say nothing is known.
6. **Let users be forgotten.** Wherever the app deletes a user or their data, also call
   `client.forget_space(f"user_{user_id}")` / ``client.forgetSpace(`user_${userId}`)``.
7. **Handle errors.** Catch `AuthenticationError` (a wrong or revoked key) and `UnreadableError` (a file or
   page that could not be read; `error.source.error` says why). The SDKs already retry busy and network
   errors, and never save a note twice. Log the request id of any failed call (`error.request_id` /
   `error.requestId`): it finds the call on the Requests page of the Geniffy app.
8. **One small test** that writes a note to a test space, waits with `mem.sources.wait(id)`, checks
   `mem.context(...)` mentions it, then erases the test space with `forget_space`.

## Choosing the call

| The app needs | Use |
| --- | --- |
| Memory in its own prompt (most apps) | `context(question)` |
| An answer in words, or a plain "nothing known" | `ask(question)` |
| The memories themselves, ranked, to filter or show | `search(query, limit=...)` (it ranks, it does not judge relevance) |
| What is lastingly true about a person, and what is going on now | `profile(name)` |
| What to read before talking to someone | `brief(name)` |

Learning takes a few seconds after a write. In a request that writes then immediately reads, wait on the
source first: `mem.sources.wait(source.id)`.

## Frameworks

Every framework integration is the same two calls: `context()` before the model, `memories.add()` after.
Four frameworks have a package that makes both; when the project already uses one of them, use it:

| Framework | Install | The change |
| --- | --- | --- |
| Vercel AI SDK | `npm install geniffy-ai-sdk` | ``model: withGeniffy(model, { space: `user_${userId}` })`` |
| LangChain | `pip install langchain-geniffy` | `middleware=[GeniffyMemory(space=lambda runtime: f"user_{runtime.context.id}")]` |
| LlamaIndex | `pip install llama-index-memory-geniffy` | `GeniffyMemoryBlock(space=f"user_{user_id}")` in `Memory.from_defaults(memory_blocks=[block])`, then `await block.remember(message, reply)` after `agent.run` |
| OpenAI Agents SDK | `pip install openai-agents-geniffy` | `Runner.run(..., context=user, run_config=memory.run_config())` with `memory = GeniffyMemory(space=lambda u: f"user_{u.id}")`, then `await memory.remember(user, message, result)` |

For LangGraph, Pydantic AI, AutoGen, CrewAI, Agno, Mastra, Google ADK, Microsoft Agent Framework, Strands Agents, Haystack,
LiveKit, Pipecat, Vapi, Retell, Bolna, WhatsApp, Telegram, Slack, Twilio, GitHub, Gmail, Google Drive, Notion, OneDrive and website syncs, the Anthropic, OpenAI and Gemini SDKs, n8n, Zapier and Make, and for the four above without their package, see
[references/frameworks.md](references/frameworks.md): each has a tested page.

## References

- [references/python.md](references/python.md): the Python SDK, every call.
- [references/typescript.md](references/typescript.md): the TypeScript SDK, every call.
- [references/rest.md](references/rest.md): the REST API, for any other language.
- [references/frameworks.md](references/frameworks.md): where each framework puts the two calls.

## Never

- Put the key in client-side code, a repository, or a log line. A user's own app gets a key limited to
  that user (`client.space(id).keys.create()`), never yours.
- Write an end user's data without a space, or reuse one user's space for another.
- Add a fallback when `context()` says nothing is known: pass its sentence through.
- Save passwords, API keys or other secrets as memories.
