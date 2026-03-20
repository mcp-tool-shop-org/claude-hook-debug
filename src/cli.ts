import { debug } from './index.js';
import { formatReport, formatReportJson } from './report.js';

const args = process.argv.slice(2);
const useJson = args.includes('--json');
const projectRoot = args.find((a) => !a.startsWith('-'));

const report = debug({ projectRoot: projectRoot ?? process.cwd() });

if (useJson) {
  console.log(formatReportJson(report));
} else {
  console.log(formatReport(report));

  // Exit code: 1 if any errors, 0 otherwise
  const hasErrors = report.diagnostics.some((d) => d.severity === 'error');
  process.exit(hasErrors ? 1 : 0);
}
