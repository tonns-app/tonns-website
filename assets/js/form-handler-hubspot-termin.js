document.addEventListener("DOMContentLoaded", function () {
  const addressInput = document.getElementById("address");
  const suggestionsList = document.getElementById("address-suggestions");
  const container = document.querySelector(".autocomplete-container");
  const form = document.getElementById("hubspotForm");
  const checkbox = document.getElementById("agree-checkbox");
  const panel = document.getElementById("action-dates-container");
  const successBox = document.getElementById("action-check-success");
  const errorBox = document.getElementById("action-check-error");
  const resetButton = document.getElementById("action-check-reset");
  const submitButton = form?.querySelector('button[type="submit"]');
  const submitLabel = submitButton?.textContent?.trim() || "Termine prüfen";

  if (!addressInput || !suggestionsList || !container || !form || !checkbox || !panel || !successBox || !errorBox) {
    console.error("❌ Fehler: Ein benötigtes Element wurde nicht gefunden!");
    return;
  }

  const MIN_CHARS = 3;
  const DEBOUNCE_MS = 250;
  const INCLUDED_REGION_CODES = ["de"];

  let placesLib = null;
  let sessionToken = null;
  let requestId = 0;
  let debounceTimer = null;
  let selectedPlace = null;
  let placesInitPromise = null;
  let dropdownOpen = false;

  document.body.appendChild(suggestionsList);

  function getComponent(components, type) {
    const match = components.find((item) => item.types?.includes(type));
    return (match?.longText ?? match?.shortText ?? "").trim();
  }

  function getLatLng(location) {
    if (!location) return null;
    const lat = typeof location.lat === "function" ? location.lat() : location.lat;
    const lng = typeof location.lng === "function" ? location.lng() : location.lng;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return { lat, lng };
  }

  function placeToAddress(addressComponents, location) {
    const latLng = getLatLng(location);
    if (!latLng || !Array.isArray(addressComponents)) return null;

    let street = getComponent(addressComponents, "route");
    let streetNumber =
      getComponent(addressComponents, "street_number") ||
      getComponent(addressComponents, "subpremise") ||
      getComponent(addressComponents, "premise");

    if (!streetNumber.trim() && street.trim()) {
      const trailingNumber = street.match(/\s+(\d+\s*[a-zA-Z]?)\s*$/);
      if (trailingNumber) {
        streetNumber = trailingNumber[1].trim();
        street = street.slice(0, trailingNumber.index).trim();
      }
    }

    const zipcode = getComponent(addressComponents, "postal_code");
    const city =
      getComponent(addressComponents, "locality") ||
      getComponent(addressComponents, "administrative_area_level_2") ||
      getComponent(addressComponents, "sublocality_level_1") ||
      getComponent(addressComponents, "postal_town");
    const country = getComponent(addressComponents, "country");

    return {
      street,
      streetNumber,
      zipcode,
      city,
      country: country || "Deutschland",
    };
  }

  function formatAddressFromPlace(addr) {
    const line1 = [addr.street, addr.streetNumber].filter(Boolean).join(" ").trim();
    const line2 = [addr.zipcode, addr.city].filter(Boolean).join(" ").trim();
    if (line1 && line2) return `${line1}, ${line2}`;
    return line1 || line2 || "";
  }

  function suggestionText(placePrediction) {
    const text = placePrediction?.text;
    if (typeof text === "string") return text;
    if (text && typeof text === "object" && typeof text.text === "string") return text.text;
    if (text && typeof text.toString === "function") {
      const value = text.toString();
      return value === "[object Object]" ? "" : value;
    }
    return "";
  }

  function positionDropdown() {
    const rect = addressInput.getBoundingClientRect();
    suggestionsList.style.top = `${Math.round(rect.bottom + 4)}px`;
    suggestionsList.style.left = `${Math.round(rect.left)}px`;
    suggestionsList.style.width = `${Math.round(rect.width)}px`;
  }

  function hideSuggestions() {
    dropdownOpen = false;
    suggestionsList.innerHTML = "";
    suggestionsList.style.display = "none";
    container.classList.remove("active");
    addressInput.setAttribute("aria-expanded", "false");
  }

  function refreshSessionToken() {
    if (!placesLib?.AutocompleteSessionToken) return;
    sessionToken = new placesLib.AutocompleteSessionToken();
  }

  function loadPlaces() {
    if (!placesInitPromise) {
      placesInitPromise = (async () => {
        if (typeof window.google?.maps?.importLibrary !== "function") {
          throw new Error("Google Maps importLibrary fehlt");
        }
        const lib = await window.google.maps.importLibrary("places");
        if (!lib?.AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
          throw new Error("Places Autocomplete (New) ist nicht verfügbar");
        }
        placesLib = lib;
        refreshSessionToken();
        return lib;
      })().catch((error) => {
        placesInitPromise = null;
        throw error;
      });
    }
    return placesInitPromise;
  }

  async function fetchSuggestions(value) {
    const trimmed = value.trim();
    if (trimmed.length < MIN_CHARS) {
      hideSuggestions();
      return;
    }

    const reqId = ++requestId;

    try {
      await loadPlaces();
      if (reqId !== requestId) return;

      const result = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: trimmed,
        sessionToken,
        includedRegionCodes: INCLUDED_REGION_CODES,
      });

      if (reqId !== requestId) return;

      const rawList = Array.isArray(result?.suggestions)
        ? result.suggestions
        : Array.isArray(result)
          ? result
          : [];

      const items = rawList
        .map((suggestion) => suggestion?.placePrediction || suggestion)
        .filter((prediction) => prediction && typeof prediction.toPlace === "function")
        .map((prediction) => ({
          text: suggestionText(prediction),
          placePrediction: prediction,
        }))
        .filter((item) => item.text.length > 0);

      if (rawList.length > 0 && items.length === 0) {
        console.warn(
          "AddressAutocomplete: API lieferte",
          rawList.length,
          "Vorschläge, Parsing ergab 0. Erstes Element:",
          rawList[0]
        );
      }

      renderSuggestions(items);
    } catch (error) {
      console.error("AddressAutocomplete: fetchAutocompleteSuggestions error", error);
      if (reqId === requestId) hideSuggestions();
    }
  }

  function renderSuggestions(items) {
    suggestionsList.innerHTML = "";

    if (!items.length) {
      hideSuggestions();
      return;
    }

    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("role", "option");

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.text;
      button.addEventListener("mousedown", function (event) {
        event.preventDefault();
        handleSelectSuggestion(item.placePrediction);
      });

      listItem.appendChild(button);
      suggestionsList.appendChild(listItem);
    });

    positionDropdown();
    suggestionsList.style.display = "block";
    dropdownOpen = true;
    container.classList.add("active");
    addressInput.setAttribute("aria-expanded", "true");
  }

  async function handleSelectSuggestion(placePrediction) {
    try {
      const place = placePrediction.toPlace();
      await place.fetchFields({
        fields: ["addressComponents", "location"],
      });

      const addr = placeToAddress(place.addressComponents ?? [], place.location);
      if (!addr) return;

      selectedPlace = addr;
      addressInput.value = formatAddressFromPlace(addr);
      hideSuggestions();
      refreshSessionToken();
    } catch (error) {
      console.error("AddressAutocomplete: Place details failed", error);
    }
  }

  function scheduleFetch() {
    selectedPlace = null;
    hideError();
    clearTimeout(debounceTimer);

    if (addressInput.value.trim().length < MIN_CHARS) {
      hideSuggestions();
      return;
    }

    debounceTimer = setTimeout(() => {
      fetchSuggestions(addressInput.value);
    }, DEBOUNCE_MS);
  }

  addressInput.addEventListener("input", scheduleFetch);
  addressInput.addEventListener("focus", function () {
    if (addressInput.value.trim().length >= MIN_CHARS && !selectedPlace) {
      fetchSuggestions(addressInput.value);
    }
  });

  addressInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    if (event.key === "Escape") {
      hideSuggestions();
    }
  });

  document.addEventListener("mousedown", function (event) {
    if (!container.contains(event.target) && !suggestionsList.contains(event.target)) {
      hideSuggestions();
    }
  });

  window.addEventListener("resize", function () {
    if (dropdownOpen) positionDropdown();
  });
  window.addEventListener(
    "scroll",
    function () {
      if (dropdownOpen) positionDropdown();
    },
    true
  );

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function hideError() {
    errorBox.hidden = true;
    errorBox.textContent = "";
  }

  function showSuccess() {
    hideError();
    hideSuggestions();
    panel.classList.add("is-success");
    form.hidden = true;
    successBox.hidden = false;
    successBox.focus();
  }

  function restoreForm() {
    panel.classList.remove("is-success");
    successBox.hidden = true;
    form.hidden = false;
    hideError();
    form.reset();
    selectedPlace = null;
    hideSuggestions();
    addressInput.focus();
  }

  resetButton?.addEventListener("click", restoreForm);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideError();

    if (!checkbox.checked) {
      showError("Bitte akzeptiere die Datenschutzbestimmungen.");
      return;
    }

    const email = document.getElementById("email").value;
    if (!email) {
      showError("Bitte eine gültige E-Mail und Adresse eingeben.");
      return;
    }

    if (
      !selectedPlace ||
      !selectedPlace.street ||
      !selectedPlace.streetNumber ||
      !selectedPlace.zipcode ||
      !selectedPlace.city
    ) {
      showError("Bitte eine Adresse mit Hausnummer aus den Vorschlägen auswählen.");
      return;
    }

    const street = selectedPlace.street;
    const houseNumber = selectedPlace.streetNumber;
    const zip = selectedPlace.zipcode;
    const city = selectedPlace.city;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Wird gesendet…";
    }

    try {
      const response = await fetch("https://api.tonns.app/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, street, houseNumber, zip, city }),
      });

      const data = await response.json();
      if (response.ok) {
        form.reset();
        selectedPlace = null;
        showSuccess();
      } else {
        console.error("❌ Fehler beim Senden:", data);
        showError("Die Anfrage konnte nicht gesendet werden. Bitte später erneut versuchen.");
      }
    } catch (error) {
      console.error("❌ Fehler:", error);
      showError("Ein Fehler ist aufgetreten. Bitte später erneut versuchen.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    }
  });

  loadPlaces().catch((error) => {
    console.error("AddressAutocomplete: Places API (New) failed", error);
  });
});
