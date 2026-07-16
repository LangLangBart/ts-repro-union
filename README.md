# Performance Unions Bug in Typescript with Reproduction

## Summary

Exponentially expensive iterations behavior when processing large
template-literal unions with an explicit type assignment.

See [benchmark.csv](benchmark.csv) for overview

## Reproducer

Files in this repo:

- `TypeName.d.ts` - 40k (200×200) template literal union
- `repro.ts` - triggers the bug via `let item: TypeName | undefined`
- `repro-inferred.ts` - same logic but without type annotation on `item`

The bug exists in tsc7 (the Go port) and tsc6. The former is just a bit faster.

Run with macOS 15.7.7 (Apple M1 Pro)

```bash
npm run tsc6
# Version 6.0.3
# real    0m27.094s
# user    0m27.574s
# sys     0m0.245s

npm run tsc6:inferred
# Version 6.0.3
# real    0m0.625s
# user    0m1.304s
# sys     0m0.064s

npm run tsc7
# Version 7.0.2
# real    0m8.657s
# user    0m8.866s
# sys     0m0.084s

npm run tsc7:inferred
# Version 7.0.2
# real    0m0.208s
# user    0m0.366s
# sys     0m0.033s
```

## Related Issues

- <https://github.com/microsoft/TypeScript/issues/63342>
  - Template literal union type-checking complexity, but the issue is diffrent
    to this problem and the attached PR to the issue did not help with the issue
    in this repo
