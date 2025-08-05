const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

exports.getUserBalance = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Your function logic
      res.status(200).json({ balance: 100 });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

exports.createPaymentIntent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Your payment intent logic
      res.status(200).json({ clientSecret: "test_secret" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});