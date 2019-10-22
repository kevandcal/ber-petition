var redis = require("redis");
var client = redis.createClient({
    host: "localhost",
    port: 6379
});
const { promisify } = require("util");

client.on("error", function(err) {
    console.log(err);
});

// Old-school way with callback function ("name" is key, "kevin" is value):
// client.set('name', 'kevin', (err, data) => {
//
// });

// New way with promises (requires util promisify as on line 6); i.e. we can use .then and .catch:
exports.get = promisify(client.get).bind(client);
exports.setex = promisify(client.setex).bind(client);
exports.del = promisify(client.del).bind(client);
