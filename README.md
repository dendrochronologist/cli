# `dendrochronologist`

> A CLI for versioning and publishing npm packages in a monorepo.

[Dendrochronology](https://en.wikipedia.org/wiki/Dendrochronology) is the scientific method of dating tree rings to the exact year they were formed. `dendrochronologist` is a tool laser-focused on determining the version(s) for monorepo packages (aka [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)) and publishing them to the registry. Because `git` uses "tree" metaphors liberally, the naming pun could not be resisted.

## Install

```sh
npm install --save-dev dendrochronologist
```

You _can_ install it globally, but for the sake of consistency, it is best to install it locally in your workspace root manifest.

## Usage

From the command line:

```sh
npx dendrochronologist
```

From root manifest `scripts` (preferred):

```json
{
  "scripts": {
    "release": "dendrochronologist"
  }
}
```

## License

The code in this repository is covered by the [Parity Public License](https://paritylicense.com), a strong copyleft license.
