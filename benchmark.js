import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { Project, ts } from 'ts-morph'

function generateTypeName(length = 200) {
  const project = new Project()
  const file = project.createSourceFile('TypeName.d.ts', '', { overwrite: true })
  file.addTypeAliases([
    { name: 'TypeName', type: '`${Prefix}${Suffix}`' },
    { name: 'Prefix', type: ts.sys.newLine + Array.from({ length }, (_, i) => `"f_${i}|"`).join('|\n') },
    { name: 'Suffix', type: ts.sys.newLine + Array.from({ length }, (_, i) => `"i_${i}"`).join('|\n') }
  ])
  file.formatText()
  project.saveSync()
  return length * length
}

function measure(cmd) {
  const start = performance.now()
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 500_000 })
  }
  catch {
    process.stderr.write(`[ERROR] command failed: ${cmd}\n`)
    return -1
  }
  return Math.round(performance.now() - start)
}

// User infos
execSync('npx envinfo --system --binaries --npmPackages', { stdio: 'inherit' })

writeFileSync('benchmark.csv', 'n,members,tsc6_ms,tsc6_inferred_ms,tsc7_ms,tsc7_inferred_ms\n')
for (const n of [50, 75, 100, 125, 150, 175, 200]) {
  const members = generateTypeName(n)
  process.stdout.write(`n=${String(n).padEnd(3)} ${String(members).padStart(5)}x ==> `)

  const tsc6 = measure('npx tsc6')
  const tsc6Inferred = measure('npx tsc6 --project tsconfig.inferred.json')
  const tsc7 = measure('npx tsc')
  const tsc7Inferred = measure('npx tsc --project tsconfig.inferred.json')

  process.stdout.write(`tsc6=${tsc6}ms inferred=${tsc6Inferred}ms | tsc7=${tsc7}ms inferred=${tsc7Inferred}ms\n`)
  writeFileSync('benchmark.csv', `${n},${members},${tsc6},${tsc6Inferred},${tsc7},${tsc7Inferred}\n`, { flag: 'a' })
}
