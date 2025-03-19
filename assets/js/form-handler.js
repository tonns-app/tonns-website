document.addEventListener("DOMContentLoaded", function () {
  const addressInput = document.getElementById("address");
  const suggestionsList = document.getElementById("address-suggestions");
  const container = document.querySelector(".autocomplete-container");
  const form = document.getElementById("hubspotForm");
  const checkbox = document.getElementById("agree-checkbox");

  if (!addressInput || !suggestionsList || !container || !form || !checkbox) {
    console.error("❌ Fehler: Ein benötigtes Element wurde nicht gefunden!");
    return;
  }

  // 📌 Eventlistener für Adresseingabe (mit Autocomplete)
  addressInput.addEventListener("input", function () {
    if (addressInput.value.trim().length < 3) {
      suggestionsList.innerHTML = "";
      suggestionsList.style.display = "none";
      return;
    }
    fetchAddressSuggestions(addressInput.value.trim());
  });

  // 📌 Adresseingabe mit API-Call für Vorschläge
  async function fetchAddressSuggestions(query) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}, Deutschland&countrycodes=de&addressdetails=1&extratags=1`
      );
      const data = await response.json();

      suggestionsList.innerHTML = "";
      data.slice(0, 10).forEach((place) => {
        if (place.address && place.address.road && place.address.postcode && place.address.city) {
          let street = place.address.road;
          let houseNumber = place.address.house_number || "";
          let postcode = place.address.postcode;
          let city = place.address.city || place.address.town || place.address.village;

          const formattedAddress = `${street} ${houseNumber}, ${postcode} ${city}`;
          const listItem = document.createElement("li");
          listItem.textContent = formattedAddress;
          listItem.addEventListener("click", () => {
            addressInput.value = formattedAddress;
            suggestionsList.innerHTML = "";
            suggestionsList.style.display = "none";
          });
          suggestionsList.appendChild(listItem);
        }
      });

      suggestionsList.style.display = suggestionsList.children.length > 0 ? "block" : "none";
    } catch (error) {
      console.error("❌ Fehler bei der Adresssuche:", error);
    }
  }

  // 📌 Formular absenden (Daten an Firebase schicken)
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!checkbox.checked) {
      alert("Bitte akzeptiere die Datenschutzbestimmungen.");
      return;
    }

    const address = addressInput.value;
    const email = document.getElementById("email").value;
    console.log("📩 [LOG] Daten aus Formular:", { email, address });

    if (!email || !address) {
      console.error("❌ Fehler: E-Mail oder Adresse fehlt!", { email, address });
      alert("Bitte geben Sie eine gültige E-Mail und Adresse ein!");
      return;
    }

    // 📌 Adresse aufsplitten
    const addressParts = address.match(/^(.+?)\s(\d+),\s(\d{5})\s(.+)$/);
    if (!addressParts) {
      console.error("❌ Fehler: Adresse konnte nicht aufgeteilt werden.", address);
      alert("Bitte eine gültige Adresse eingeben!");
      return;
    }

    const street = addressParts[1];
    const houseNumber = addressParts[2];
    const zip = addressParts[3];
    const city = addressParts[4];

    console.log("📌 [LOG] Aufgesplitte Adresse:", { street, houseNumber, zip, city });

    try {
      const response = await fetch("https://europe-west3-tonns-a06e3.cloudfunctions.net/createHubSpotTicket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, street, houseNumber, zip, city }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ [LOG] Ticket erfolgreich gesendet:", data);
        alert("Anfrage erfolgreich gesendet!");
        form.reset();
      } else {
        console.error("❌ Fehler beim Senden:", data);
        alert("Fehler beim Senden der Anfrage.");
      }
    } catch (error) {
      console.error("❌ Fehler:", error);
      alert("Ein Fehler ist aufgetreten. Bitte später erneut versuchen.");
    }
  });
});
