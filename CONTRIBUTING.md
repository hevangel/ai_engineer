# Contributing to AI Engineer

## The One Rule

**All changes to this repository must be made by an AI coding agent.** Human contributors do not edit files directly — not code, not documentation, not data, not configuration. If you want something changed, instruct your AI agent to make the change.

This is not a suggestion. Pull requests containing hand-written edits will be rejected.

Humans contribute by:

- Defining requirements and filing issues
- Directing AI agents
- Reviewing pull requests
- Approving or rejecting changes
- Providing feedback for the agent to address

The same rule applies to the `ai_hw_engineer`, `ai_sw_engineer` and `hdl-workbench` submodules, which have their own contribution guidelines.

## How to Contribute

### 1. Fork and Clone

```sh
git clone https://github.com/<your-fork>/ai_engineer.git
cd ai_engineer
git submodule update --init
```

### 2. Create a Branch

Never commit directly to `main`.

```sh
git checkout -b <type>/<description>
```

Branch naming:

- `website/<description>` — pages, styles, rendering or timeline data
- `docs/<topic>` — documentation and specifications
- `fix/<description>` — bug fixes
- `scripts/<description>` — synchronization, preview and check scripts
- `pins/<description>` — intentional submodule pin updates

### 3. Instruct Your AI Agent

Tell your agent what you want. The agent reads [AGENTS.md](AGENTS.md) and the relevant [specifications](spec/README.md) for conventions and repository structure.

A change inside a submodule is made and merged in that project's repository first. A root pull request then updates the pin to the reviewed revision.

### 4. Verify

Before opening a pull request, the agent runs the checks relevant to the change:

```sh
node scripts/check-site.mjs
node scripts/sync-timeline.mjs --check
node --test scripts/status.test.mjs
```

For visible changes, also inspect the page with `node scripts/serve.mjs` at desktop and narrow widths. Documentation-only changes do not require the implementation checks.

### 5. Open a Pull Request

The pull request description must include:

- **What**: Clear description of the change
- **Why**: Motivation or issue reference
- **Verification**: The exact checks run and their results, plus any limitations
- **Agent**: Which AI agent authored the changes

### 6. Review Process

1. Maintainers review the pull request (humans review, not edit)
2. If changes are needed, the reviewer comments with feedback
3. The contributor's AI agent addresses the feedback
4. Repeat until approved
5. A maintainer merges

Merging does not deploy the site; publication is a separate, explicitly authorized step.

## What We Don't Accept

- Human-authored file edits (enforced by review)
- Changes without the relevant verification
- Hard-coded statuses, percentages or verification claims that are not backed by linked evidence
- Unsourced historical claims or unlicensed images
- Analytics, tracking or server-side runtime requirements
- Routine submodule pin bumps without review of the represented changes

## Issue Reporting

File issues with a clear title, the expected and actual behavior, steps to reproduce (for bugs), and the browser or environment where relevant. Roadmap issues follow the [project manager instructions](spec/project_manager.md).

## License

By contributing, you agree that your contributions are licensed under the same terms as the project (see [LICENSE](LICENSE)). Photographs keep their individual licenses as recorded in `images/credits.json`, and each submodule keeps its own license.
