document.addEventListener("DOMContentLoaded", function () {
  const addressInput = document.getElementById("address");
  const suggestionsList = document.getElementById("address-suggestions");
  const container = document.querySelector(".autocomplete-container");
  let debounceTimer; // Timer für Debounce

  if (!addressInput || !suggestionsList || !container) {
    console.error("Fehler: Ein benötigtes Element wurde nicht gefunden!");
    return;
  }

  // Eventlistener für das Eingabefeld
  addressInput.addEventListener("input", function () {
    clearTimeout(debounceTimer); // Falls der Benutzer weiter tippt, Timer zurücksetzen

    const query = addressInput.value.trim();
    if (query.length < 3) {
      suggestionsList.innerHTML = "";
      suggestionsList.style.display = "none";
      container.classList.remove("active");
      addressInput.classList.remove("open");
      return;
    }

    // 🚀 Debounce: API wird nur nach 300ms Inaktivität aufgerufen
    debounceTimer = setTimeout(() => {
      fetchAddressSuggestions(query);
    }, 300);
  });

  // Funktion für API-Anfrage
  async function fetchAddressSuggestions(query) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}, Deutschland&countrycodes=de&addressdetails=1&extratags=1`
      );

      const data = await response.json();

      suggestionsList.innerHTML = "";
      const uniqueAddresses = new Set();

      data.slice(0, 10).forEach((place) => {
        if (place.address && place.address.road && place.address.postcode && place.address.city) {
          let street = place.address.road || "";
          let houseNumber = place.address.house_number || "";
          let postcode = place.address.postcode || "";
          let city = place.address.city || place.address.town || place.address.village || "";

          street = street.replace(/str\.$/i, "Straße").replace(/pl\.$/i, "Platz");

          if (!houseNumber && query.match(/\d+$/)) {
            houseNumber = query.match(/\d+$/)[0];
          }

          const formattedAddress = `${street} ${houseNumber}, ${postcode} ${city}`;

          if (!uniqueAddresses.has(formattedAddress)) {
            uniqueAddresses.add(formattedAddress);

            const listItem = document.createElement("li");
            listItem.textContent = formattedAddress;
            listItem.addEventListener("click", () => {
              addressInput.value = formattedAddress;
              suggestionsList.innerHTML = "";
              suggestionsList.style.display = "none";
              container.classList.remove("active");
              addressInput.classList.remove("open");
            });
            suggestionsList.appendChild(listItem);
          }
        }
      });

      if (suggestionsList.children.length > 0) {
        suggestionsList.style.display = "block";
        container.classList.add("active");
        addressInput.classList.add("open");
      } else {
        suggestionsList.style.display = "none";
        container.classList.remove("active");
        addressInput.classList.remove("open");
      }
    } catch (error) {
      console.error("Fehler bei der Adresssuche:", error);
    }
  }

  // Klick außerhalb des Input-Feldes schließt das Dropdown
  document.addEventListener("click", function (event) {
    if (!addressInput.contains(event.target) && !suggestionsList.contains(event.target)) {
      suggestionsList.style.display = "none";
      container.classList.remove("active");
      addressInput.classList.remove("open");
    }
  });
});

/* Checkbox */
document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("agree-checkbox");

  checkbox.addEventListener("change", function (event) {
    const isChecked = event.target.checked;

    if (isChecked) {
      console.log("Datenschutzbestimmungen wurden akzeptiert.");
      // Du kannst hier auch eine andere Aktion durchführen,
      // z.B. das Absenden eines Formulars oder Speichern des Zustands in einem Cookie.
    } else {
      console.log("Datenschutzbestimmungen wurden nicht akzeptiert.");
    }
  });
});
