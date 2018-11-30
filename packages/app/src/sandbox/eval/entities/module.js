// @flow

export type Module = {
  path: string,
  code: string,
  requires?: Array<string>,
  downloaded?: boolean,
  /** Whether the module was created a stub for the "browsers" package field */
  stubbed?: boolean,
};
