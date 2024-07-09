import dotenv from "dotenv";
import { str, envsafe, port, url, bool, num } from "envsafe";

dotenv.config();

export const env = envsafe({
  NODE_ENV: str({
    desc: "The platform environment",
    default: "production",
    choices: ["development", "production"],
  }),
  APP_ENV: str({
    desc: "The application environment",
    default: "production",
    choices: ["development", "staging", "production"],
  }),
  PORT: port({
    desc: "The port the app is running on",
  }),
  FRONTEND_URL: url({
    desc: "The URL to the frontend application",
  }),
  CRON_GITHUB_RETRY_FAILED_WEBHOOKS_EVERY_MINUTES: num({
    desc: "Run the cron for failed webhooks every X minutes",
    default: 30,
  }),
  GITHUB_CLIENT_SECRET: str({
    desc: "The client secret for Github's OAuth",
  }),
  GITHUB_CLIENT_ID: str({
    desc: "The client id for Github's OAuth",
  }),
  GITHUB_APP_HANDLE: str({
    desc: "The GitHub app name",
  }),
  GITHUB_OAUTH_REDIRECT_PATH: str({
    desc: "The path on the frontend app the user will be redirected to",
    default: `/github/callback`,
  }),
  GITHUB_WEBHOOK_SECRET: str({
    desc: "The secret string used to sign GitHub webhooks",
    allowEmpty: true,
    devDefault: "",
  }),
  GITHUB_APP_ID: str({
    desc: "The application id",
  }),
  GITHUB_APP_PRIVATE_KEY: str({
    desc: "The application private key",
  }),
  JWT_SECRET: str({
    desc: "The secret string used to sign JWT tokens",
  }),
  SENTRY_DSN: str({
    desc: "The DSN to connect to our project in Sentry",
  }),
  LOG_DRAIN: str({
    desc: "The secret string used to sign GitHub webhooks",
    choices: ["logtail", "console"],
    default: "logtail",
    devDefault: "console",
  }),
  LOGTAIL_TOKEN: str({
    desc: "The source token to forward logs to LogTail",
  }),
  USE_SSL: bool({
    desc: "Whether the server should use HTTPS",
    default: false,
  }),
  REDIS_CONNECTION_STRING: str({
    desc: "The connection string to the Redis server. Used for BullMQ.",
  }),
  BULLBOARD_PATH: str({
    desc: "The API path to open BullBoard",
    devDefault: "/bullboard",
    default: "",
  }),
  BULLBOARD_USERNAME: str({
    desc: "The username to login to BullBoard.",
  }),
  BULLBOARD_PASSWORD: str({
    desc: "The password to login to BullBoard.",
  }),
});

export const isDev = env.APP_ENV === "development";
export const isStaging = env.APP_ENV === "staging";
export const isProduction = env.APP_ENV === "production";
export const isLive = isStaging || isProduction;

export const apiUrl = (() => {
  if (isDev) return `https://api.sweetr.local:${env.PORT}/`;
  if (isStaging) return `https://api.staging.sweetr.dev`;

  return `https://api.sweetr.dev`;
})();
