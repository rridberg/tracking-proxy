export default async function handler(req, res) {
  const { num } = req.query;

  if (!num) {
    return res.status(400).json({ error: "Missing tracking number" });
  }

  try {
    const response = await fetch(`https://api.goshippo.com/tracks/`, {
      method: "POST",
      headers: {
        "Authorization": "Authorization": `ShippoToken ${process.env.SHIPPO_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tracking_number: num,
        carrier: "usps"
      })
    });

    const data = await response.json();

    return res.status(200).json({
      status: data.tracking_status?.status || "Unknown",
      eta: data.eta || null,
      carrier: data.carrier || "Unknown"
    });

  } catch (error) {
    return res.status(500).json({ error: "Tracking lookup failed" });
  }
}
