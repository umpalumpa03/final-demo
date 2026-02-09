export function calculateBitwiseSum(
  formValues: Record<string, boolean>,
): number {
  return Object.keys(formValues)
    .filter((key) => formValues[key] === true)
    .map((key) => Number(key))
    .reduce((sum, val) => sum + val, 0);
}
