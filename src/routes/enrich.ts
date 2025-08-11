import express from "express";
import fetch from "node-fetch";

export const enrich = express.Router();

enrich.post("/", async (req, res) => {
  const { email, domain, company } = req.body ?? {};
  if (!email && !domain) {
    return res.status(400).json({ error: "email or domain required" });
  }

  try {
    const hsToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN!;
    const result = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hsToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [
            { propertyName: "email", operator: "EQ", value: email }
          ]
        }]
      })
    }).then(r => r.json());

    return res.json({ enriched: true, hubspot: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to enrich lead." });
  }
});
