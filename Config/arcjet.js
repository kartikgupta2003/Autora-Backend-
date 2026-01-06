import Arcjet , { tokenBucket } from "@arcjet/node";

const aj = Arcjet({
  key: process.env.ARCJET_KEY,
  log: false,
  // REQUIRED
  rules: [
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Tracked by IP address by default, but this can be customized
      characteristics: ["ip.src"],
      refillRate: 10, // refill 10 tokens per interval
      interval: 3600, // per hour
      capacity: 10, // bucket maximum capacity of 10 tokens
    }),
  ],
});

export default aj;

