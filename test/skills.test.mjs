// Every skill here keeps to the Agent Skills format, so every agent that reads skills can load it: a name
// that matches its folder, a description that says what and when, and links that lead somewhere.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "skills");
const skills = fs.readdirSync(ROOT).filter((d) => fs.existsSync(path.join(ROOT, d, "SKILL.md")));

test("there are skills to test", () => assert.ok(skills.length > 0));

for (const name of skills) {
  const dir = path.join(ROOT, name);
  const src = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8").replace(/\r\n/g, "\n");

  test(`${name}: the front matter is what agents read first`, () => {
    const m = /^---\n([\s\S]*?)\n---\n/.exec(src);
    assert.ok(m, "SKILL.md starts with front matter");
    const meta = Object.fromEntries(m[1].split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]));
    assert.equal(meta.name, name, "the name is the folder's");
    assert.match(meta.name, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(meta.name.length <= 64);
    assert.ok(meta.description && meta.description.length <= 1024, "a description, at most 1,024 characters");
    assert.match(meta.description, /\bUse when\b/, "the description says when to use it");
  });

  test(`${name}: every link inside the skill leads to a file that is there`, () => {
    for (const file of [path.join(dir, "SKILL.md"), ...walk(dir).filter((f) => f.endsWith(".md"))]) {
      const text = fs.readFileSync(file, "utf8");
      for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^(https?:|mailto:|#)/.test(target)) continue;
        assert.ok(fs.existsSync(path.join(path.dirname(file), target)), `${path.relative(dir, file)} links to ${target}`);
      }
    }
  });

  test(`${name}: kept short enough to load, and written plainly`, () => {
    assert.ok(src.split("\n").length <= 500, "SKILL.md stays under 500 lines");
    for (const file of walk(dir)) assert.doesNotMatch(fs.readFileSync(file, "utf8"), /\u2014/, `${path.relative(dir, file)} has no em dashes`);
  });
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
