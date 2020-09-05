---
layout: package
title: lerna-link-dep
packages:
  - update-versions
---

## Quick Take

`lerna add` runs whole chain of actions which are excessive, requires internet connection and slows us down.

We just want the — `npm i` but for packages within our monorepo!

That's what this CLI does:

```bash
deplink "detergent"
```

That's it. For example, symlink is created at "monorepo-root/packages/object-all-values-equal-to/node_modules/detergent" pointing to "monorepo-root/packages/detergent".

As you expect, `package.json` is updated, CLI's are linked properly to `bin/` and devDeps can be set via a flag:

```bash
deplink "detergent" -d
deplink "detergent" --dev
```

🍻🍺💪🏼💥🍻👍🏻

{% include "btt.njk" %}

## Supports CLI's

If your package ("b" from example above) is a CLI, symlinks will be put one level deeper, instead of within `node_modules`, for each entry in `bin` from package.json, a symlink will be created in `node_modules/.bin/`, pointing not to the root of the package "b" but straight to the file that `bin` entry in package.json was pointing to.

For example, [`lerna-clean-changelogs-cli`](/os/lerna-clean-changelogs-cli/) of ours has the following `bin` entry in its `package.json`:

```json
"bin": {
  "lcc": "cli.js",
  "lernacleanchangelog": "cli.js"
}
```

If you git-cloned our monorepo and wanted to link package `lerna-clean-changelogs-cli` to another package, two symlinks would be created, one for `lcc` and another for `lernacleanchangelog`, both pointing to the same file, `cli.js`.

PS. If you wonder, what happens if a package is both CLI and normal package (has both "main" and "bin" keys in `package.json`)? It will still work — both sets of symlinks will be created.

🍻🍺💪🏼🍻💪🏼🍻💥

{% include "btt.njk" %}

## Against `lerna link`

According to lerna link [documentation](https://github.com/lerna/lerna/tree/master/commands/link), `lerna link` "symlinks together all packages that are dependencies of each other". But we want just to symlink one!

By the way, it's not just me, people complain about it at Lerna's issues board [here](https://github.com/lerna/lerna/issues/2011), [here](https://github.com/lerna/lerna/issues/1839) and [here](https://github.com/lerna/lerna/issues/2029).

Well, now those days are gone, we have a simple dependency linker at last.

🍺💥🍻💪🏼🍻🍻💪🏼🍻

{% include "btt.njk" %}

## The finest ingredients

Only the finest ~dependencies~ ingredients are used in this CLI:

- [`fs-extra`](https://www.npmjs.com/package/fs-extra) - for promise-based I/O
- [`execa`](https://www.npmjs.com/package/execa) - to run shell processes, the `ln -s` part
- [`meow`](https://www.npmjs.com/package/meow) - to bootstrap the CLI
- [`update-notifier`](https://www.npmjs.com/package/update-notifier) - to remind users if currently installed CLI is outdated

🍻💪🏼🍻🍻💪🏼🍻💥

{% include "btt.njk" %}
