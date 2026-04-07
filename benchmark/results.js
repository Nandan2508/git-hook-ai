/**
 * computeMetrics
 *
 * For each test case we record:
 *   - expected: 'buggy' | 'clean'
 *   - detected: true (flagged CRITICAL/WARNING) | false (said CLEAN)
 *
 * True Positive  (TP): buggy file correctly flagged
 * False Positive (FP): clean file incorrectly flagged
 * False Negative (FN): buggy file missed
 * True Negative  (TN): clean file correctly passed
 */
const computeMetrics = (results) => {
  let TP = 0, FP = 0, FN = 0, TN = 0
  const latencies = []

  for (const r of results) {
    if (r.latencyMs) latencies.push(r.latencyMs)

    if (r.expected === 'buggy' && r.detected)  TP++
    if (r.expected === 'clean' && r.detected)  FP++
    if (r.expected === 'buggy' && !r.detected) FN++
    if (r.expected === 'clean' && !r.detected) TN++
  }

  const precision = TP + FP === 0 ? 0 : TP / (TP + FP)
  const recall    = TP + FN === 0 ? 0 : TP / (TP + FN)
  const f1        = precision + recall === 0 ? 0 : 2 * (precision * recall) / (precision + recall)
  const accuracy  = results.length === 0 ? 0 : (TP + TN) / results.length
  const fpr       = TN + FP === 0 ? 0 : FP / (FP + TN) // false positive rate

  const avgLatency = latencies.length
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
    : 0
  const p90Latency = latencies.length
    ? latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.9)]
    : 0

  return {
    TP, FP, FN, TN,
    precision: +(precision * 100).toFixed(1),
    recall:    +(recall    * 100).toFixed(1),
    f1:        +(f1        * 100).toFixed(1),
    accuracy:  +(accuracy  * 100).toFixed(1),
    fpr:       +(fpr       * 100).toFixed(1),
    avgLatencyMs: avgLatency,
    p90LatencyMs: p90Latency,
  }
}

module.exports = { computeMetrics }