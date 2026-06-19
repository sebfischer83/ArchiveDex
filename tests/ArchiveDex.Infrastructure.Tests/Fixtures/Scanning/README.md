# Scanning OCR fixtures

Place local test card photos here when OCR-quality regression tests are added.

Current fixture metadata is tracked in `fixtures.json`. Add every image there with:

- `file`
- `languageHint`
- `expectedName`
- `expectedNumber`
- `notes`

Suggested additional files:

- `en-clear-number.jpg` - English card, sharp photo, visible card number.
- `de-clear-number.jpg` - German card, sharp photo, visible card number.
- `low-light-or-blurry.jpg` - Difficult photo for fallback behavior.
- `no-card-text.jpg` - Valid image without readable card text.

Keep individual files under 10 MB. Do not commit personal collection photos unless they are intended to become shared test fixtures.
