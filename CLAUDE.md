<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
`specs/001-pokemon-card-manager/plan.md`

Active feature: ArchiveDex — single-user Pokémon Card Collection Manager.
Stack: .NET 9 / ASP.NET Core, Blazor Web App (InteractiveServer), EF Core
(PostgreSQL or embedded SQLite), Tesseract OCR (+ optional OpenCV), Clean
Architecture (Domain/Application/Infrastructure/Api/Web), Dockerized.
UI cultures: de/en/ru — kept separate from card languages
(de/en/ja/ko/zh-Hans/zh-Hant). Constitution v1.0.0 governs (test-first,
code quality, UX consistency, performance budgets).
Design docs: spec.md, research.md, data-model.md, contracts/, quickstart.md.
<!-- SPECKIT END -->
