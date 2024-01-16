const redis = require('redis')
const redisClient = redis.createClient();

redisClient.connect();
redisClient.on('ready', () => {
  console.log("Connected to Redis");
});

// redisClient.set("totalCollected",totalAmount)

redisClient.on('error', (err) => {
  console.error(err);
});

module.exports= redisClient;