import { syncUsers } from "./syncUsers";

export const startJobsEveryMidNight = () => {
  syncUsers();
};
