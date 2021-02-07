// Type definitions for @npmcli/arborist
// Project: https://github.com/npm/arborist
// Definitions by: Daniel Stockman <https://github.com/evocateur>
// Definitions: https://github.com/dendrochronologist/cli
// TypeScript Version: 4

/**
 * A optional logger passed around to many npm utilities (pacote, arborist, &c).
 * By default, 'log' events are emitted on the `process` object.
 */
export interface Logger {
  silly(prefix: string, message: string, ...args: unknown[]): void;
  verbose(prefix: string, message: string, ...args: unknown[]): void;
  info(prefix: string, message: string, ...args: unknown[]): void;
  http(prefix: string, message: string, ...args: unknown[]): void;
  notice(prefix: string, message: string, ...args: unknown[]): void;
  warn(prefix: string, message: string, ...args: unknown[]): void;
  error(prefix: string, message: string, ...args: unknown[]): void;
  silent(prefix: string, message: string, ...args: unknown[]): void;

  pause(): void;
  resume(): void;
}

interface PackageManifest {
  name?: string;
  version?: string;

  dependencies?: { [name: string]: string };
  devDependencies?: { [name: string]: string };
  optionalDependencies?: { [name: string]: string };
  peerDependencies?: { [name: string]: string };
  peerDependenciesMeta?: { [name: string]: { optional: boolean } };
  acceptDependencies?: { [name: string]: string };

  engines?: { [name: string]: string };
  os?: string[];
  cpu?: string[];
  license?: string;
  workspaces?: string[];

  // TODO: others from https://docs.npmjs.com/cli/v7/configuring-npm/package-json
}

interface RawPackageManifest extends PackageManifest {
  /** normalized to object */
  bin?: string | string[] | { [name: string]: string };
  /** boolean normalized to Object.keys(pkg.dependencies) */
  bundleDependencies?: string[] | boolean;
  /** renamed 'bundleDependencies' when normalized */
  bundledDependencies?: string[];
  /** string shorthand converted into { url } when normalized */
  funding?:
    | string
    | { type?: string; url: string }
    | (string | { type?: string; url: string })[];
}

interface NormalizedManifest extends PackageManifest {
  _integrity?: string;
  _hasShrinkwrap?: boolean;
  _resolved?: string;
  _where?: string;

  hasInstallScript?: boolean;
  deprecated?: boolean;

  bin?: { [name: string]: string };
  bundleDependencies?: string[];
  funding?:
    | { type?: string; url: string }
    | (string | { type?: string; url: string })[];
}

declare class Inventory extends Map<string, Node> {
  get primaryKey(): string;
  get indexes(): string[];
  filter(fn: (node: Node) => boolean): IterableIterator<Node>;
  add(node: Node): void;
  delete(node: Node): void;
  query(key: string, val: string): Node;
  query(key: string): IterableIterator<string>;
  has(node: Node): boolean;
}

interface DirectoryMeta {
  link: true;
  resolved: string;
}

interface LockfileMeta {
  requires?: { [key: string]: string };
  optional?: true;
  dev?: true;
  name?: string;
  integrity?: string;
  resolved: string;
  version?: string;
  inBundle?: true;
}

interface LockfileData {
  packages: { [name: string]: LockfileMeta | DirectoryMeta };
}

declare class Shrinkwrap {
  delete(nodePath: string): void;
  get(nodePath: string): LockfileMeta | DirectoryMeta;
  add(node: Node): void;
  addEdge(edge: Edge): void;
  commit(): LockfileData;
  save(): Promise<unknown[]>;
}

type EdgeType =
  | 'prod'
  | 'dev'
  | 'optional'
  | 'peer'
  | 'peerOptional'
  | 'workspace';

type EdgeError = 'DETACHED' | 'INVALID' | 'MISSING' | 'PEER LOCAL';

interface EdgeExplanation {
  type: EdgeType;
  name: string;
  spec: string;
  error?: EdgeError;
  from?: NodeExplanation;
}

declare class Edge {
  satisfiedBy(node: Node): boolean;
  explain(seen: Node[] = []): EdgeExplanation;

  get workspace(): boolean;
  get prod(): boolean;
  get dev(): boolean;
  get optional(): boolean;
  get peer(): boolean;

  get type(): EdgeType;
  get name(): string;
  get spec(): string;
  get accept(): string | undefined;

  get valid(): boolean;
  get missing(): boolean;
  get invalid(): boolean;
  get peerLocal(): boolean;

  get error(): EdgeError | null;

  reload(hard = false): void;
  detach(): void;

  get from(): Node;
  get to(): Node;
}

interface NodeExplanation {
  name: string;
  version: string;
  errors?: Error[];
  package?: NormalizedManifest;
  whileInstalling?: {
    name: string;
    version: string;
    path: string;
  };
  location?: string;
  dependents?: EdgeExplanation[];
}

declare class Node {
  name: string;
  // path can be null if it is a link target
  path: string | null;
  realpath: string;
  resolved: string | null;
  integrity: string | null;
  hasShrinkwrap: boolean;
  legacyPeerDeps: boolean;

  children: Map<string, Node>;
  fsChildren: Set<Node>;
  inventory: Inventory;
  tops: Set<Node>;
  linksIn: Set<Link>;

  dev: boolean;
  optional: boolean;
  devOptional: boolean;
  peer: boolean;
  extraneous: boolean;
  dummy: boolean;

  edgesIn: Set<Edge>;
  edgesOut: Map<string, Edge>;

  /** only root of tree has meta */
  get meta(): Shrinkwrap | undefined;

  get global(): boolean;
  get globalTop(): boolean;
  get workspaces(): null | Map<string, string>;
  get binPaths(): string[];
  get hasInstallScript(): boolean;
  get version(): string;
  get pkgid(): string;
  get package(): NormalizedManifest;

  explain(edge: Edge = null, seen: Node[] = []): NodeExplanation;
  isDescendantOf(node: Node): boolean;

  getBundler(path: Node[] = []): Node | null;
  get inBundle(): boolean;
  get inDepBundle(): boolean;

  get isWorkspace(): boolean;
  get isRoot(): boolean;
  get isProjectRoot(): boolean;
  get root(): Node;
  get fsParent(): Node;

  canReplaceWith(node: Node): boolean;
  canReplace(node: Node): boolean;

  satisfies(requested: Edge | string): boolean;
  matches(node: Node): boolean;

  replaceWith(node: Node): void;
  replace(node: Node): void;

  get inShrinkwrap(): boolean;
  get parent(): Node | null;

  addEdgeOut(edge: Edge): void;
  addEdgeIn(edge: Edge): void;

  get isLink(): false;
  get target(): null;

  get depth(): number;
  get isTop(): boolean;
  get top(): Node;

  get resolveParent(): Node;
  resolve(name: string): Node | null;

  inNodeModules(): string | false;
}

declare class Link extends Node {
  get isLink(): true;
  get target(): Node;
}

declare class Vuln {
  // blah blah blah
}

interface AuditReport extends Map<string, Vuln> {
  tree: Node;
}

interface RebuildMethodOptions {
  nodes: Node[];
  handleOptionalFailure?: boolean;
}

interface ScriptRunResult {
  pkg: NormalizedManifest;
  path: string;
  event: string;
  cmd?: string;
  env: { [name: string]: string };
  code: number;
  signal?: string;
  stdout: string;
  stderr: string;
}

interface ReifyMethodOptions extends ArboristOptions {
  omit?: string[];
}

/** A tree representing the difference between two trees */
declare class Diff {
  // blah blah blah
}

interface TrackerMixinOptions {
  log?: Logger;
}

interface BuildIdealTreeMixinOptions {
  registry?: string;
  idealTree?: Node;
  follow?: boolean;
  globalStyle?: boolean;
  legacyPeerDeps?: boolean;
  force?: boolean;
  packageLock?: boolean;
  strictPeerDeps?: boolean;
}
// TODO: yikes, lots of ad hoc options passed to method?

interface LoadActualMixinOptions {
  actualTree?: Node;
  filter?: (parent: Node, child: Node) => boolean;
  transplantFilter?: (child: Node) => boolean;
  ignoreMissing?: boolean;
  root?: Node;
}

interface RebuildMixinOptions {
  ignoreScripts?: boolean;
  scriptShell?: string;
  binLinks?: boolean;
  rebuildBundle?: boolean;
}

interface ReifyMixinOptions {
  savePrefix?: string;
  packageLockOnly?: boolean;
  dryRun?: boolean;
  formatPackageLock?: boolean;
}

interface ArboristOptions
  extends TrackerMixinOptions,
    BuildIdealTreeMixinOptions,
    LoadActualMixinOptions,
    RebuildMixinOptions,
    ReifyMixinOptions {
  path?: string;
  cache?: string;
  global?: boolean;
}

declare class Arborist {
  constructor(options: ArboristOptions = {});

  addTracker(section: string, subsection?: string, key?: string): void;
  finishTracker(section: string, subsection?: string, key?: string): void;

  async prune(): Promise<Node>;
  async dedupe(): Promise<Node>;
  async audit(): Promise<Node | AuditReport>;

  get explicitRequests(): Set<string>;
  /**
   * This is the tree of package data that we intend to install. It's built
   * up based on the shrinkwrap/lockfile (if present), the dependencies in
   * `package.json`, and any add/remove/update changes requested.
   *
   * This is loaded by calling `instance.buildIdealTree(options)`.
   * The options object can specify what to add, remove, and/or update.
   */
  idealTree: Node | null;
  async buildIdealTree(options: ArboristOptions = {}): Promise<Node>;

  /**
   * This is the representation of the actual packages on disk.
   * It's loaded by calling `instance.loadActual()`.
   */
  actualTree: Node | null;
  async loadActual(options: ArboristOptions = {}): Promise<Node>;

  /**
   * This is the package tree as captured in a `package-lock.json` or `npm-shrinkwrap.json`.
   * It's loaded by calling `instance.loadVirtual()`.
   */
  virtualTree: Node | null;
  /**
   * This method _may_ be called with an argument specifying the node
   * to use as the `root` of the tree. If a `root` is not specified,
   * then a shrinkwrap file _must_ be present, otherwise the virtual load fails.
   *
   * @example
   *  instance.loadVirtual();
   *  instance.loadVirtual({ root: nodeObject });
   */
  async loadVirtual(options: ArboristOptions = {}): Promise<Node>;

  scriptsRun: Set<ScriptRunResult>;
  async rebuild(options: RebuildMethodOptions = {}): Promise<void>;

  diff: Diff | null;
  /**
   * During reification, the `idealTree` is diffed against the actual tree,
   * then the nodes from the ideal tree are extracted onto disk.
   *
   * At the end of `instance.reify()`, the ideal tree is copied to `instance.actualTree`,
   * since then it reflects the actual state of the `node_modules` folder.
   */
  async reify(options: ReifyMethodOptions = {}): Promise<Node>;
}

export default Arborist;
export { Arborist, Node, Link, Edge };
