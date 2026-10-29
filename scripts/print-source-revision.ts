import { collectSourceRevision } from './checks/collect-source-revision';
process.stdout.write(`${JSON.stringify(collectSourceRevision(process.cwd()), null, 2)}\n`);
