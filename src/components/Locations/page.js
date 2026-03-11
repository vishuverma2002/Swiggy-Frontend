"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./location.module.css";
import { IoLocationOutline, IoNavigate } from "react-icons/io5";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

const Locations = ({ onLocationSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const suggestionsRef = useRef(null);

  const searchLocations = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "FoodieHub/1.0",
          },
        }
      );
      const data = await response.json();
      const locations = data.map((item) => ({
        displayName: item.display_name,
        name: item.address?.city || item.address?.town || item.address?.village || item.address?.state || item.display_name?.split(",")[0],
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: item.address,
      }));
      setSuggestions(locations);
    } catch (err) {
      setError("Location search failed. Please try again.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchLocations(searchQuery);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, searchLocations]);

  const handleSelectLocation = (location) => {
    const locationData = {
      name: location.name,
      displayName: location.displayName,
      lat: location.lat,
      lon: location.lon,
    };
    onLocationSelect?.(locationData);
    setSearchQuery(location.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onClose?.();
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsGettingLocation(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `${NOMINATIM_BASE_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
                "User-Agent": "FoodieHub/1.0",
              },
            }
          );
          const data = await response.json();
          const location = {
            displayName: data.display_name,
            name: data.address?.city || data.address?.town || data.address?.village || data.address?.state || data.display_name?.split(",")[0],
            lat: parseFloat(data.lat),
            lon: parseFloat(data.lon),
            address: data.address,
          };
          handleSelectLocation(location);
        } catch (err) {
          setError("Could not get address. Please try searching manually.");
        } finally {
          setIsGettingLocation(false);
        }
      },
      (err) => {
        setIsGettingLocation(false);
        if (err.code === 1) {
          setError("Location permission denied. Please allow access or search manually.");
        } else {
          setError("Could not get your location. Please try searching manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.locationSearch} ref={suggestionsRef}>
      <div className={styles.searchSection}>
        <label className={styles.searchLabel}>Search your location</label>
        <div className={styles.inputWrapper}>
          <IoLocationOutline className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Area, street name, landmark..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className={styles.input}
            autoComplete="off"
          />
          {isLoading && <span className={styles.loadingIndicator}>Searching...</span>}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.lat}-${suggestion.lon}-${index}`}
              className={styles.suggestionItem}
              onClick={() => handleSelectLocation(suggestion)}
            >
              <IoLocationOutline className={styles.suggestionIcon} />
              <span className={styles.suggestionText}>{suggestion.displayName}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <div className={styles.gpsSection}>
        <div
          className={`${styles.gpsCard} ${isGettingLocation ? styles.gpsCardDisabled : ""}`}
          onClick={isGettingLocation ? undefined : getCurrentLocation}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => !isGettingLocation && (e.key === "Enter" || e.key === " ") && getCurrentLocation()}
        >
          <div className={`${styles.gpsIconWrap} ${isGettingLocation ? styles.gpsLoading : ""}`}>
            <IoNavigate className={styles.gpsIcon} />
          </div>
          <div className={styles.gpsContent}>
            <span className={styles.gpsTitle}>
              {isGettingLocation ? "Detecting your location..." : "Use current location"}
            </span>
            <span className={styles.gpsSubtitle}>
              {isGettingLocation ? "Please wait" : "Allow GPS access for accurate results"}
            </span>
          </div>
          {!isGettingLocation && (
            <span className={styles.gpsArrow}>→</span>
          )}
        </div>
      </div>

      {error && <div className={styles.errorBox}><p className={styles.error}>{error}</p></div>}
    </div>
  );
};

export default Locations;
