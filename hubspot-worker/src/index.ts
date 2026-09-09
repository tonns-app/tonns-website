// hubspot-worker/src/index.ts

interface Env {
  HUBSPOT_API_KEY: string;
}

const HUBSPOT_TICKETS_ENDPOINT = "https://api.hubapi.com/crm/v3/objects/tickets";

const ALLOWED_ORIGINS = ["http://127.0.0.1:4000", "http://localhost:4000", "https://tonns.app", "https://www.tonns.app"];

function buildCors(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
    "Content-Type": "application/json",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = buildCors(origin);

    // --- Health check: zeigt nur, ob das Secret da ist (ohne es zu leaken)
    if (request.method === "GET" && url.pathname === "/health") {
      const token = env?.HUBSPOT_API_KEY ?? "";
      const masked = token ? `${token.slice(0, 8)}... (len=${token.length})` : "";
      return new Response(JSON.stringify({ hasKey: !!token, keyPreview: masked }), {
        status: 200,
        headers: cors,
      });
    }

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Nur POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Nur POST-Anfragen erlaubt" }), {
        status: 405,
        headers: cors,
      });
    }

    // Secret vorhanden?
    if (!env?.HUBSPOT_API_KEY || env.HUBSPOT_API_KEY.trim() === "") {
      return new Response(JSON.stringify({ error: "Server-Misskonfiguration: HUBSPOT_API_KEY fehlt" }), {
        status: 500,
        headers: cors,
      });
    }

    // Body lesen
    let payload: any = {};
    try {
      payload = await request.json();
    } catch {
      /* ignore */
    }

    const { email, street, houseNumber, zip, city } = payload ?? {};

    // Basic-Validierung
    if (!email || !street || !houseNumber || !zip || !city) {
      return new Response(JSON.stringify({ error: "E-Mail oder Adressdaten fehlen" }), {
        status: 400,
        headers: cors,
      });
    }

    const ticketData = {
      properties: {
        hs_pipeline: "0",
        hs_pipeline_stage: "1",
        subject: "Neue Anfrage für Abfuhrtermine",
        content:
          `E-Mail: ${email}\n\n` +
          "Anfrage für den Mülltonnendienst.",
        address_ticket: `${street} ${houseNumber}`,
        zip_ticket: String(zip),
        city_ticket: city,
        ticketart: "Anfrage",
      },
    };

    // HubSpot API-Call
    const hubspotRes = await fetch(HUBSPOT_TICKETS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    const data = await hubspotRes.json().catch(() => ({}));

    if (!hubspotRes.ok) {
      return new Response(JSON.stringify({ error: "Fehler beim Erstellen des Tickets", details: data }), {
        status: 502,
        headers: cors,
      });
    }

    return new Response(JSON.stringify({ message: "Ticket erfolgreich erstellt!", data }), {
      status: 200,
      headers: cors,
    });
  },
};
