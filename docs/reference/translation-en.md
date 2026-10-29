# English translation verification

Date: 2026-10-30 (Asia/Seoul)

## Sources and scope

The English UI dictionary mirrors `src/i18n/locales/ko.json`. FAQ content is translated from `src/content/translations/ko/faq.json`. The full Korean documents `src/content/legal/privacy.md` and `src/content/legal/terms.md` are the source for the English legal translations. Existing external English policy links are retained; their content has not replaced or shortened the Korean document structure.

Deliverables:

- `src/i18n/locales/en.json`
- `src/content/translations/en/faq.json`
- `src/content/translations/en/privacy.md`
- `src/content/translations/en/terms.md`
- `src/content/translations/en/privacy-toc.json`
- `src/content/translations/en/terms-toc.json`

All UI, metadata, navigation, footer labels and address, media descriptions, FAQ text, and legal text are translated. The document translation label is exactly `Translated from the Korean original`. No additional statement about legal precedence was added.

## Structure verification

A Python comparison parsed each JSON file, recursively compared dictionary keys, array lengths and value types, and compared the translated FAQ's IDs, source block IDs, ordered HTML tags and link targets against the Korean source. It also compared the legal documents' ordered HTML tags and anchors, ordered URLs, Markdown heading/list/blockquote counts and blank-line-separated paragraph block counts.

| Check | Result |
| --- | --- |
| UI recursive shape | Exact match with Korean dictionary |
| FAQ recursive shape | Exact match with Korean FAQ |
| FAQ questions | All 18 retained in source order |
| FAQ IDs/sourceBlockId | Exact match for all 18 |
| FAQ HTML nesting and tags | Exact match for all 18 answers |
| FAQ link targets | Exact match |
| FAQ category membership | Every item belongs to a translated category |
| Privacy sections | All 13 retained, `section-1` through `section-13` |
| Privacy paragraph blocks | 115 in both documents |
| Privacy top-level Markdown list items | 55 in both documents |
| Terms sections | All 16 retained, `section-1` through `section-16` |
| Terms paragraph blocks | 98 in both documents |
| Terms top-level Markdown list items | 52 in both documents |
| Legal HTML nesting, IDs and URLs | Exact ordered match |
| Korean fallback scan | No Hangul in any English UI, FAQ or legal file |

Both translated tables of contents were generated from their respective English H2 headings and preserve the original section IDs. Privacy version `v1.3.2`, the previous effective date of October 1, 2026, the current effective date of October 14, 2026, and the Terms update date of October 1, 2026 are retained. Permissions `READ_STEPS` and `READ_HEALTH_DATA_HISTORY`, the 30-day history threshold, all contact URLs, phone numbers and email addresses are retained.

## Meaning and source inconsistencies

The translations retain every source paragraph and list item, including the detailed Android Health Connect handling, optional Apple Health access, analytics consent distinctions, diagnostics independence, on-device storage, export/sharing behavior, withdrawal of permissions, payments, refunds and user rights.

The FAQ source's `1080k` resolution label is retained rather than corrected to a guessed value. Question 14's additional settings instruction is also translated in the question itself. The Privacy Policy's Slashpage hosting reference and statements about App deletion are preserved as written. Source references specifically mentioning iPhone or Apple accounts have not been expanded to additional platforms. The Terms section on step counts continues to refer to Apple Health as in the Korean original.

The contact person's name is transliterated as Sohyeon Kim and the Korean postal address is rendered in English without changing the building, street, unit or city information. These are language renderings of the same contact details.

Template rendering, language switching, route generation, localized structured data, final build checks and browser testing are handled in the integration work; this report verifies the English content files themselves.
