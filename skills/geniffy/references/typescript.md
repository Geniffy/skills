# The TypeScript SDK

From https://docs.geniffy.com/sdks/typescript.

Give your app a memory from TypeScript or JavaScript. It has no dependencies: it uses the platform's
`fetch`, on Node 18 or later, Deno, Bun and edge runtimes.

```bash
npm install geniffy
```

Make a key in the Geniffy app under **API keys** and set it as `GENIFFY_API_KEY`.

```ts
import { Geniffy } from "geniffy";

const client = new Geniffy();                  // reads GENIFFY_API_KEY
const mem = client.space("customer_1042");     // one of your users; nothing else can read it

const source = await mem.memories.add("Priya Nair signs the Lumen renewal, and it comes up in March.");
await mem.sources.wait(source.id);             // learning usually takes a few seconds

const context = await mem.context("Who signs the Lumen renewal?");
const prompt = `${context}\n\nUser: Who signs the Lumen renewal?`;
```

`context()` never returns an empty string. Ask about something that was never stored and it returns one
sentence, `There is nothing stored about this yet. Say so rather than guessing.`: a model reads silence
as permission to invent.

## Three ways to recall

```ts
await mem.context("Who signs the renewal?");          // a block for your own prompt; the one most apps want
await mem.ask("Who signs the renewal?");              // { answer, memories }, or answer: null and a message
await mem.search("renewal", { limit: 5 });            // the memories, ranked, to do with as you like
```

`context()` and `ask()` judge whether anything bears on the question. `search()` ranks and does not
judge. See [Recall](https://docs.geniffy.com/recall).

## Spaces: one memory per user

```ts
const mem = client.space(`user_${user.id}`);          // per request
await client.memories.add("...");                     // no space: your own memory, the one the Geniffy app shows
await client.spaces();                                // which spaces hold anything, most recently written first
await client.forgetSpace("user_8841");                // everything held for that user, gone, when they ask
```

A blank space, `undefined` or `null` throws. For a user's own app or device, make a key limited to them
instead of shipping your key: ``await client.space(`user_${user.id}`).keys.create({ name: "Their phone" })``.

## Add

```ts
await mem.memories.add({ text: "Pilots run for 6 weeks.", title: "GTM plan" });
await mem.memories.add({ url: "https://example.com" });             // a web page, read once
await mem.memories.add({ messages: chatHistory });                  // a conversation, as your framework holds it
await mem.memories.addFile(fileOrBlob, { filename: "Pricing.pdf" }); // PDF or Word (.docx)
await mem.memories.addMany([{ text: "..." }, { url: "https://..." }]);
```

Messages from OpenAI, Anthropic, Gemini and the Vercel AI SDK type-check as they are. A file or page
that cannot be read rejects with `UnreadableError`; `error.source` is the source it left, with the
reason. Syncing the app's own records? Pass `externalId` with the record's id: sending it again updates
that source and learns only what changed, and `mem.sources.delete({ externalId })` removes it.

## Read and correct

```ts
const page = await mem.memories.list({ kind: "people" }); // all, people, plan, pref or detail; newest first
for await (const m of mem.memories.iterate()) { /* every memory */ }
const { memory, history } = await mem.memories.get(42);  // memory.quote is the sentence it came from
await mem.memories.correct(42, "Priya signs it, with Arjun co-signing.");
await mem.memories.delete(42);                           // forget it for good
await mem.profile("Priya Nair");                         // what is lastingly true about someone, and what is going on now
await mem.brief("Priya Nair");                           // what to read before talking to them
await mem.sources.list();
await mem.sources.delete(source.id);                     // a source, and what only it taught
```

## Errors, retries and request ids

Every error carries the API's own sentence: `AuthenticationError` (a wrong or revoked key),
`NotFoundError`, `BadRequestError`, `UnreadableError`, `RateLimitError`, `InternalServerError` and
`APIConnectionError`; all extend `GeniffyError`. Reads are retried twice on network errors, 408, 429 and
5xx; adding is retried only on 429, so a retry never saves a note twice. Pass `{ maxRetries, timeout }`
to the constructor to change that.

Every error carries the call's id as `error.requestId`. See [Request ids](https://docs.geniffy.com/request-ids).

A key reaches its owner's memory and every space beneath it. Keep it on your server.

## Source and examples

The SDK is open source under the MIT license: [Geniffy/geniffy-typescript](https://github.com/Geniffy/geniffy-typescript).
Runnable programs built on it, from a quickstart to a chat with Claude that remembers you, are in
[Geniffy/examples](https://github.com/Geniffy/examples/tree/main/javascript).
