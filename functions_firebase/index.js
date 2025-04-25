const functions = require("firebase-functions/v1");
const axios = require("axios");
const cors = require("cors")({ origin: true });

/* const HUBSPOT_API_KEY = "pat-na1-dc0abcce-1a1a-49b6-bac1-14d7e6123af5"; // Meine */
const HUBSPOT_API_KEY = "pat-na1-f458c8ac-d50c-4e18-98be-ff03f8576dfe"; // tonns


const HUBSPOT_TICKETS_ENDPOINT = "https://api.hubapi.com/crm/v3/objects/tickets";

exports.createHubSpotTicket = functions.region("europe-west3").https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log("🔹 [LOG] Anfrage erhalten:", req.method, req.body);

    if (req.method !== "POST") {
      console.error("❌ Fehler: Falsche HTTP-Methode verwendet.");
      return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    try {
      const { email, street, houseNumber, zip, city } = req.body;

      if (!email || !street || !houseNumber || !zip || !city) {
        console.error("❌ Fehler: Fehlende Daten", { email, street, houseNumber, zip, city });
        return res.status(400).json({ error: "E-Mail oder Adressdaten fehlen" });
      }

      console.log("📩 [LOG] Eingehende Daten:", { email, street, houseNumber, zip, city });

      const ticketData = {
        properties: {
          hs_pipeline: "0",
          hs_pipeline_stage: "1",
          hs_ticket_category: "GENERAL_INQUIRY",
          subject: "Neue Anfrage für Abfuhrtermine",
          email_ticket: email,
          address_ticket: `${street} ${houseNumber}`,
          zip_ticket: zip,
          city_ticket: city,
        },
      };

      console.log("📤 [LOG] Sende Daten an HubSpot:", JSON.stringify(ticketData, null, 2));

      const response = await axios.post(HUBSPOT_TICKETS_ENDPOINT, ticketData, {
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ [LOG] Ticket erfolgreich erstellt:", response.data);
      res.status(200).json({ message: "Ticket erfolgreich erstellt!", data: response.data });
    } catch (error) {
      console.error("❌ Fehler beim Erstellen des Tickets:", error.response?.data || error.message);
      res.status(500).json({
        error: "Fehler beim Erstellen des Tickets",
        details: error.response?.data || error.message,
      });
    }
  });
});
