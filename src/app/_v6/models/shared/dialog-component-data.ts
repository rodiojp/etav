/**
 * Data structure passed to dialog components
 */
export interface DialogComponentData<TData, TResult> {
  input: TData | null;
  output: TResult | null;
}