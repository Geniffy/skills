# The Python SDK

From https://docs.geniffy.com/sdks/python.

Give your app a memory from Python 3.9 or later. Write what each of your users tells you, and put what
is known about them in front of your model, with where every line came from.

```bash
pip install geniffy
```

Make a key in the Geniffy app under **API keys** and set it as `GENIFFY_API_KEY`.

```python
from geniffy import Geniffy

client = Geniffy()                       # reads GENIFFY_API_KEY
mem = client.space("customer_1042")      # one of your users; nothing else can read it

source = mem.memories.add("Priya Nair signs the Lumen renewal, and it comes up in March.")
mem.sources.wait(source.id)              # learning usually takes a few seconds

prompt = f"{mem.context('Who signs the Lumen renewal?')}\n\nUser: Who signs the Lumen renewal?"
```

## Three ways to recall

```python
mem.context("Who signs the renewal?")    # a block for your own prompt; the one most apps want
mem.ask("Who signs the renewal?")        # an answer in words, or answer=None and a message saying why
mem.search("renewal", limit=5)           # the memories, ranked, to do with as you like
```

`context()` and `ask()` judge whether anything bears on the question. `search()` ranks and does not
judge: it returns its best matches for any question at all. `context_full()` returns the block with the
memories behind it and an `empty` flag. See [Recall](https://docs.geniffy.com/recall).

## Spaces: one memory per user

```python
mem = client.space(f"user_{user.id}")    # per request
client.memories.add("...")               # no space: your own memory, the one the Geniffy app shows
client.spaces()                          # which spaces hold anything, most recently written first
client.forget_space("user_8841")         # everything held for that user, gone, when they ask
```

A space exists from the first time you write to it; there is nothing to create. A blank space or `None`
raises. For a user's own app or device, make a key limited to them instead of shipping your key:
`client.space(f"user_{user.id}").keys.create(name="Their phone")` (`.key` is shown once). See
[Keys and spaces](https://docs.geniffy.com/keys-and-spaces).

## Add

```python
mem.memories.add("A note to remember", title="Call with Priya")
mem.memories.add(url="https://example.com")                     # a web page, read once
mem.memories.add(messages=chat_history)                         # a conversation, as your framework holds it
mem.memories.add_file("Pricing.pdf")                            # PDF, .docx, .pptx, .xlsx or text: a path, bytes or a file opened "rb"
mem.memories.add_many([{"text": "..."}, {"url": "https://..."}])
```

A file or page that cannot be read raises `UnreadableError`; `error.source` is the source it left, with
the reason. Syncing the app's own records (tickets, documents, a conversation that grows)? Pass
`external_id=` with the record's id: sending it again updates that source and learns only what changed,
and `mem.sources.delete(external_id=...)` removes it. See [Add memories](https://docs.geniffy.com/add-memories).
To sort what one user's memory holds (a channel, an account, a project), add with `labels={"channel": "email"}`
and pass the same `labels=` to `context`, `ask`, `search`, `memories.list` or `brief` to keep to them; every
name must match and a list of values is any one of them. Labels never replace spaces: a user is a space.
When a user disconnects a data source, `mem.sources.delete_labelled({"channel": "gmail"})` deletes everything
added under that label, with what only it taught; at the end of a sync that read everything,
`delete_labelled(labels, keep=seen)` deletes only what the source no longer has.
See [Labels](https://docs.geniffy.com/add-memories/labels).

## Read and correct

```python
page = mem.memories.list(kind="people")  # all, people, plan, pref or detail; newest first
for m in mem.memories.iter():            # every memory, a page at a time
    ...
detail = mem.memories.get(42)            # .memory.quote is the sentence it came from; .history its older values
mem.memories.correct(42, "Priya signs it, with Arjun co-signing.")
mem.memories.delete(42)                  # forget it for good
mem.profile("Priya Nair")                # what is lastingly true about someone, and what is going on now
mem.brief("Priya Nair")                  # what to read before talking to them
mem.sources.list()
mem.sources.delete(source.id)            # a source, and what only it taught
```

## Async

```python
from geniffy import AsyncGeniffy

async with AsyncGeniffy() as client:
    mem = client.space("customer_1042")
    await mem.memories.add("Priya wants a demo on Tuesday.")
    print(await mem.context("When is Priya's demo?"))
```

Every call above has an awaited twin on `AsyncGeniffy`.

## Errors, retries and request ids

Every error carries the API's own sentence: `AuthenticationError` (a wrong or revoked key),
`NotFoundError`, `BadRequestError`, `UnreadableError`, `RateLimitError`, `InternalServerError` and
`APIConnectionError`, all subclasses of `GeniffyError`. Reads are retried twice on network errors, 408,
429 and 5xx. Adding is retried only when the request never reached Geniffy, or on 429, so a retry never
saves a note twice. Set `max_retries=` and `timeout=` on the client to change that.

Every error carries the call's id as `error.request_id`. See [Request ids](https://docs.geniffy.com/request-ids).

A key reaches its owner's memory and every space beneath it. Keep it on your server.

## Source and examples

The SDK is open source under the MIT license: [Geniffy/geniffy-python](https://github.com/Geniffy/geniffy-python).
Runnable programs built on it, from a quickstart to a chat with Claude that remembers you, are in
[Geniffy/examples](https://github.com/Geniffy/examples/tree/main/python).
