if (!process.env.QUARKUS_BASE_URL) {
  throw new Error("QUARKUS_BASE_URL is not defined");
}

module.exports = {
  baseUrl: process.env.QUARKUS_BASE_URL,
};
