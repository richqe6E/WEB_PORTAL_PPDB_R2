# Context Persistence Rule

## Mandatory Workflow
1. **Always Read `PROJECT_CONTEXT.md` First**: Before implementing any feature, modifying design, or refactoring code in a new session, review `PROJECT_CONTEXT.md`.
2. **Follow SPMB POLNES & Yayasan ICA Design System**:
   - Primary: `#006633`
   - Secondary: `#F78100`
   - Container: `card-base-pmb` (rounded-lg, border #DFE3E9, no asymmetric vertical side stripes)
   - Status Tag: `rounded-[4px]` with high contrast, no `rounded-full` pills
   - Icons: Semantic only, zero `Sparkles` icon
   - Organization Name: **YAYASAN ICA**
3. **Always Update Documentation**:
   - When finishing a task or adding a capability, update `PROJECT_CONTEXT.md`.
   - Verify `tsc --noEmit` returns 0 errors.
   - Commit and push to `origin main` to keep Vercel production updated.
