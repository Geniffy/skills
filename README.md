<p align="center">
  <a href="https://geniffy.com"><img src="https://geniffy.com/brand/geniffy-lockup-ink.png" alt="Geniffy" height="44"></a>
</p>

# Geniffy skills

Agent Skills that teach coding agents to build with Geniffy. Install one, and your agent knows how to give
your app a memory of each of its users: the SDK, one space per user, `context()` before the model,
`memories.add()` after, and the mistakes to avoid.

[![CI](https://github.com/Geniffy/skills/actions/workflows/ci.yml/badge.svg)](https://github.com/Geniffy/skills/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-docs.geniffy.com-1A1814)](https://docs.geniffy.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Install

With the skills installer, for Claude Code, Cursor, Codex, OpenCode and other agents:

```bash
npx skills add Geniffy/skills
```

Or by hand: copy `skills/geniffy` into your agent's skills folder, such as `~/.claude/skills/` for Claude Code
or `.claude/skills/` in your project.

## Skills

| Skill | What it teaches |
| --- | --- |
| [`geniffy`](skills/geniffy/SKILL.md) | Adding long-term memory to an app: the Python and TypeScript SDKs, the REST API, one space per user, recall before the model and saving after, forgetting a user, errors, and a test. With a reference for every SDK call and a pointer to the tested page for each framework |

Then ask your agent to "add memory to this app with Geniffy". It reads the skill when the work calls for it.

## Related

- [Agent prompt](https://docs.geniffy.com/agent-prompt): the same integration as one prompt to paste.
- [Geniffy for Claude Code](https://github.com/Geniffy/geniffy-claude-code): your own memory inside Claude Code.
- [Docs](https://docs.geniffy.com): every page is also Markdown at its `.md` address.

## Develop

```bash
npm test     # checks every skill's front matter, links and length
```
