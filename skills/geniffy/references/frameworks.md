# Frameworks

Every integration is the same two calls, put where the framework runs code around the model:

- **Before the model:** `context(question)` for the end user's space, placed in the system prompt, the
  instructions, or the agent's memory block. Or a recall tool the agent calls, built on `ask()` or `search()`.
- **After the reply:** `memories.add(messages=...)` with the turn as the framework holds it (OpenAI,
  Anthropic, Gemini and Vercel AI SDK message shapes are read as they are).

Each page below is tested end to end. Fetch the `.md` address for the exact code. For the Vercel AI SDK,
LangChain, LlamaIndex and the OpenAI Agents SDK, the page opens with a package that makes both calls:
`geniffy-ai-sdk`, `langchain-geniffy`, `llama-index-memory-geniffy` and `openai-agents-geniffy`.

| Framework | What the page builds | Page |
| --- | --- | --- |
| Agno | Give an Agno agent a memory of each of your users, through dynamic instructions or a recall tool, with the user from the run. | https://docs.geniffy.com/integrations/agno.md |
| Anthropic | Give Claude a memory of each of your users with the Anthropic SDK. What is known goes in the system prompt, and each exchange is saved after the reply. | https://docs.geniffy.com/integrations/anthropic.md |
| CrewAI | Give a CrewAI crew a memory of each of your users, with what is known in the agent's backstory, or a recall tool the agent calls. | https://docs.geniffy.com/integrations/crewai.md |
| Google Gemini | Give your Gemini app a memory of each of your users with the Google Gen AI SDK. What is known goes in the system instruction, and each exchange is saved after the reply. | https://docs.geniffy.com/integrations/gemini.md |
| Google ADK | Give an Agent Development Kit agent a memory of each of your users, with Geniffy as the runner's memory service, used by ADK's own memory tools. | https://docs.geniffy.com/integrations/google-adk.md |
| LangChain | Give a LangChain agent a memory of each of your users, with two small pieces of middleware, or with a recall tool the agent calls. | https://docs.geniffy.com/integrations/langchain.md |
| LangGraph | Give a LangGraph graph a memory of each of your users, with a node that recalls before the model and a node that remembers after it. | https://docs.geniffy.com/integrations/langgraph.md |
| LiveKit | Give a LiveKit voice agent a memory of each caller, with what is known put in front of the LLM before every reply and each exchange saved once the agent has answered. | https://docs.geniffy.com/integrations/livekit.md |
| LlamaIndex | Give a LlamaIndex agent a memory of each of your users, with a memory block that recalls what is known, or a recall tool the agent calls. | https://docs.geniffy.com/integrations/llamaindex.md |
| Make | Remember and recall from any Make scenario with the HTTP app's Make a request module, with your key kept in a keychain. | https://docs.geniffy.com/integrations/make.md |
| Mastra | Give a Mastra agent a memory of each of your users, through dynamic instructions or a recall tool, with the user in the runtime context. | https://docs.geniffy.com/integrations/mastra.md |
| Microsoft Agent Framework | Give an Agent Framework agent a memory of each of your users with a context provider that recalls before each run and remembers after it. | https://docs.geniffy.com/integrations/microsoft-agent-framework.md |
| n8n | Remember and recall from any n8n workflow with the HTTP Request node, and give the AI Agent node what is known about each user. | https://docs.geniffy.com/integrations/n8n.md |
| OpenAI Agents SDK | Give an OpenAI agent a memory of each of your users, through dynamic instructions or a recall function tool, with the async client. | https://docs.geniffy.com/integrations/openai-agents-sdk.md |
| OpenAI | Give your OpenAI app a memory of each of your users with the Responses API. What is known goes in the instructions, and each exchange is saved after the reply. | https://docs.geniffy.com/integrations/openai.md |
| Pipecat | Give a Pipecat voice agent a memory of each caller, with one frame processor that puts what is known in front of the LLM each turn and saves the call when it ends. | https://docs.geniffy.com/integrations/pipecat.md |
| Pydantic AI | Give a Pydantic AI agent a memory of each of your users, through dynamic instructions or a recall tool, with the user as the agent's dependency. | https://docs.geniffy.com/integrations/pydantic-ai.md |
| Vapi | Give a Vapi phone assistant a memory of each caller, from your own server URL. What matters about the caller goes into its prompt when a call starts, it can look things up mid-call, and the call is saved when it ends. | https://docs.geniffy.com/integrations/vapi.md |
| Vercel AI SDK | A streaming chat route that remembers each of your users, for any model the AI SDK supports. Nothing changes in the browser. | https://docs.geniffy.com/integrations/vercel-ai-sdk.md |
| Zapier | Remember what arrives in your Zaps, from forms, email and CRMs, and ask your memory from any Zap, with Webhooks by Zapier. | https://docs.geniffy.com/integrations/zapier.md |

For a framework not listed, follow the pattern on https://docs.geniffy.com/integrations.md (any framework).
