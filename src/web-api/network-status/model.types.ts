export interface NetworkStatusParams {
  abortSignal?: AbortSignal;
  whenOnline?: () => void;
  whenOffline?: () => void;
}
