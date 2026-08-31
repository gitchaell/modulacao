cat << 'PLAN' > plan.md
1. **Audit i18n & Dark Mode**
   - Wrote and executed Python scripts to audit missing `dark:` classes and hardcoded raw text (`i18n`).
   - Replaced several raw texts in `src/components/home/Hero.astro`, `src/components/home/CTA.astro`, `src/components/home/Events.astro`, `src/components/shop/ProductGrid.astro` and others with calls to translation functions (`t`).
   - Populated the corresponding translation files in `pt.json`, `es.json`, `en.json` (e.g., for `home`, `shop`).

2. **Fix Missing Translations & Dark Mode styling**
   - Search the remaining files from `i18n_audit_new.txt` (e.g., Footer.astro, Header.astro, etc.) and update them with dynamic translations where raw text is detected.
   - Run the dark mode audit script output again and fix occurrences where `bg-`, `text-`, or `border-` have no matching `dark:` equivalent. This includes fixing `src/components/core/Header.astro`, `src/components/home/Features.astro`, etc., to implement `dark:bg-*` and `dark:text-*` dynamically.

3. **Verify App Routing and Check Compile Issues**
   - Run `npx astro check --yes` and `npm run build` to verify typings, unread variables, or other AST issues. Address unused variables.
   - Run UI checks against standard elements (`Button`, `Toast`, `Input`, `Header`, `Footer`) to ensure translations render cleanly and dark mode reflects visually.

4. **Complete pre-commit steps and submit**
   - Run `pre_commit_instructions` tool to run the necessary checks before pushing changes.
   - Submit the changes using the `submit` tool.
PLAN
