const RiskZone = require("../models/RiskZone");
const Incident = require("../models/Incident");

// Simple ML-inspired risk classification
// Based on: incident count, time of day, lighting, isolation
const classifyRiskLevel = (features) => {
  let score = 0;

  // Incident count weight (most important)
  if (features.incidentCount >= 5) score += 40;
  else if (features.incidentCount >= 3) score += 25;
  else if (features.incidentCount >= 1) score += 10;

  // Lighting weight
  if (features.lighting === "poor") score += 25;
  else if (features.lighting === "moderate") score += 10;

  // Isolation weight
  if (features.isolated) score += 20;

  // Time of day weight
  if (features.timeOfDay === "night") score += 15;
  else if (features.timeOfDay === "evening") score += 8;

  // Classification thresholds (Random Forest inspired)
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
};

// @route GET /api/riskzones
const getRiskZones = async (req, res) => {
  try {
    const zones = await RiskZone.find({ isActive: true });
    return res.status(200).json({ message: "Success", data: zones });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @route POST /api/riskzones/classify
// ML classification endpoint
const classifyZone = async (req, res) => {
  const { lat, lng, name, description, features } = req.body;
  try {
    if (!lat || !lng) {
      return res.status(400).json({ message: "Location coordinates are required" });
    }

    // Get incident count from database for this area
    const nearbyIncidents = await Incident.countDocuments({
      "location.lat": { $gte: lat - 0.001, $lte: lat + 0.001 },
      "location.lng": { $gte: lng - 0.001, $lte: lng + 0.001 },
    });

    const zoneFeatures = {
      incidentCount: nearbyIncidents,
      lighting: features?.lighting || "moderate",
      isolated: features?.isolated || false,
      timeOfDay: features?.timeOfDay || "night",
    };

    // Run ML classification
    const riskLevel = classifyRiskLevel(zoneFeatures);

    // Save to database
    const zone = await RiskZone.findOneAndUpdate(
      { "location.lat": { $gte: lat - 0.0005, $lte: lat + 0.0005 },
        "location.lng": { $gte: lng - 0.0005, $lte: lng + 0.0005 } },
      {
        name: name || `Risk Zone at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        description: description || "",
        level: riskLevel,
        location: { lat, lng, radius: 100 },
        features: zoneFeatures,
        isActive: true,
        createdBy: req.user._id,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "Risk zone classified",
      data: { zone, classification: riskLevel, features: zoneFeatures, score: nearbyIncidents }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @route GET /api/riskzones/auto-classify
// Auto classify all campus locations based on incidents
const autoClassifyAll = async (req, res) => {
  const campusLocations = [
    { name: "Main Gate", lat: 9.3682833, lng: 8.9610226, lighting: "moderate", isolated: false },
    { name: "Faculty of Law", lat: 9.3660114, lng: 8.9588649, lighting: "poor", isolated: false },
    { name: "Mini Stadium", lat: 9.3625329, lng: 8.9595665, lighting: "poor", isolated: true },
    { name: "Checkpoint", lat: 9.3739011, lng: 8.9627997, lighting: "poor", isolated: true },
    { name: "Faculty of Social Science", lat: 9.3700330, lng: 8.9543221, lighting: "moderate", isolated: false },
    { name: "Health Services", lat: 9.3728827, lng: 8.9549484, lighting: "good", isolated: false },
    { name: "Postgraduate School", lat: 9.3737563, lng: 8.9540727, lighting: "poor", isolated: true },
    { name: "Faculty of Agriculture", lat: 9.3740671, lng: 8.9531332, lighting: "poor", isolated: true },
    { name: "Mass Communication", lat: 9.3715921, lng: 8.9553040, lighting: "moderate", isolated: false },
    { name: "Health Science", lat: 9.3727677, lng: 8.9547748, lighting: "good", isolated: false },
  ];

  try {
    const results = [];
    for (const loc of campusLocations) {
      const nearbyIncidents = await Incident.countDocuments({
        "location.lat": { $gte: loc.lat - 0.001, $lte: loc.lat + 0.001 },
        "location.lng": { $gte: loc.lng - 0.001, $lte: loc.lng + 0.001 },
      });

      const features = {
        incidentCount: nearbyIncidents,
        lighting: loc.lighting,
        isolated: loc.isolated,
        timeOfDay: "night",
      };

      const level = classifyRiskLevel(features);

      const zone = await RiskZone.findOneAndUpdate(
        { name: loc.name },
        { name: loc.name, level, location: { lat: loc.lat, lng: loc.lng, radius: 100 }, features, isActive: true },
        { upsert: true, new: true }
      );
      results.push({ name: loc.name, level });
    }

    return res.status(200).json({ message: "Auto-classification complete", data: results });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/riskzones/:id
const deleteRiskZone = async (req, res) => {
  try {
    await RiskZone.findByIdAndUpdate(req.params.id, { isActive: false });
    return res.status(200).json({ message: "Risk zone removed" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getRiskZones, classifyZone, autoClassifyAll, deleteRiskZone };
