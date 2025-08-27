export interface PageVisibilityParams {
  abortSignal?: AbortSignal;
  whenVisible?: () => void;
  whenHidden?: () => void;
}
