# Next.js Hybrid Starter

[Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily deploy [Next.js](https://nextjs.org/) apps in minutes. Use this repo with the [Azure Static Web Apps Hybrid Next.js tutorial](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-hybrid) to build and customize a new Next.js site.

## Running locally

To run locally, start by installing the Node dependencies. 

```bash
npm install
```

Start the development server with the following command:

```bash
npm run dev
```

Next, open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

For richer local development experience, refer to [Set up local development for Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/local-development).

## How it works

This starter application uses Next.js and React Server Components. By default, all Next.js components are React Server Components, and as such, are handled by Azure Static Web Apps-managed backend functions. Read more about [Next.js support for Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/nextjs). 

> **Note:** If you use the [Azure Static Web Apps CLI](https://docs.microsoft.com/azure/static-web-apps/local-development), copy the *staticwebapp.config.json* fil
> e to the *out* folder, and start the CLI from the *out* folder.

## License

This project is licensed under the [MIT License](LICENSE).

<!-- trigger deployment -->

## Configuration

Create a `.env.local` file based on the provided `.env.example` and supply the
required values.

- `OPENAI_API_KEY` &ndash; API key used by the assistant API routes.
- `NEXT_PUBLIC_CONTACT_FORM_URL` &ndash; URL of the embedded contact form used on
  the home and contact pages.
