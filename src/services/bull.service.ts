import Bull from 'bull';

export class BullService {
  static edenQueue: Bull.Queue<any>;

  static getEdenQueue() {
    if (!BullService.edenQueue) {
      BullService.edenQueue = new Bull('Eden queue');
      BullService.edenQueue.process((job) => {
        console.log(job);
      });
    }
    return BullService.edenQueue;
  }
}
