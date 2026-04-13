module.exports = async function (req, res) {
  const { num } = req.query;

  if (!num) {
    return res.status(400).json({ error: "Missing tracking number" });
  }

  const auth = Buffer.from(
    `${process.env.SE_API_KEY}:${process.env.SE_API_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch(
      `https://api.shippingeasy.com/v1/trackings?tracking_number=${num}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    // adjust depending on response shape
    const tracking = data.trackings?.[0];

    return res.status(200).json({
      status: tracking?.status || "Unknown",
      eta: tracking?.estimated_delivery_at || null,
      carrier: tracking?.carrier_code || "Unknown"
    });

  } catch (error) {
    return res.status(500).json({ error: "Tracking lookup failed" });
  }
};
