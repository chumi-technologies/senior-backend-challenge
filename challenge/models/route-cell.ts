/** Declared capabilities and observations for one provider cell. */
export interface RouteCell {
  readonly id: string;
  readonly vendor: string;
  readonly credentialGroup: string;
  readonly credentialScope: string;
  readonly models: readonly string[];
  readonly surfaces: Readonly<Record<string, { readonly stream: boolean; readonly nonStream: boolean }>>;
  readonly regions: readonly string[];
  readonly health: 'passing' | 'blocked' | 'unknown';
  readonly lastProbeAt?: string;
  readonly priceObservedAt?: string;
  readonly pricePerMillionInput: number;
  readonly priority: number;
  readonly thinkingShapes?: readonly string[];
}
