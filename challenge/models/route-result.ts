/** The three mutually exclusive observable outcomes defined by the contract. */
export type RouteResult =
  | { readonly requestId: string; readonly status: 'selected'; readonly selectedCellId: string; readonly attemptCellIds: readonly string[] }
  | { readonly requestId: string; readonly status: 'refused'; readonly reason: 'no_compatible_cell' }
  | { readonly requestId: string; readonly status: 'retryable'; readonly reason: 'evidence_unavailable' };
