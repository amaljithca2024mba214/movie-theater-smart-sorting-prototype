# movie-theater-smart-sorting-prototype
Low-fidelity product prototype for Smart Sorting &amp; Filtering feature in movie ticketing apps - theater 

discovery near user location

## Problem Definition

### User problem

- Users struggle to quickly spot the most **convenient** theaters nearby that balance distance, time, and comfort (parking, accessibility).
- Price-sensitive users cannot easily compare nearby theaters on effective ticket price for the same show or time band.
- Users waste time scanning long, unsorted theater lists with mixed availability, only to discover sold-out or poor-seat shows late in the flow.
- Accessibility and amenity needs (wheelchair, parking) are often buried, forcing trial-and-error on each theater card.

### Business opportunity

- Faster, easier discovery reduces drop-offs in the theater-list step and increases completed bookings.
- Smart sorting of price, availability, and amenities helps route demand to underutilized shows and optimizes occupancy across theaters.
- Better "near me" relevance improves user satisfaction and repeat usage, strengthening loyalty in competitive ticketing markets.

---

## User Flow

- User opens the mobile app (iOS/Android) and lands on a home screen with entry points: "Now Showing", search bar, and a prominent "Movies Near Me" strip.
- User either taps a movie from "Now Showing" or searches by name; app navigates to that movie's detail page with dates and "Choose showtime" CTA.
- On showtime selection, user picks date and city (if not auto-detected), then sees a "Near Me" toggle or chip that uses current or chosen location.
- Once "Near Me" is active, the theater list loads with default sort "Nearest & Best Match" and a sticky bar containing: "Sort", "Filter", and the active location pill.
- Tapping **Sort** opens a bottom sheet with simple options (Nearest, Lowest price nearby, Best availability) using one-tap radio buttons.
- Tapping **Filter** opens a checklist-style sheet with near-term choices (Radius, Theater chain, Wheelchair, Parking, Show time bands), with a clear "Apply" CTA.
- Theater list updates in-place, showing cards with distance, basic price band, key amenities, and a compact showtime row; users tap a showtime to proceed.
- User lands on seat map, selects seats, and continues to payment and confirmation as in the existing booking flow.
- For first-time users, microcopy below Sort/Filter clarifies: "Adjust distance, price and amenities to find the best nearby theater", avoiding long tutorials.

---

## Sort vs Filter Logic

- **Sort**: Changes the **order** of the currently visible theaters (e.g., by distance, price, or availability) without adding or removing theaters from the result set.
- **Filter**: **Includes or excludes** theaters based on chosen conditions (e.g., only PVR, only wheelchair accessible), reducing the result set to a narrower subset.

Conceptually:

- Sort answers: "Show me **which of these** is best to see first?"
- Filter answers: "Only show me theaters that **match these constraints** at all."

---

## Sorting & Filtering Options

### Table of options

| Label (UI)                           | Type              | What it does (short)                                                                 |
|--------------------------------------|-------------------|--------------------------------------------------------------------------------------|
| PVR & top chains nearby              | Filter            | Shows only PVR and selected premium chains within the current radius.               |
| Cheapest nearby first                | Sort              | Orders all visible theaters by lowest available ticket price in ascending order.    |
| Premium price nearby first           | Sort              | Orders visible theaters by highest available ticket price in descending order.      |
| Wheelchair friendly only             | Filter            | Shows only theaters that have wheelchair-accessible screens in the chosen radius.   |
| Parking available only               | Filter            | Shows only theaters with on-site or partnered parking options.                      |
| Best seats left first                | Sort              | Orders theaters by higher remaining seat availability for the selected showtime.    |
| Accessible & nearest                 | Both              | Filters to wheelchair-friendly theaters, then sorts them by distance.               |
| Easy parking & nearest               | Both              | Filters to theaters with parking and sorts them by distance.                        |
| Nearest PVR first                    | Both              | Filters to PVR (and optionally chain group), then sorts by distance from user.      |

Each combination keeps the interaction simple: user picks a **filter** to set hard constraints, then a primary **sort** to decide the order of what remains.

---

## Near Me Logic & UI

### How "near me" is calculated

- Primary signal: device GPS with standard OS permission flow; fallback to network/IP location or manually chosen area when GPS is weak.
- Location is treated as a point on the map; theaters are geocoded and distance is calculated as straight-line or basic road distance depending on available APIs.

### Radius logic

- Default radius: 0–5 km for dense urban areas, expandable via Filter to 5–10 km and 10–20 km bands for more options.
- For low-density areas or when few results exist, the app can auto-suggest expanding radius to the next band with a single tap.

### How distance is surfaced in UI

- Each theater card shows distance below the name, e.g., "2.3 km away", alongside small icons for wheelchair and parking where applicable.
- Sort sheet uses distance in labels, such as "Nearest first" or "Nearest PVR first", and the location pill may show "Using: Current location".
- A simple **location pin** icon near the "Near Me" toggle communicates geo-based results; walking/driving icons can appear in tooltips or secondary text if travel mode is added later.

---

## Edge Cases

### No nearby PVRs within radius

- User sees an empty state message: "No PVR theaters within 5 km."
- CTA: "Show all theaters in 5 km" and secondary: "Expand radius to 10 km for PVRs".

### All nearby shows are sold out for chosen movie/time

- List shows theaters but with showtime chips marked "Sold out" and a highlighted info bar: "All nearby shows are full at this time."
- CTA: "See later showtimes today" and "Change date".

### Only one or two theaters satisfy wheelchair / parking filters

- User still sees the minimal list, with a supportive note above: "Showing 2 theaters that match your accessibility filters."
- CTA: "See more theaters without these filters" to quickly broaden options.

### Location permissions denied

- Theater list falls back to city-level results sorted by relevance or popularity, without "Near Me" personalization.
- Inline prompt: "Turn on location to see theaters near you" with CTAs "Enable in Settings" and "Use a different location".

### GPS error or low accuracy

- Brief toast or banner: "Having trouble detecting your exact location. Showing theaters for [city name]."
- Option in location pill: "Set location manually" to drop a pin or select neighborhood.

---

## Success Metrics

### Time from movie selection → seat selection

- Measures how efficiently users move through discovery when using Smart Sorting & Filtering; lower time indicates reduced friction.

### % of sessions that use Sort/Filter at least once on theater list

- Validates whether the feature is discoverable and perceived as useful, not just shipped but ignored.

### Conversion rate for "Near Me" flows vs non-location flows

- Shows if location-aware discovery actually increases completed bookings relative to generic lists.

### Drop-off rate on theater list screen

- Helps confirm that better ordering and filtering of theaters reduces abandonment at the browsing stage.

---

## Assumptions

- Theater data already includes structured fields: chain (e.g., PVR), geo-coordinates, base ticket price, real-time seat availability, wheelchair and parking attributes.
- App already has a basic and compliant location permission flow and can access GPS and network-based location.
- User is typically in a metro or tier-1/tier-2 city where >5 theaters exist within 10–15 km.
- Existing booking stack (seat map, payment, ticket storage) is already implemented; this feature only refines theater discovery.

---

## Prototype Summary

This low-fidelity concept introduces a focused **Smart Sorting & Filtering** bar on the theater list in "Near Me" mode, keeping the rest of the booking flow intact. Users can quickly constrain the list by chain, radius, accessibility, and parking, then apply a simple sort like "Nearest" or "Cheapest nearby" to decide where to go first. Distance and key amenities are visible on each theater card, reducing guesswork and repeated taps into details. Edge cases are handled with clear messages and one-tap CTAs to expand radius or relax filters, allowing product teams to test this feature with minimal UI changes and measurable impact on conversion and drop-offs.
