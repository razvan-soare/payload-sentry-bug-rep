import path from 'path';

import { payloadCloud } from '@payloadcms/plugin-cloud';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';
import { buildConfig } from 'payload/config';

import Users from './collections/Users';
import { viteBundler } from '@payloadcms/bundler-vite';
import { sentry } from '@payloadcms/plugin-sentry';

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
  },
  editor: slateEditor({}),
  collections: [Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    payloadCloud(),
    sentry({
      dsn: process.env.SENTRY_DSN,
      options: {
        init: {
          debug: true,
          environment: 'development',
          tracesSampleRate: 1.0,
        },
        requestHandler: {
          serverName: false,
          user: ['email'],
        },
        captureErrors: [400, 403, 404],
      },
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
});
