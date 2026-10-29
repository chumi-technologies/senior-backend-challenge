/** One tenant-scoped request in the synthetic routing exercise. */
export interface RouteRequest {
  readonly id: string;
  readonly tenantId: string;
  readonly model: string;
  readonly surface: string;
  readonly stream: boolean;
  readonly region: string;
  readonly fallbackConsent: boolean;
  readonly credentialScope: string;
  readonly thinkingShape?: string;
}
