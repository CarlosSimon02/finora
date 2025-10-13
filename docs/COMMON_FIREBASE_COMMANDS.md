# Firebase CLI — Common Commands & Troubleshooting (for **finora**)

A concise reference of the Firebase CLI commands and workflows you used and will commonly use while developing and deploying the _finora_ project. It includes quick examples, troubleshooting tips (from your terminal output), and CI notes.

> Keep this file in your repo (e.g. `/docs/FIREBASE_COMMANDS.md` or `README_FIREBASE.md`) and update it when your workflow changes.

---

## Prerequisites

- Node.js & npm installed. Use an LTS version (e.g. 18, 20).
- `firebase-tools` CLI installed globally or as an npm script in your repo.

  ```bash
  npm i -g firebase-tools
  # or in repo: npm install --save-dev firebase-tools
  ```

- You must run CLI commands from your project root (where `firebase.json` and `.firebaserc` live).
- Be logged in with the correct Google account that has access to the projects:

  ```bash
  firebase login
  ```

> Note: you might see a Node deprecation warning about `punycode`. It's harmless and can be ignored.

---

## Helpful project files

- `.firebaserc` — maps local aliases (dev/prod) to project IDs.
- `firebase.json` — which features to deploy and file references (rules, indexes, hosting, rewrites).
- `firestore.rules` — Firestore security rules (version-controlled).
- `firestore.indexes.json` — composite index definitions (version-controlled).
- `storage.rules` — Cloud Storage rules (if used).
- `functions/` — Cloud Functions source code.

Keep the above files in repo root or a `firebase/` folder and reference paths in `firebase.json`.

---

## Basic commands (daily use)

### Authentication & checking login

```bash
firebase login                # interactive login
firebase login --reauth       # force reauth
firebase logout
```

### List your projects

```bash
firebase projects:list
# shows project IDs and display names
```

### Initialize a repo (creates firebase.json & .firebaserc)

```bash
firebase init
# choose features: Firestore, Emulators, Functions, Hosting, Storage, etc.
```

**Tip:** If you only need minimal files or want to script it, you can create `firebase.json` and `.firebaserc` manually.

### Add or switch aliases

```bash
firebase use --add     # interactively add an alias (e.g. dev, prod)
firebase use <alias>   # switch to alias
firebase use <projectId> # set active project by project id
firebase use            # show current active project
```

If `firebase use --add` errors with `must be run from a Firebase project directory`, run `firebase init` from the repo root or add a minimal `firebase.json` first (see Troubleshooting).

---

## Firestore: export indexes from dev → deploy to prod

### Export composite indexes from a project (dev)

```bash
firebase firestore:indexes --project <dev-project-id> > firestore.indexes.json
# or use alias if supported by your firebase-tools version
firebase firestore:indexes --project dev > firestore.indexes.json
```

### Deploy indexes (and rules) to production

```bash
# deploy indexes only
firebase deploy --only firestore:indexes --project prod
# deploy rules only
firebase deploy --only firestore:rules --project prod
# deploy both (if CLI version doesn't support sub-targets)
firebase deploy --only firestore --project prod
```

**Note:** Index creation is asynchronous (BUILDING → READY). Monitor in Firebase Console → Firestore → Indexes.

---

## Deploying (general)

- Deploy everything configured in `firebase.json` (use alias or `--project`):

```bash
firebase deploy --project <alias-or-projectId>
```

- Deploy specific targets (minimize blast radius):

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage:rules,functions,hosting --project prod
```

If `--only firestore:indexes` isn't supported by your `firebase-tools` version, use `--only firestore`.

---

## Emulators (local testing — strongly recommended)

Start the emulators you've configured in `firebase.json`:

```bash
firebase emulators:start --only firestore,auth,functions,storage
```

Run one-off commands/tests using the emulators:

```bash
firebase emulators:exec "npm test"
```

- Emulator UI often available at `http://localhost:4000`.
- Use `@firebase/rules-unit-testing` for automated rule tests.

---

## Auth export / import (backups & migration)

```bash
# export users (sensitive! keep it private, don't commit)
firebase auth:export users.json --format=json --project <project-id>

# import users (requires matching hash params)
firebase auth:import users.json --hash-algo=... --hash-key=... --rounds=...
```

**Warning**: Do not commit exported user files to git.

---

## Functions (build & deploy)

Build and deploy functions from `functions/`:

```bash
# if using typescript: build first (if not handled by firebase predeploy)
cd functions
npm ci
npm run build
cd ..

firebase deploy --only functions --project prod
```

Test functions locally with emulators: `firebase emulators:start --only functions,firestore,auth`.

---

## Hosting

```bash
# Deploy hosting (static or SSR depending on your config)
firebase deploy --only hosting --project prod
# If using rewrites to functions (SSR), ensure functions built and deployed first
```

---

## CI & Automation (GitHub Actions example)

Use a CI job that runs tests and deploys only after success. Prefer Workload Identity or a CI service account with least privileges; `FIREBASE_TOKEN` (from `firebase login:ci`) can be used for simplicity.

**Minimal workflow snippet**

```yaml
# .github/workflows/firebase-deploy.yml (skeleton)
name: Firebase Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm i -g firebase-tools@latest
      - run: firebase deploy --only firestore:rules,firestore:indexes,functions,hosting --project prod
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

**Security note:** prefer Workload Identity or short-lived credentials over long-lived service account keys.

---

## Useful troubleshooting notes (from your session)

- `Error: firebase use must be run from a Firebase project directory.`
  - Fix: run `firebase init` in repo root (creates `firebase.json` and `.firebaserc`), or create a minimal `firebase.json` manually: `echo '{}' > firebase.json`.

- `Already logged in as ...` — indicates `firebase login` was successful.

- `Error: Invalid project selection, please verify project <id> exists and you have access.`
  - Fix: ensure you used the correct project ID or alias. Use `firebase projects:list` to confirm accessible projects.

- Deprecation warnings about `punycode` are harmless; you can ignore them.

---

## Best practices & safety

- Keep `firestore.rules` and `firestore.indexes.json` under version control with PR reviews.
- Never commit service-account JSON or `auth:export` output to git.
- Limit who can deploy to `prod` (restrict IAM roles and use a CI deployer account).
- Use emulator tests to validate rules before deploy.
- Pin `firebase-tools` in CI.
- Monitor Cloud Audit Logs for unexpected deploys or key creation.

---

## Quick reference: commands cheat sheet

```bash
# auth & projects
firebase login
firebase logout
firebase projects:list

# init & aliases
firebase init
firebase use --add
firebase use <alias>

# emulators
firebase emulators:start --only firestore,auth,functions
firebase emulators:exec "npm test"

# firestore indexes & rules
firebase firestore:indexes --project <proj> > firestore.indexes.json
firebase deploy --only firestore:indexes --project <proj>
firebase deploy --only firestore:rules --project <proj>

# deploy
firebase deploy --project <proj>
firebase deploy --only functions,hosting --project <proj>

# auth export/import
firebase auth:export users.json --project <proj>
firebase auth:import users.json --hash-algo=... --rounds=... --hash-key=...
```

---

If you want, I can:

- add a short section with the exact `firebase.json` content currently in your repo (paste it here) and explain each field, or
- create a GitHub Actions workflow fully tailored to this repo (I can produce a ready-to-add file), or
- generate a `functions/` starter that verifies ID tokens (Auth) and App Check for your deny-all rules approach.

Tell me which of the above you want and I’ll add it to this document.
