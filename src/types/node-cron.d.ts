declare module "node-cron" {
    import { EventEmitter } from "events";
  
    interface ScheduledTask extends EventEmitter {
      start(): void;
      stop(): void;
      destroy(): void;
    }
  
    interface Cron {
      schedule(cronExpression: string, func: () => void): ScheduledTask;
    }
  
    const cron: Cron;
    export default cron;
  }
  