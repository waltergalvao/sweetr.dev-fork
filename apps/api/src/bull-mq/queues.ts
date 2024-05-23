import { BulkJobOptions, JobsOptions, Queue } from "bullmq";
import { redisConnection } from "./redis-connection";
import { logger } from "../lib/logger";

export enum SweetQueue {
  // Crons - https://docs.bullmq.io/guide/jobs/repeatable
  CRON_GITHUB_RETRY_FAILED_WEBHOOKS = "{cron.github.retry_failed_webhooks}",

  // GitHub
  GITHUB_INSTALLATION_SYNC = "{github.installation.sync}",
  GITHUB_MEMBERS_SYNC = "{github.members.sync}",
  GITHUB_REPOSITORIES_SYNC = "{github.repositories.sync}",
  GITHUB_OAUTH_REVOKED = "{github.oauth.revoked}",
  GITHUB_INSTALLATION_DELETED = "{github.installation.deleted}",
  GITHUB_SYNC_PULL_REQUEST = "{github.sync.pull_request}",
  GITHUB_SYNC_CODE_REVIEW = "{github.sync.code_review}",
  GITHUB_SYNC_REPOSITORY_PULL_REQUESTS = "{github.sync.repository.pull_requests}",

  // Automations
  SWEET_DEPENDENCY_CHANGES = "{sweet.dependencies}",
}

export enum JobPriority {
  LOW = 50,
  NORMAL = 25,
  HIGH = 1,
}

// Initialize Queues
export const queues: Record<SweetQueue, Queue> = (() => {
  const queues = {};

  for (const queueName of Object.values(SweetQueue)) {
    queues[queueName] = new Queue(queueName, {
      connection: redisConnection,
    });

    logger.info(`🐂🧵 BullMQ: Queue ${queueName} initialized.`);
  }

  return queues as Record<SweetQueue, Queue>;
})();

export const addJob = async <T>(
  queueName: SweetQueue,
  data: T,
  options?: JobsOptions
) => {
  logger.info(`🐂✉️ BullMQ: Adding job to ${queueName}`);

  const queue = queues[queueName];

  return queue.add(`${queue.name}-job`, data, options);
};

export const addJobs = async <T>(
  queueName: SweetQueue,
  data: T[],
  options?: BulkJobOptions
) => {
  logger.info(`🐂✉️ BullMQ: Adding ${data.length} job to ${queueName}`);

  const queue = queues[queueName];

  return queue.addBulk(
    data.map((d) => ({ name: `${queue.name}-job`, data: d, opts: options }))
  );
};
