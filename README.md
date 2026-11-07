# Club ERP + POS (padel module)

An all-in-one management system for a private country club: **memberships, recurring billing, point of sale** for restaurants and snack bars, **padel** (courts, bookings, classes), golf, gym, salon, events, visitor access by QR code, and financial reports.

It was built as an MVP for a real club and anonymized for this portfolio. The architecture is meant to be reused by other clubs and condominiums.

## Highlights

- **Padel module:** court booking, classes and pricing, with an API reference and a data dictionary in `Docs_Tecnicos/` and a user manual in `Manuales_Usuario/`.
- **POS** for food and beverage outlets.
- **Executive dashboard** with KPIs and charts by business area.

## Stack

React 19 · TypeScript · Vite · Tailwind 4 · shadcn/ui · Recharts · Wouter · tRPC · Drizzle ORM · Node/Express · Google Cloud Run + Cloud SQL · Vitest

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Original Spanish README: [README.es.md](README.es.md).

## License

AGPL-3.0 © 2026 Roy Camacho Jácome. You can use, modify and self-host it; if you offer it to others as a service, you must publish your source code under the same license. For a commercial license, contact the author. See [LICENSE](LICENSE).
