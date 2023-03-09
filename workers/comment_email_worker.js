import queue from "../config/kue.js";

import { newComment } from "../mailers/comments_mailer.js";

queue.process("emails", function (job, done) {
  console.log("emails worker is processing a job ", job.data);

  newComment(job.data);

  done();
});

export default queue;
