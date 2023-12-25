/*
 * The result of an inference request.
 * `output` is the generated text (markdown).
 * `score` is the score (0~1) of the generated text.
 */
export interface IInferenceResult {
  output: string;
  score: number;
}
