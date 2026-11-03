/** One observed stream event; sequence defines the observation order. */
export type GatewayEvent = { readonly sequence: number; readonly kind: 'accepted' | 'chunk' | 'downstream-complete' | 'provider-error' | 'client-cancel' } | { readonly sequence: number; readonly kind: 'upstream-complete'; readonly units: number };
