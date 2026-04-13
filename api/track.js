module.exports = async function (req, res) {
  const { num } = req.query;

  if (!num) {
    return res.status(400).json({ error: "Missing tracking number" });
  }

  // 🔍 Basic carrier detection
  let carrier = null;

  if (num.startsWith("1Z")) {
    carrier = "ups";
  } else if (/^\d{20,22}$/.test(num)) {
    carrier = "usps";
  } else {
    carrier = "usps"; // fallback
  }

  try {
    const response = await fetch(
      `https://api.goshippo.com/tracks/${carrier}/${num}`,
      {
        method: "GET",
        headers: {
          "Authorization": `ShippoToken ${process.env.SHIPPO_API_KEY}`
        }
      }
    );

    const data = await response.json();

    return res.status(200).json({
      status: data.tracking_status?.status || "Unknown",
      eta: data.eta || null,
      carrier: carrier
    });

  } catch (error) {
    return res.status(500).json({ error: "Tracking lookup failed" });
  }
};
