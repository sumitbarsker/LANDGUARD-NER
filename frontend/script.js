let landslideMap = null;
let selectedMarker = null;
let inventoryLayer = null;
let riskZoneLayer = null;
let incidentLayer = null;
let inventoryData = [];

const API_URL = "https://landguard-ner-umlv.onrender.com";

const MAX_INVENTORY_MARKERS = 500;
const RISK_HISTORY_KEY = "landguardRiskHistory";
const INCIDENT_REPORT_KEY = "landguardIncidentReports";
const LANGUAGE_KEY = "landguardLanguage";
const MAX_HISTORY = 50;

let latestRiskResult = null;
let lastRiskRequest = null;
let isRefreshingEnvironment = false;

const NER_BOUNDS = {
    minLat: 20,
    maxLat: 30,
    minLon: 88,
    maxLon: 98
};


/* =====================================================
   LANGUAGE
   ===================================================== */

const translations = {

    en: {

        toggle: "हिंदी",

        systemOnline: "System Online",

        subtitle:
            "Landslide Risk Monitoring System",

        heroTitle:
            "Landslide Risk Assessment",

        heroText:
            "Enter the location, environmental conditions and landslide information to assess the potential risk.",

        assessmentTitle:
            "Location Details",

        state: "State",
        district: "District",
        latitude: "Latitude",
        longitude: "Longitude",
        material: "Material Involved",
        movement: "Movement Type",
        rainfall: "Rainfall (mm)",
        soilMoisture: "Soil Moisture (%)",
        slope: "Slope (degrees)",

        checkRisk: "Check Landslide Risk",

        resultTitle:
            "Risk Assessment Result",

        riskScore: "Final Risk Score",
        riskLevel: "Risk Level",
        riskMessage: "Status",

        mlScore: "ML Risk Score",

        environmentalScore:
            "Environmental Score",

        environmentalLevel:
            "Environmental Risk",

        finalScore:
            "Final Risk Score",

        earlyWarning:
            "Early Warning",

        environmentalData:
            "Environmental Conditions",

        location: "Location",

        recommendations:
            "Safety Recommendations",

        analyticsTitle:
            "📈 Risk Analytics",

        analyticsDescription:
            "Summary of recent landslide risk assessments.",

        averageRisk:
            "Average Risk Score",

        highestRisk:
            "Highest Risk Score",

        latestRisk:
            "Latest Risk Level",

        locations:
            "Total Locations",

        critical: "Critical",
        high: "High",
        moderate: "Moderate",
        low: "Low",

        riskDistribution:
            "Risk Distribution",

        riskTrend:
            "Risk Trend",

        riskTrendDescription:
            "Risk score trend based on recent assessments.",

        noTrendData:
            "No risk assessment data available",

        historyTitle:
            "📊 Risk Assessment History",

        historyDescription:
            "Recent landslide risk assessments performed by the system.",

        totalAssessments:
            "Total Assessments",

        clearHistory:
            "🗑️ Clear History",

        filterRisk:
            "Filter by Risk Level",

        allRiskLevels:
            "All Risk Levels",

        noHistory:
            "No risk assessments yet.",

        incidentsTitle:
            "📍 Report Landslide Incident",

        incidentsDescription:
            "Report a landslide or suspicious ground movement at a specific location.",

        incidentType:
            "Incident Type",

        severity:
            "Severity",

        description:
            "Description",

        reportIncident:
            "📍 Submit Incident Report",

        mapTitle:
            "Landslide Inventory Map",

        mapDescription:
            "Historical landslide locations and current risk assessment zones across the North Eastern Region of India.",

        stateFilter:
            "Filter Historical Landslides by State",

        districtFilter:
            "Filter Historical Landslides by District",

        allStates:
            "All States",

        allDistricts:
            "All Districts",

        historical:
            "📍 Historical Landslide Locations",

        reported:
            "🚨 Reported Incidents",

        riskZones:
            "⚠️ Risk Assessment Zones",

        modelExplanation:
            "🤖 Model Explanation",

        modelExplanationText:
            "Risk score is calculated using machine learning prediction and environmental conditions.",

        mlContribution:
            "ML Contribution",

        environmentalContribution:
            "Environmental Contribution",

        explanationFinalScore:
            "Final Risk Score",

        materialUnknown:
            "Unknown",

        movementUnknown:
            "Unknown",

        environmentalMonitoring:
            "Environmental Monitoring",

        environmentalMonitoringDescription:
            "Current environmental conditions at the selected location",

        liveData:
            "Live Data",

        waiting:
            "Waiting"
    },


    hi: {

        toggle: "English",

        systemOnline:
            "सिस्टम ऑनलाइन",

        subtitle:
            "भूस्खलन जोखिम निगरानी प्रणाली",

        heroTitle:
            "भूस्खलन जोखिम आकलन",

        heroText:
            "स्थान, पर्यावरणीय परिस्थितियों और भूस्खलन की जानकारी दर्ज करके संभावित जोखिम का आकलन करें।",

        assessmentTitle:
            "स्थान की जानकारी",

        state: "राज्य",
        district: "जिला",
        latitude: "अक्षांश",
        longitude: "देशांतर",
        material: "सामग्री",
        movement: "गतिविधि प्रकार",
        rainfall: "वर्षा (mm)",
        soilMoisture: "मिट्टी की नमी (%)",
        slope: "ढलान (डिग्री)",

        checkRisk:
            "भूस्खलन जोखिम जांचें",

        resultTitle:
            "जोखिम आकलन परिणाम",

        riskScore:
            "अंतिम जोखिम स्कोर",

        riskLevel:
            "जोखिम स्तर",

        riskMessage:
            "स्थिति",

        mlScore:
            "ML जोखिम स्कोर",

        environmentalScore:
            "पर्यावरणीय स्कोर",

        environmentalLevel:
            "पर्यावरणीय जोखिम",

        finalScore:
            "अंतिम जोखिम स्कोर",

        earlyWarning:
            "प्रारंभिक चेतावनी",

        environmentalData:
            "पर्यावरणीय परिस्थितियां",

        location:
            "स्थान",

        recommendations:
            "सुरक्षा सुझाव",

        analyticsTitle:
            "📈 जोखिम विश्लेषण",

        analyticsDescription:
            "हाल के भूस्खलन जोखिम आकलनों का सारांश।",

        averageRisk:
            "औसत जोखिम स्कोर",

        highestRisk:
            "उच्चतम जोखिम स्कोर",

        latestRisk:
            "नवीनतम जोखिम स्तर",

        locations:
            "कुल स्थान",

        critical:
            "गंभीर",

        high:
            "उच्च",

        moderate:
            "मध्यम",

        low:
            "कम",

        riskDistribution:
            "जोखिम वितरण",

        riskTrend:
            "जोखिम ट्रेंड",

        riskTrendDescription:
            "हाल के आकलनों के आधार पर जोखिम स्कोर ट्रेंड।",

        noTrendData:
            "कोई जोखिम आकलन डेटा उपलब्ध नहीं है",

        historyTitle:
            "📊 जोखिम आकलन इतिहास",

        historyDescription:
            "सिस्टम द्वारा किए गए हाल के भूस्खलन जोखिम आकलन।",

        totalAssessments:
            "कुल आकलन",

        clearHistory:
            "🗑️ इतिहास साफ करें",

        filterRisk:
            "जोखिम स्तर के अनुसार फ़िल्टर",

        allRiskLevels:
            "सभी जोखिम स्तर",

        noHistory:
            "अभी कोई जोखिम आकलन नहीं है।",

        incidentsTitle:
            "📍 भूस्खलन घटना रिपोर्ट करें",

        incidentsDescription:
            "किसी विशेष स्थान पर भूस्खलन या संदिग्ध जमीन की गतिविधि की रिपोर्ट करें।",

        incidentType:
            "घटना का प्रकार",

        severity:
            "गंभीरता",

        description:
            "विवरण",

        reportIncident:
            "📍 घटना रिपोर्ट जमा करें",

        mapTitle:
            "भूस्खलन इन्वेंटरी मानचित्र",

        mapDescription:
            "उत्तर पूर्वी भारत में ऐतिहासिक भूस्खलन स्थान और वर्तमान जोखिम आकलन क्षेत्र।",

        stateFilter:
            "राज्य के अनुसार ऐतिहासिक भूस्खलन फ़िल्टर करें",

        districtFilter:
            "जिले के अनुसार ऐतिहासिक भूस्खलन फ़िल्टर करें",

        allStates:
            "सभी राज्य",

        allDistricts:
            "सभी जिले",

        historical:
            "📍 ऐतिहासिक भूस्खलन स्थान",

        reported:
            "🚨 रिपोर्ट की गई घटनाएं",

        riskZones:
            "⚠️ जोखिम आकलन क्षेत्र",

        modelExplanation:
            "🤖 मॉडल व्याख्या",

        modelExplanationText:
            "जोखिम स्कोर मशीन लर्निंग भविष्यवाणी और पर्यावरणीय परिस्थितियों के आधार पर निर्धारित किया जाता है।",

        mlContribution:
            "ML योगदान",

        environmentalContribution:
            "पर्यावरणीय योगदान",

        explanationFinalScore:
            "अंतिम जोखिम स्कोर",

        materialUnknown:
            "अज्ञात",

        movementUnknown:
            "अज्ञात",

        environmentalMonitoring:
            "पर्यावरणीय निगरानी",

        environmentalMonitoringDescription:
            "चयनित स्थान की वर्तमान पर्यावरणीय परिस्थितियां",

        liveData:
            "लाइव डेटा",

        waiting:
            "प्रतीक्षा"
    }
};


let currentLanguage =
    localStorage.getItem(LANGUAGE_KEY) || "en";


function t(key) {

    return (
        translations[currentLanguage]?.[key] ||
        translations.en[key] ||
        key
    );
}


/* =====================================================
   RISK LEVEL TRANSLATION
   ===================================================== */

function translateRiskLevel(level) {

    if (currentLanguage === "en") {
        return level;
    }

    const map = {

        Critical: "गंभीर",
        High: "उच्च",
        Moderate: "मध्यम",
        Low: "कम"
    };

    return map[level] || level;
}


/* =====================================================
   LANGUAGE TOGGLE
   ===================================================== */

function createLanguageToggle() {

    if (
        document.getElementById("languageToggle")
    ) {
        return;
    }

    const status =
        document.querySelector(".status");

    if (!status) {
        return;
    }

    const button =
        document.createElement("button");

    button.id = "languageToggle";
    button.type = "button";

    button.addEventListener(
        "click",
        () => {

            currentLanguage =
                currentLanguage === "en"
                    ? "hi"
                    : "en";

            localStorage.setItem(
                LANGUAGE_KEY,
                currentLanguage
            );

            translatePage();
        }
    );

    status.appendChild(button);
}


/* =====================================================
   TRANSLATE PAGE
   ===================================================== */

function translatePage() {

    document.documentElement.lang =
        currentLanguage;


    const toggle =
        document.getElementById(
            "languageToggle"
        );

    if (toggle) {
        toggle.textContent =
            t("toggle");
    }


    const heroTitle =
        document.querySelector(
            ".hero h2"
        );

    if (heroTitle) {
        heroTitle.textContent =
            t("heroTitle");
    }


    const heroText =
        document.querySelector(
            ".hero p"
        );

    if (heroText) {
        heroText.textContent =
            t("heroText");
    }


    const subtitle =
        document.querySelector(
            ".topbar p"
        );

    if (subtitle) {
        subtitle.textContent =
            t("subtitle");
    }


    const statusText =
        document.querySelector(
            ".status span:not(.status-dot)"
        );

    if (statusText) {
        statusText.textContent =
            t("systemOnline");
    }


    const sectionTitleMap = {

        resultTitle:
            "resultTitle",

        assessmentTitle:
            "assessmentTitle",

        analyticsTitle:
            "analyticsTitle",

        incidentsTitle:
            "incidentsTitle",

        mapTitle:
            "mapTitle",

        modelExplanationTitle:
            "modelExplanation",

        earlyWarningTitle:
            "earlyWarning",

        recommendationsTitle:
            "recommendations"
    };


    Object.keys(sectionTitleMap)
        .forEach(id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.textContent =
                    t(
                        sectionTitleMap[id]
                    );
            }
        });


    const checkButton =
        document.getElementById(
            "checkRisk"
        );

    if (
        checkButton &&
        !checkButton.disabled
    ) {
        checkButton.textContent =
            t("checkRisk");
    }


    const clearButton =
        document.getElementById(
            "clearHistoryBtn"
        );

    if (clearButton) {
        clearButton.textContent =
            t("clearHistory");
    }


    const reportButton =
        document.getElementById(
            "reportIncidentBtn"
        );

    if (reportButton) {
        reportButton.textContent =
            t("reportIncident");
    }


    const environmentTitle =
        document.getElementById(
            "environmentalMonitoringTitle"
        );

    if (environmentTitle) {
        environmentTitle.textContent =
            t("environmentalMonitoring");
    }


    const environmentDescription =
        document.getElementById(
            "environmentalMonitoringDescription"
        );

    if (environmentDescription) {
        environmentDescription.textContent =
            t(
                "environmentalMonitoringDescription"
            );
    }


    const environmentStatus =
        document.getElementById(
            "environmentStatus"
        );

    if (environmentStatus) {

        if (
            environmentStatus.textContent ===
            "Live Data" ||
            environmentStatus.textContent ===
            "लाइव डेटा"
        ) {

            environmentStatus.textContent =
                t("liveData");

        } else {

            environmentStatus.textContent =
                t("waiting");
        }
    }


    const rainfallLabel =
        document.getElementById(
            "rainfallLabel"
        );

    if (rainfallLabel) {
        rainfallLabel.textContent =
            t("rainfall");
    }


    const soilMoistureLabel =
        document.getElementById(
            "soilMoistureLabel"
        );

    if (soilMoistureLabel) {
        soilMoistureLabel.textContent =
            t("soilMoisture");
    }


    const slopeLabel =
        document.getElementById(
            "slopeLabel"
        );

    if (slopeLabel) {
        slopeLabel.textContent =
            t("slope");
    }


    translateLabels();

    translateSelectOptions();

    translateIncidentOptions();

    translateAnalyticsLabels();

    translateHistoryLabels();

    translateModelExplanation();

    translateHistory();

    updateRiskHistoryAnalytics();

    renderRiskHistory();

    updateRiskTrendChart();
}


/* =====================================================
   TRANSLATE LABELS
   ===================================================== */

function translateLabels() {

    const labelMap = {

        "State": "state",
        "District": "district",
        "Latitude": "latitude",
        "Longitude": "longitude",
        "Material Involved": "material",
        "Movement Type": "movement",
        "Rainfall (mm)": "rainfall",
        "Soil Moisture (%)": "soilMoisture",
        "Slope (degrees)": "slope",
        "Incident Type": "incidentType",
        "Severity": "severity",
        "Description": "description",
        "Filter Historical Landslides by State":
            "stateFilter",
        "Filter Historical Landslides by District":
            "districtFilter"
    };


    document
        .querySelectorAll("label")
        .forEach(label => {

            const text =
                label.textContent.trim();

            if (labelMap[text]) {

                label.textContent =
                    t(labelMap[text]);
            }
        });
}


/* =====================================================
   SELECT OPTIONS
   ===================================================== */

function translateSelectOptions() {

    const material =
        document.getElementById(
            "material"
        );

    if (material) {

        const labels = {

            Unknown:
                t("materialUnknown"),

            Rock:
                currentLanguage === "hi"
                    ? "चट्टान"
                    : "Rock",

            Soil:
                currentLanguage === "hi"
                    ? "मिट्टी"
                    : "Soil",

            Earth:
                currentLanguage === "hi"
                    ? "धरती"
                    : "Earth",

            Debris:
                currentLanguage === "hi"
                    ? "मलबा"
                    : "Debris",

            "Rock cum Debris":
                currentLanguage === "hi"
                    ? "चट्टान और मलबा"
                    : "Rock cum Debris"
        };


        Array
            .from(material.options)
            .forEach(option => {

                if (
                    labels[option.value]
                    !== undefined
                ) {

                    option.textContent =
                        labels[option.value];
                }
            });
    }


    const movement =
        document.getElementById(
            "movement_type"
        );

    if (movement) {

        const labels = {

            Unknown:
                t("movementUnknown"),

            Slide:
                currentLanguage === "hi"
                    ? "स्लाइड"
                    : "Slide",

            Fall:
                currentLanguage === "hi"
                    ? "गिराव"
                    : "Fall",

            Flow:
                currentLanguage === "hi"
                    ? "प्रवाह"
                    : "Flow",

            Complex:
                currentLanguage === "hi"
                    ? "जटिल"
                    : "Complex",

            Subsidence:
                currentLanguage === "hi"
                    ? "धंसाव"
                    : "Subsidence",

            Topple:
                currentLanguage === "hi"
                    ? "पलटना"
                    : "Topple",

            Creep:
                currentLanguage === "hi"
                    ? "धीमी गति"
                    : "Creep"
        };


        Array
            .from(movement.options)
            .forEach(option => {

                if (
                    labels[option.value]
                    !== undefined
                ) {

                    option.textContent =
                        labels[option.value];
                }
            });
    }


    const stateFilter =
        document.getElementById(
            "mapStateFilter"
        );

    if (stateFilter) {

        if (
            stateFilter.options.length
        ) {

            stateFilter.options[0]
                .textContent =
                t("allStates");
        }
    }


    const districtFilter =
        document.getElementById(
            "mapDistrictFilter"
        );

    if (districtFilter) {

        if (
            districtFilter.options.length
        ) {

            districtFilter.options[0]
                .textContent =
                t("allDistricts");
        }
    }
}


/* =====================================================
   INCIDENT OPTIONS
   ===================================================== */

function translateIncidentOptions() {

    const severity =
        document.getElementById(
            "incidentSeverity"
        );

    if (!severity) {
        return;
    }


    const severityLabels = {

        Low:
            t("low"),

        Moderate:
            t("moderate"),

        High:
            t("high"),

        Critical:
            t("critical")
    };


    Array
        .from(severity.options)
        .forEach(option => {

            if (
                severityLabels[
                    option.value
                ] !== undefined
            ) {

                option.textContent =
                    severityLabels[
                        option.value
                    ];
            }
        });


    const incidentType =
        document.getElementById(
            "incidentType"
        );

    if (incidentType) {

        const types = {

            Landslide:
                currentLanguage === "hi"
                    ? "भूस्खलन"
                    : "Landslide",

            Rockfall:
                currentLanguage === "hi"
                    ? "चट्टान गिरना"
                    : "Rockfall",

            "Debris Flow":
                currentLanguage === "hi"
                    ? "मलबा प्रवाह"
                    : "Debris Flow",

            Crack:
                currentLanguage === "hi"
                    ? "जमीन में दरार"
                    : "Ground Crack",

            "Slope Movement":
                currentLanguage === "hi"
                    ? "ढलान की गतिविधि"
                    : "Slope Movement",

            Other:
                currentLanguage === "hi"
                    ? "अन्य"
                    : "Other"
        };


        Array
            .from(incidentType.options)
            .forEach(option => {

                if (
                    types[option.value]
                    !== undefined
                ) {

                    option.textContent =
                        types[option.value];
                }
            });
    }
}


/* =====================================================
   MODEL EXPLANATION
   ===================================================== */

function updateModelExplanation(result) {

    const mlScore =
        Number(result?.ml_score) || 0;

    const environmentalScore =
        Number(
            result?.environmental_score
        ) || 0;

    const finalScore =
        Number(result?.risk_score) || 0;


    const mlContribution =
        mlScore * 0.70;

    const environmentalContribution =
        environmentalScore * 0.30;


    const mlElement =
        document.getElementById(
            "mlContribution"
        );

    const environmentalElement =
        document.getElementById(
            "environmentalContribution"
        );

    const finalElement =
        document.getElementById(
            "explanationFinalScore"
        );


    if (mlElement) {

        mlElement.textContent =
            mlContribution.toFixed(2);
    }


    if (environmentalElement) {

        environmentalElement.textContent =
            environmentalContribution.toFixed(2);
    }


    if (finalElement) {

        finalElement.textContent =
            finalScore.toFixed(2);
    }


    const explanationText =
        document.getElementById(
            "modelExplanationText"
        );


    if (explanationText) {

        if (
            currentLanguage === "hi"
        ) {

            explanationText.textContent =
                `अंतिम जोखिम स्कोर में ML मॉडल का योगदान ${mlContribution.toFixed(2)} और पर्यावरणीय परिस्थितियों का योगदान ${environmentalContribution.toFixed(2)} है।`;

        } else {

            explanationText.textContent =
                `The ML model contributes ${mlContribution.toFixed(2)} points and environmental conditions contribute ${environmentalContribution.toFixed(2)} points to the final risk score.`;
        }
    }
}


function translateModelExplanation() {

    const title =
        document.getElementById(
            "modelExplanationTitle"
        );

    if (title) {
        title.textContent =
            t("modelExplanation");
    }


    const text =
        document.getElementById(
            "modelExplanationText"
        );

    if (text) {

        const finalScore =
            document.getElementById(
                "explanationFinalScore"
            )?.textContent || "0.00";

        const mlContribution =
            document.getElementById(
                "mlContribution"
            )?.textContent || "0.00";

        const environmentalContribution =
            document.getElementById(
                "environmentalContribution"
            )?.textContent || "0.00";


        if (
            mlContribution !== "0.00" ||
            environmentalContribution !== "0.00"
        ) {

            if (
                currentLanguage === "hi"
            ) {

                text.textContent =
                    `अंतिम जोखिम स्कोर में ML मॉडल का योगदान ${mlContribution} और पर्यावरणीय परिस्थितियों का योगदान ${environmentalContribution} है।`;

            } else {

                text.textContent =
                    `The ML model contributes ${mlContribution} points and environmental conditions contribute ${environmentalContribution} points to the final risk score.`;
            }

        } else {

            text.textContent =
                t("modelExplanationText");
        }
    }
}


/* =====================================================
   RISK HISTORY
   ===================================================== */

function getRiskHistory() {

    try {

        return (
            JSON.parse(
                localStorage.getItem(
                    RISK_HISTORY_KEY
                )
            ) || []
        );

    } catch {

        return [];
    }
}


function saveRiskHistory(history) {

    localStorage.setItem(

        RISK_HISTORY_KEY,

        JSON.stringify(
            history.slice(
                0,
                MAX_HISTORY
            )
        )
    );
}


/* =====================================================
   ADD HISTORY
   ===================================================== */

function addRiskAssessmentToHistory(
    result
) {

    const history =
        getRiskHistory();


    history.unshift({

        timestamp:
            new Date().toISOString(),

        risk_score:
            Number(
                result.risk_score
            ) || 0,

        risk_level:
            result.risk_level ||
            "Low",

        state:
            result.location?.state ||
            "",

        district:
            result.location?.district ||
            "",

        latitude:
            Number(
                result.location?.latitude
            ) || 0,

        longitude:
            Number(
                result.location?.longitude
            ) || 0
    });


    saveRiskHistory(history);

    updateRiskHistoryAnalytics();

    renderRiskHistory();

    updateRiskZones();

    updateRiskTrendChart();
}
/* =====================================================
   HISTORY ANALYTICS
   ===================================================== */

function updateRiskHistoryAnalytics() {

    const history = getRiskHistory();
    const total = history.length;

    let critical = 0;
    let high = 0;
    let moderate = 0;
    let low = 0;

    history.forEach(item => {
        switch (item.risk_level) {
            case "Critical":
                critical++;
                break;
            case "High":
                high++;
                break;
            case "Moderate":
                moderate++;
                break;
            default:
                low++;
                break;
        }
    });

    const scores = history
        .map(item => Number(item.risk_score))
        .filter(Number.isFinite);

    const average = scores.length
        ? scores.reduce((sum, value) => sum + value, 0) / scores.length
        : 0;

    const highest = scores.length
        ? Math.max(...scores)
        : 0;

    const latest = history.length
        ? history[0].risk_level
        : "--";

    const locations = new Set(
        history.map(item => `${item.latitude},${item.longitude}`)
    ).size;

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    // Dashboard overview
    setText("overviewTotal", total);
    setText("overviewCritical", critical);
    setText("overviewHigh", high);
    setText("overviewModerate", moderate);
    setText("overviewLow", low);

    // Analytics cards
    setText("averageRiskScore", `${average.toFixed(2)}%`);
    setText("highestRiskScore", `${highest.toFixed(2)}%`);
    setText(
        "latestRiskLevel",
        latest === "--" ? "—" : translateRiskLevel(latest)
    );
    setText("analyticsLocations", locations);

    // History summary
    setText("historyTotal", total);
    setText("historyCritical", critical);
    setText("historyHigh", high);
    setText("historyModerate", moderate);
    setText("historyLow", low);

    updateRiskDistribution(critical, high, moderate, low);
}

/* =====================================================
   RISK DISTRIBUTION
   ===================================================== */

function updateRiskDistribution(critical, high, moderate, low) {

    const total = critical + high + moderate + low;

    const values = {
        critical: total ? (critical / total) * 100 : 0,
        high: total ? (high / total) * 100 : 0,
        moderate: total ? (moderate / total) * 100 : 0,
        low: total ? (low / total) * 100 : 0
    };

    const bars = {
        critical: document.getElementById("criticalDistributionBar"),
        high: document.getElementById("highDistributionBar"),
        moderate: document.getElementById("moderateDistributionBar"),
        low: document.getElementById("lowDistributionBar")
    };

    Object.entries(bars).forEach(([level, bar]) => {
        if (bar) {
            bar.style.width = `${values[level]}%`;
        }
    });

    // The supplied HTML displays the actual count beside each bar.
    const counts = {
        critical: document.getElementById("analyticsCritical"),
        high: document.getElementById("analyticsHigh"),
        moderate: document.getElementById("analyticsModerate"),
        low: document.getElementById("analyticsLow")
    };

    if (counts.critical) counts.critical.textContent = critical;
    if (counts.high) counts.high.textContent = high;
    if (counts.moderate) counts.moderate.textContent = moderate;
    if (counts.low) counts.low.textContent = low;
}

/* =====================================================
   HISTORY TABLE
   ===================================================== */

function renderRiskHistory() {

    const tbody =
        document.getElementById(
            "riskHistoryBody"
        );


    if (!tbody) {
        return;
    }


    const filter =
        document.getElementById(
            "historyRiskFilter"
        )?.value || "";


    let history =
        getRiskHistory();


    if (filter) {

        history =
            history.filter(
                item =>
                    item.risk_level ===
                    filter
            );
    }


    tbody.innerHTML = "";


    if (!history.length) {

        const row =
            document.createElement("tr");


        const cell =
            document.createElement("td");


        cell.colSpan = 7;

        cell.textContent =
            t("noHistory");


        cell.className =
            "empty-history";


        row.appendChild(cell);

        tbody.appendChild(row);

        return;
    }


    history.forEach(item => {

        const row =
            document.createElement("tr");


        const dateCell =
            document.createElement("td");

        const stateCell =
            document.createElement("td");

        const districtCell =
            document.createElement("td");

        const latCell =
            document.createElement("td");

        const lonCell =
            document.createElement("td");

        const scoreCell =
            document.createElement("td");

        const levelCell =
            document.createElement("td");


        const date =
            new Date(
                item.timestamp
            );


        dateCell.textContent =
            Number.isNaN(
                date.getTime()
            )
                ? "--"
                : date.toLocaleString();


        stateCell.textContent =
            item.state || "--";


        districtCell.textContent =
            item.district || "--";


        latCell.textContent =
            Number(
                item.latitude
            ).toFixed(4);


        lonCell.textContent =
            Number(
                item.longitude
            ).toFixed(4);


        scoreCell.textContent =
            Number(
                item.risk_score
            ).toFixed(2);


        const level =
            item.risk_level ||
            "Low";


        levelCell.textContent =
            translateRiskLevel(
                level
            );


        levelCell.className =
            `risk-level ${level.toLowerCase()}`;


        row.appendChild(dateCell);
        row.appendChild(stateCell);
        row.appendChild(districtCell);
        row.appendChild(latCell);
        row.appendChild(lonCell);
        row.appendChild(scoreCell);
        row.appendChild(levelCell);


        tbody.appendChild(row);
    });
}


/* =====================================================
   HISTORY LABELS
   ===================================================== */

function translateHistoryLabels() {

    const labels = {

        "Date & Time":
            currentLanguage === "hi"
                ? "दिनांक और समय"
                : "Date & Time",

        State:
            t("state"),

        District:
            t("district"),

        Latitude:
            t("latitude"),

        Longitude:
            t("longitude"),

        "Risk Score":
            t("riskScore"),

        "Risk Level":
            t("riskLevel")
    };


    document
        .querySelectorAll(
            ".risk-history-table th"
        )
        .forEach(th => {

            const text =
                th.textContent.trim();


            if (
                labels[text] !==
                undefined
            ) {

                th.textContent =
                    labels[text];
            }
        });
}


function translateHistory() {

    const description =
        document.querySelector(
            ".risk-history-section .section-header p"
        );

    if (description) {

        description.textContent =
            t("historyDescription");
    }


    const historyTitle =
        document.getElementById(
            "historyTitle"
        );

    if (historyTitle) {

        historyTitle.textContent =
            t("historyTitle");
    }


    const filterLabel =
        document.querySelector(
            'label[for="historyRiskFilter"]'
        );

    if (filterLabel) {

        filterLabel.textContent =
            t("filterRisk");
    }
}


/* =====================================================
   CLEAR HISTORY
   ===================================================== */

function clearRiskHistory() {

    const history =
        getRiskHistory();


    if (!history.length) {
        return;
    }


    const confirmed =
        confirm(
            currentLanguage === "hi"
                ? "क्या आप सभी risk history हटाना चाहते हैं?"
                : "Are you sure you want to clear all risk history?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        RISK_HISTORY_KEY
    );


    updateRiskHistoryAnalytics();

    renderRiskHistory();

    updateRiskZones();

    updateRiskTrendChart();
}


/* =====================================================
   RISK TREND CHART
   ===================================================== */

let riskTrendChart = null;


function updateRiskTrendChart() {

    const canvas =
        document.getElementById(
            "riskTrendChart"
        );


    if (!canvas) {
        return;
    }


    const history =
        getRiskHistory()
            .slice()
            .reverse();


    const labels =
        history.map(
            item => {

                const date =
                    new Date(
                        item.timestamp
                    );

                return Number.isNaN(
                    date.getTime()
                )
                    ? ""
                    : date.toLocaleDateString(
                        undefined,
                        {
                            day: "2-digit",
                            month: "short"
                        }
                    );
            }
        );


    const values =
        history.map(
            item =>
                Number(
                    item.risk_score
                ) || 0
        );


    if (
        riskTrendChart
    ) {

        riskTrendChart.destroy();

        riskTrendChart = null;
    }


    const ChartConstructor =
        window.Chart;


    if (!ChartConstructor) {
        return;
    }


    riskTrendChart =
        new ChartConstructor(
            canvas.getContext("2d"),
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {
                            label:
                                currentLanguage === "hi"
                                    ? "जोखिम स्कोर"
                                    : "Risk Score",

                            data: values,

                            borderWidth: 2,

                            tension: 0.3,

                            fill: false,

                            pointRadius: 3,

                            pointHoverRadius: 5
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            suggestedMax:
                                100,

                            title: {

                                display:
                                    true,

                                text:
                                    currentLanguage === "hi"
                                        ? "जोखिम स्कोर"
                                        : "Risk Score"
                            }
                        },

                        x: {

                            title: {

                                display:
                                    true,

                                text:
                                    currentLanguage === "hi"
                                        ? "समय"
                                        : "Time"
                            }
                        }
                    },

                    plugins: {

                        legend: {

                            display:
                                true
                        }
                    }
                }
            }
        );
}


/* =====================================================
   RISK ZONES
   ===================================================== */

function getRiskColor(
    riskLevel
) {

    switch (
        riskLevel
    ) {

        case "Critical":
            return "#dc2626";

        case "High":
            return "#ea580c";

        case "Moderate":
            return "#ca8a04";

        default:
            return "#16a34a";
    }
}


function updateRiskZones() {

    if (
        !landslideMap
    ) {
        return;
    }


    if (
        !riskZoneLayer
    ) {

        riskZoneLayer =
            L.layerGroup()
                .addTo(
                    landslideMap
                );
    }


    riskZoneLayer.clearLayers();


    const history =
        getRiskHistory();


    history.forEach(item => {

        const latitude =
            Number(
                item.latitude
            );

        const longitude =
            Number(
                item.longitude
            );


        if (
            !Number.isFinite(
                latitude
            ) ||
            !Number.isFinite(
                longitude
            )
        ) {
            return;
        }


        const level =
            item.risk_level ||
            "Low";


        const circle =
            L.circle(
                [
                    latitude,
                    longitude
                ],
                {

                    radius:
                        level === "Critical"
                            ? 1200
                            : level === "High"
                                ? 900
                                : level === "Moderate"
                                    ? 650
                                    : 450,

                    color:
                        getRiskColor(
                            level
                        ),

                    fillColor:
                        getRiskColor(
                            level
                        ),

                    fillOpacity:
                        0.18,

                    weight:
                        2
                }
            );


        circle.bindPopup(
            `
                <strong>
                    ${translateRiskLevel(level)}
                </strong>
                <br>
                ${t("riskScore")}: 
                ${Number(item.risk_score).toFixed(2)}
                <br>
                ${item.state || ""}
                ${item.district ? ", " + item.district : ""}
            `
        );


        riskZoneLayer.addLayer(
            circle
        );
    });
}


/* =====================================================
   MAP INITIALIZATION
   ===================================================== */

function initializeMap() {

    const mapElement =
        document.getElementById(
            "map"
        );


    if (!mapElement) {
        return;
    }


    landslideMap =
        L.map(
            mapElement,
            {
                center: [
                    26.2006,
                    92.9376
                ],

                zoom: 6,

                minZoom: 5,

                maxZoom: 15
            }
        );


    const streetLayer =
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {

                attribution:
                    "&copy; OpenStreetMap contributors",

                maxZoom: 19
            }
        );


    const satelliteLayer =
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {

                attribution:
                    "Tiles &copy; Esri",

                maxZoom: 19
            }
        );


    streetLayer.addTo(
        landslideMap
    );


    L.control.layers(
        {

            "Street Map":
                streetLayer,

            "Satellite":
                satelliteLayer

        }
    ).addTo(
        landslideMap
    );


    riskZoneLayer =
        L.layerGroup()
            .addTo(
                landslideMap
            );


    inventoryLayer =
        L.layerGroup()
            .addTo(
                landslideMap
            );


    incidentLayer =
        L.layerGroup()
            .addTo(
                landslideMap
            );


    // Click anywhere on the map to select an assessment location.
    landslideMap.on("click", async function (event) {

        const latitude = Number(event.latlng.lat.toFixed(6));
        const longitude = Number(event.latlng.lng.toFixed(6));

        if (
            latitude < NER_BOUNDS.minLat ||
            latitude > NER_BOUNDS.maxLat ||
            longitude < NER_BOUNDS.minLon ||
            longitude > NER_BOUNDS.maxLon
        ) {
            alert(
                currentLanguage === "hi"
                    ? "कृपया North Eastern Region के अंदर location select करें।"
                    : "Please select a location within the North Eastern Region."
            );
            return;
        }

        await reverseGeocodeAssessmentLocation(
            latitude,
            longitude
        );
    });


    initializeAutomaticLocationSelection();

    loadInventoryData();

    loadIncidentReports();

    updateRiskZones();

    // Ensure Leaflet recalculates the map size after the page layout is ready.
    setTimeout(() => {
        if (landslideMap) {
            landslideMap.invalidateSize();
        }
    }, 300);
}


/* =====================================================
   UPDATE MAP LOCATION
   ===================================================== */

function updateMapLocation(
    latitude,
    longitude,
    popupText = ""
) {

    if (
        !landslideMap
    ) {
        return;
    }


    const lat =
        Number(latitude);

    const lon =
        Number(longitude);


    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
    ) {
        return;
    }


    if (
        selectedMarker
    ) {

        landslideMap.removeLayer(
            selectedMarker
        );
    }


    selectedMarker =
        L.marker(
            [
                lat,
                lon
            ]
        ).addTo(
            landslideMap
        );


    if (popupText) {

        selectedMarker.bindPopup(
            popupText
        ).openPopup();

    } else {

        selectedMarker
            .bindPopup(
                `
                    <strong>
                        ${t("location")}
                    </strong>
                    <br>
                    ${lat.toFixed(4)},
                    ${lon.toFixed(4)}
                `
            )
            .openPopup();
    }


    landslideMap.setView(
        [
            lat,
            lon
        ],
        9
    );
}


/* =====================================================
   MAP FILTERS
   ===================================================== */

function populateMapFilters() {

    const stateFilter =
        document.getElementById(
            "mapStateFilter"
        );

    const districtFilter =
        document.getElementById(
            "mapDistrictFilter"
        );


    if (
        !stateFilter ||
        !districtFilter
    ) {
        return;
    }


    const states =
        [
            ...new Set(
                inventoryData
                    .map(
                        row =>
                            row.State
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    stateFilter.innerHTML =
        `<option value="">${t("allStates")}</option>`;


    states.forEach(
        state => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                state;

            option.textContent =
                state;

            stateFilter.appendChild(
                option
            );
        }
    );


    districtFilter.innerHTML =
        `<option value="">${t("allDistricts")}</option>`;


    stateFilter.addEventListener(
        "change",
        () => {

            const selectedState =
                stateFilter.value;


            const districts =
                [
                    ...new Set(
                        inventoryData
                            .filter(
                                row =>
                                    !selectedState ||
                                    row.State ===
                                        selectedState
                            )
                            .map(
                                row =>
                                    row.District
                            )
                            .filter(Boolean)
                    )
                ]
                .sort();


            districtFilter.innerHTML =
                `<option value="">${t("allDistricts")}</option>`;


            districts.forEach(
                district => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        district;

                    option.textContent =
                        district;

                    districtFilter.appendChild(
                        option
                    );
                }
            );


            renderInventoryMarkers();
        }
    );


    districtFilter.addEventListener(
        "change",
        renderInventoryMarkers
    );
}


/* =====================================================
   LOAD INVENTORY DATA
   ===================================================== */

async function loadInventoryData() {

    try {

        const response =
            await fetch(
                "data/ml_ready_landslides.csv"
            );


        if (!response.ok) {
            throw new Error(
                `CSV Error: ${response.status}`
            );
        }


        const csvText =
            await response.text();


        inventoryData =
            parseCSV(csvText);


        populateMapFilters();

        renderInventoryMarkers();

    } catch (error) {

        console.error(
            "Failed to load inventory:",
            error
        );
    }
}


/* =====================================================
   SIMPLE CSV PARSER
   ===================================================== */

function parseCSV(
    text
) {

    const lines =
        text
            .trim()
            .split(/\r?\n/);


    if (
        lines.length < 2
    ) {
        return [];
    }


    const headers =
        parseCSVLine(
            lines[0]
        );


    return lines
        .slice(1)
        .map(line => {

            const values =
                parseCSVLine(
                    line
                );


            const row = {};


            headers.forEach(
                (
                    header,
                    index
                ) => {

                    row[header] =
                        values[index] ??
                        "";
                }
            );


            return row;
        });
}


function parseCSVLine(
    line
) {

    const result = [];

    let current = "";

    let insideQuotes =
        false;


    for (
        let i = 0;
        i < line.length;
        i++
    ) {

        const char =
            line[i];


        if (
            char === '"'
        ) {

            if (
                insideQuotes &&
                line[i + 1] === '"'
            ) {

                current += '"';

                i++;

            } else {

                insideQuotes =
                    !insideQuotes;
            }

        } else if (
            char === "," &&
            !insideQuotes
        ) {

            result.push(
                current.trim()
            );

            current = "";

        } else {

            current += char;
        }
    }


    result.push(
        current.trim()
    );


    return result;
}


/* =====================================================
   INVENTORY MARKERS
   ===================================================== */

function renderInventoryMarkers() {

    if (
        !landslideMap ||
        !inventoryLayer
    ) {
        return;
    }


    inventoryLayer.clearLayers();


    const state =
        document.getElementById(
            "mapStateFilter"
        )?.value || "";


    const district =
        document.getElementById(
            "mapDistrictFilter"
        )?.value || "";


    const filtered =
        inventoryData
            .filter(
                row => {

                    const stateMatch =
                        !state ||
                        row.State ===
                            state;

                    const districtMatch =
                        !district ||
                        row.District ===
                            district;

                    return (
                        stateMatch &&
                        districtMatch
                    );
                }
            )
            .slice(
                0,
                MAX_INVENTORY_MARKERS
            );


    filtered.forEach(
        row => {

            const latitude =
                Number(
                    row.Latitude
                );

            const longitude =
                Number(
                    row.Longitude
                );


            if (
                !Number.isFinite(
                    latitude
                ) ||
                !Number.isFinite(
                    longitude
                )
            ) {
                return;
            }


            const marker =
                L.circleMarker(
                    [
                        latitude,
                        longitude
                    ],
                    {

                        radius: 5,

                        weight: 1,

                        fillOpacity:
                            0.75
                    }
                );


            marker.bindPopup(
                `
                    <strong>
                        ${row.State || ""}
                    </strong>
                    <br>
                    ${
                        row.District ||
                        ""
                    }
                    <br>
                    ${
                        row["Material Involved"] ||
                        ""
                    }
                    <br>
                    ${
                        row["Movement Type"] ||
                        ""
                    }
                `
            );


            inventoryLayer.addLayer(
                marker
            );
        }
    );
}
/* =====================================================
   INCIDENT REPORTING
   ===================================================== */

function getIncidentReports() {

    try {

        return (
            JSON.parse(
                localStorage.getItem(
                    INCIDENT_REPORT_KEY
                )
            ) || []
        );

    } catch {

        return [];
    }
}


function saveIncidentReports(
    reports
) {

    localStorage.setItem(
        INCIDENT_REPORT_KEY,
        JSON.stringify(reports)
    );
}


/* =====================================================
   SUBMIT INCIDENT REPORT
   ===================================================== */

function reportIncident() {
    submitIncidentReport();
}


function submitIncidentReport() {

    const incidentType =
        document.getElementById(
            "incidentType"
        )?.value || "Other";


    const severity =
        document.getElementById(
            "incidentSeverity"
        )?.value || "Moderate";


    const latitude =
        Number(
            document.getElementById(
                "incidentLatitude"
            )?.value
        );


    const longitude =
        Number(
            document.getElementById(
                "incidentLongitude"
            )?.value
        );


    const description =
        document.getElementById(
            "incidentDescription"
        )?.value.trim() || "";


    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        alert(
            currentLanguage === "hi"
                ? "कृपया सही latitude और longitude दर्ज करें।"
                : "Please enter valid latitude and longitude."
        );

        return;
    }


    if (
        latitude < NER_BOUNDS.minLat ||
        latitude > NER_BOUNDS.maxLat ||
        longitude < NER_BOUNDS.minLon ||
        longitude > NER_BOUNDS.maxLon
    ) {

        alert(
            currentLanguage === "hi"
                ? "यह स्थान North Eastern Region की सीमा से बाहर है।"
                : "This location is outside the North Eastern Region."
        );

        return;
    }


    const reports =
        getIncidentReports();


    const report = {

        id:
            Date.now(),

        timestamp:
            new Date().toISOString(),

        incidentType:
            incidentType,

        severity:
            severity,

        state:
            document.getElementById("incidentState")?.value || "",

        district:
            document.getElementById("incidentDistrict")?.value.trim() || "",

        latitude:
            latitude,

        longitude:
            longitude,

        description:
            description
    };


    reports.unshift(
        report
    );


    saveIncidentReports(
        reports
    );


    loadIncidentReports();


    const descriptionField =
        document.getElementById(
            "incidentDescription"
        );


    if (descriptionField) {
        descriptionField.value = "";
    }


    alert(
        currentLanguage === "hi"
            ? "Incident report सफलतापूर्वक जमा हो गई।"
            : "Incident report submitted successfully."
    );
}


/* =====================================================
   LOAD INCIDENT REPORTS
   ===================================================== */

function loadIncidentReports() {

    if (
        !landslideMap ||
        !incidentLayer
    ) {
        return;
    }


    incidentLayer.clearLayers();


    const reports =
        getIncidentReports();


    reports.forEach(
        report => {

            const latitude =
                Number(
                    report.latitude
                );

            const longitude =
                Number(
                    report.longitude
                );


            if (
                !Number.isFinite(
                    latitude
                ) ||
                !Number.isFinite(
                    longitude
                )
            ) {
                return;
            }


            const marker =
                L.marker(
                    [
                        latitude,
                        longitude
                    ]
                );


            marker.bindPopup(
                `
                    <strong>
                        🚨 ${report.incidentType || "Incident"}
                    </strong>
                    <br>
                    <strong>
                        ${translateRiskLevel(report.severity || "Moderate")}
                    </strong>
                    <br>
                    ${report.description || ""}
                    <br>
                    <small>
                        ${new Date(
                            report.timestamp
                        ).toLocaleString()}
                    </small>
                `
            );


            incidentLayer.addLayer(
                marker
            );
        }
    );
}


/* =====================================================
   FILL INCIDENT LOCATION FROM CURRENT RISK
   ===================================================== */

function fillIncidentFromCurrentRisk(
    result
) {

    const location =
        result?.location;


    if (!location) {
        return;
    }


    const latitudeField =
        document.getElementById(
            "incidentLatitude"
        );

    const longitudeField =
        document.getElementById(
            "incidentLongitude"
        );


    if (
        latitudeField &&
        Number.isFinite(
            Number(location.latitude)
        )
    ) {

        latitudeField.value =
            Number(
                location.latitude
            ).toFixed(6);
    }


    if (
        longitudeField &&
        Number.isFinite(
            Number(location.longitude)
        )
    ) {

        longitudeField.value =
            Number(
                location.longitude
            ).toFixed(6);
    }


    const severityField =
        document.getElementById(
            "incidentSeverity"
        );


    if (
        severityField &&
        result.risk_level
    ) {

        const allowed =
            [
                "Low",
                "Moderate",
                "High",
                "Critical"
            ];


        if (
            allowed.includes(
                result.risk_level
            )
        ) {

            severityField.value =
                result.risk_level;
        }
    }
}


/* =====================================================
   ENVIRONMENTAL MONITORING
   ===================================================== */

function updateEnvironmentalMonitoring(
    environmentalData,
    environmentalLevel = null
) {

    const rainfallElement =
        document.getElementById(
            "rainfallValue"
        );

    const soilMoistureElement =
        document.getElementById(
            "soilMoistureValue"
        );

    const slopeElement =
        document.getElementById(
            "slopeValue"
        );

    const statusElement =
        document.getElementById(
            "environmentStatus"
        );

    const dataTextElement =
        document.getElementById(
            "environmentalDataText"
        );


    if (!environmentalData) {

        if (rainfallElement) {
            rainfallElement.textContent =
                "--";
        }

        if (soilMoistureElement) {
            soilMoistureElement.textContent =
                "--";
        }

        if (slopeElement) {
            slopeElement.textContent =
                "--";
        }

        if (statusElement) {
            statusElement.textContent =
                t("waiting");
        }

        if (dataTextElement) {
            dataTextElement.textContent =
                t("waiting");
        }

        return;
    }


    const rainfall =
        Number(
            environmentalData.rainfall
        );


    const soilMoisture =
        Number(
            environmentalData.soil_moisture
        );


    const slope =
        Number(
            environmentalData.slope
        );


    if (rainfallElement) {

        rainfallElement.textContent =
            Number.isFinite(
                rainfall
            )
                ? rainfall.toFixed(1)
                : "--";
    }


    if (soilMoistureElement) {

        soilMoistureElement.textContent =
            Number.isFinite(
                soilMoisture
            )
                ? soilMoisture.toFixed(1)
                : "--";
    }


    if (slopeElement) {

        slopeElement.textContent =
            Number.isFinite(
                slope
            )
                ? slope.toFixed(1)
                : "--";
    }


    if (statusElement) {

        if (environmentalLevel) {

            statusElement.textContent =
                translateRiskLevel(
                    environmentalLevel
                );

        } else {

            statusElement.textContent =
                t("liveData");
        }
    }
    if (dataTextElement) {

        dataTextElement.textContent =
            `${t("rainfall")}: ${
                Number.isFinite(
                    rainfall
                )
                    ? rainfall.toFixed(1)
                    : "--"
            } | ` +
            `${t("soilMoisture")}: ${
                Number.isFinite(
                    soilMoisture
                )
                    ? soilMoisture.toFixed(1)
                    : "--"
            } | ` +
            `${t("slope")}: ${
                Number.isFinite(
                    slope
                )
                    ? slope.toFixed(1)
                    : "--"
            }°`;
    }
}


/* =====================================================
   REFRESH ENVIRONMENTAL DATA
   ===================================================== */

function refreshEnvironmentNow() {
    return refreshEnvironmentalData();
}


async function refreshEnvironmentalData() {

    if (
        isRefreshingEnvironment
    ) {
        return;
    }


    if (
        !lastRiskRequest
    ) {

        alert(
            currentLanguage === "hi"
                ? "पहले Risk Assessment चलाएं।"
                : "Please run a risk assessment first."
        );

        return;
    }


    isRefreshingEnvironment =
        true;


    const button =
        document.getElementById(
            "refreshEnvironmentBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            currentLanguage === "hi"
                ? "डेटा अपडेट हो रहा है..."
                : "Refreshing...";
    }


    try {

        const response =
            await fetch(
                `${API_URL}/risk`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            lastRiskRequest
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                `API Error: ${response.status}`
            );
        }


        const result =
            await response.json();


        latestRiskResult =
            result;


        updateEnvironmentalMonitoring(
            result.environmental_data,
            result.environmental_level
        );

    } catch (error) {

        console.error(
            "Environmental refresh failed:",
            error
        );


        alert(
            currentLanguage === "hi"
                ? "Environmental data अपडेट नहीं हो सका।"
                : "Environmental data could not be updated."
        );

    } finally {

        isRefreshingEnvironment =
            false;


        if (button) {

            button.disabled =
                false;

            button.textContent =
                currentLanguage === "hi"
                    ? "↻ डेटा रिफ्रेश करें"
                    : "↻ Refresh Data";
        }
    }
}


/* =====================================================
   RISK RESULT
   ===================================================== */

function setRiskResult(
    result
) {

    latestRiskResult =
        result;


    const score =
        Number(
            result?.risk_score
        ) || 0;


    const riskLevel =
        result?.risk_level ||
        "Low";


    const message =
        result?.message ||
        "";


    const riskScoreElement =
        document.getElementById(
            "riskScore"
        );


    const riskLevelElement =
        document.getElementById(
            "riskLevel"
        );


    const riskMessageElement =
        document.getElementById(
            "riskMessage"
        );


    if (riskScoreElement) {

        riskScoreElement.textContent =
            score.toFixed(2);
    }


    if (riskLevelElement) {

        riskLevelElement.textContent =
            translateRiskLevel(
                riskLevel
            );


        riskLevelElement.className =
            `risk-level-display ${riskLevel.toLowerCase()}`;
    }


    if (riskMessageElement) {

        riskMessageElement.textContent =
            message;
    }


    const mlScoreElement =
        document.getElementById(
            "mlScore"
        );


    if (mlScoreElement) {

        mlScoreElement.textContent =
            `${Number(
                result?.ml_score || 0
            ).toFixed(2)}%`;
    }


    const environmentalScoreElement =
        document.getElementById(
            "environmentalScore"
        );


    if (environmentalScoreElement) {

        environmentalScoreElement.textContent =
            Number(
                result?.environmental_score ||
                0
            ).toFixed(2);
    }


    const environmentalLevelElement =
        document.getElementById(
            "environmentalLevel"
        );


    if (environmentalLevelElement) {

        environmentalLevelElement.textContent =
            translateRiskLevel(
                result?.environmental_level ||
                "Low"
            );
    }


    updateScoreBars(
        result
    );


    updateModelExplanation(
        result
    );


    updateEnvironmentalMonitoring(
        result?.environmental_data,
        result?.environmental_level
    );


    updateEarlyWarning(
        result
    );


    updateEnvironmentalText(
        result
    );


    updateLocationText(
        result
    );


    updateRecommendations(
        result
    );


    const resultSection =
        document.getElementById(
            "result"
        );

    if (resultSection) {
        resultSection.classList.remove("hidden");
        resultSection.style.display = "block";
    }
}


/* =====================================================
   SCORE BARS
   ===================================================== */

function updateScoreBars(
    result
) {

    const mlScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    result?.ml_score
                ) || 0
            )
        );


    const environmentalScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    result?.environmental_score
                ) || 0
            )
        );


    const finalScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    result?.risk_score
                ) || 0
            )
        );


    const mlBar =
        document.getElementById(
            "mlScoreBar"
        );


    const environmentalBar =
        document.getElementById(
            "environmentalScoreBar"
        );


    const finalBar =
        document.getElementById(
            "finalScoreBar"
        );


    if (mlBar) {

        mlBar.style.width =
            `${mlScore}%`;
    }


    if (environmentalBar) {

        environmentalBar.style.width =
            `${environmentalScore}%`;
    }


    if (finalBar) {

        finalBar.style.width =
            `${finalScore}%`;
    }
}


/* =====================================================
   ENVIRONMENTAL TEXT
   ===================================================== */

function updateEnvironmentalText(
    result
) {

    const element =
        document.getElementById(
            "environmentalDataText"
        );


    if (!element) {
        return;
    }


    const data =
        result?.environmental_data;


    if (!data) {

        element.textContent =
            t("waiting");

        return;
    }


    const rainfall =
        Number(data.rainfall);


    const soilMoisture =
        Number(
            data.soil_moisture
        );


    const slope =
        Number(data.slope);


    element.textContent =
        `${t("rainfall")}: ${
            Number.isFinite(
                rainfall
            )
                ? rainfall.toFixed(1)
                : "--"
        } | ` +
        `${t("soilMoisture")}: ${
            Number.isFinite(
                soilMoisture
            )
                ? soilMoisture.toFixed(1)
                : "--"
        } | ` +
        `${t("slope")}: ${
            Number.isFinite(
                slope
            )
                ? slope.toFixed(1)
                : "--"
        }°`;
}


/* =====================================================
   LOCATION TEXT
   ===================================================== */

function updateLocationText(
    result
) {

    const location =
        result?.location;


    if (!location) {
        return;
    }


    const element =
        document.getElementById(
            "locationText"
        );


    if (!element) {
        return;
    }


    element.textContent =
        `${location.state || ""}, ${
            location.district || ""
        }`;
}


/* =====================================================
   RECOMMENDATIONS
   ===================================================== */

function updateRecommendations(
    result
) {

    const container =
        document.getElementById(
            "recommendations"
        );


    if (!container) {
        return;
    }


    const recommendations =
        Array.isArray(
            result?.recommendations
        )
            ? result.recommendations
            : [];


    container.innerHTML =
        "";


    if (!recommendations.length) {

        const item =
            document.createElement(
                "li"
            );

        item.textContent =
            currentLanguage === "hi"
                ? "नियमित निगरानी जारी रखें।"
                : "Continue routine monitoring.";

        container.appendChild(
            item
        );

        return;
    }


    recommendations.forEach(
        recommendation => {

            const item =
                document.createElement(
                    "li"
                );

            item.textContent =
                recommendation;

            container.appendChild(
                item
            );
        }
    );
}


/* =====================================================
   EARLY WARNING
   ===================================================== */

function updateEarlyWarning(
    result
) {

    const warningElement =
        document.getElementById(
            "alertMessage"
        );


    if (!warningElement) {
        return;
    }


    const level =
        result?.risk_level ||
        "Low";


    const rainfall =
        Number(
            result?.environmental_data
                ?.rainfall
        ) || 0;


    const soilMoisture =
        Number(
            result?.environmental_data
                ?.soil_moisture
        ) || 0;


    const slope =
        Number(
            result?.environmental_data
                ?.slope
        ) || 0;


    if (
        level === "Critical"
    ) {

        warningElement.textContent =
            currentLanguage === "hi"
                ? "गंभीर जोखिम detected है। क्षेत्र की तत्काल निगरानी और early warning measures की आवश्यकता है।"
                : "Critical risk detected. Immediate monitoring and early warning measures are recommended.";

    } else if (
        level === "High"
    ) {

        warningElement.textContent =
            currentLanguage === "hi"
                ? "उच्च भूस्खलन जोखिम पाया गया है। निगरानी बढ़ाएं और संवेदनशील ढलानों की जांच करें।"
                : "High landslide risk detected. Increase monitoring and inspect vulnerable slopes.";

    } else if (
        level === "Moderate"
    ) {

        warningElement.textContent =
            currentLanguage === "hi"
                ? "मध्यम जोखिम है। मौसम और ढलान की स्थिति पर नियमित निगरानी रखें।"
                : "Moderate risk detected. Continue regular monitoring of weather and slope conditions.";

    } else {

        warningElement.textContent =
            currentLanguage === "hi"
                ? "वर्तमान परिस्थितियों में जोखिम कम है। नियमित निगरानी जारी रखें।"
                : "Current conditions indicate low risk. Continue routine monitoring.";
    }


    if (
        rainfall >= 100 ||
        soilMoisture >= 80 ||
        slope >= 35
    ) {

        warningElement.textContent +=
            currentLanguage === "hi"
                ? " पर्यावरणीय संकेतकों में से एक या अधिक elevated हैं।"
                : " One or more environmental indicators are elevated.";
    }
}


/* =====================================================
   LOCATION AUTO-DETECTION
   ===================================================== */

let locationLookupTimer = null;

async function geocodeAssessmentLocation() {

    const stateElement = document.getElementById("state");
    const districtElement = document.getElementById("district");
    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");

    const state = stateElement?.value.trim() || "";
    const district = districtElement?.value.trim() || "";

    if (!state || !district) {
        return;
    }

    try {
        const query = encodeURIComponent(`${district}, ${state}, India`);

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${query}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Geocoding error: ${response.status}`);
        }

        const results = await response.json();

        if (!results.length) {
            alert(
                currentLanguage === "hi"
                    ? "इस State/District की location नहीं मिली। District का नाम check करें।"
                    : "Location not found for this State/District. Please check the district name."
            );
            return;
        }

        const latitude = Number(results[0].lat);
        const longitude = Number(results[0].lon);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return;
        }

        latitudeElement.value = latitude.toFixed(6);
        longitudeElement.value = longitude.toFixed(6);

        updateMapLocation(
            latitude,
            longitude,
            `<strong>${state}, ${district}</strong><br>Location selected`
        );

        if (landslideMap) {
            landslideMap.setView(
                [latitude, longitude],
                Math.max(10, landslideMap.getZoom())
            );
        }

    } catch (error) {
        console.error("Location geocoding failed:", error);
    }
}

function scheduleLocationLookup() {

    clearTimeout(locationLookupTimer);

    locationLookupTimer = setTimeout(
        geocodeAssessmentLocation,
        700
    );
}

async function reverseGeocodeAssessmentLocation(latitude, longitude) {

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Reverse geocoding error: ${response.status}`);
        }

        const result = await response.json();
        const address = result.address || {};

        const state =
            address.state ||
            address.state_district ||
            "";

        const district =
            address.state_district ||
            address.district ||
            address.county ||
            address.city_district ||
            address.city ||
            "";

        const stateElement = document.getElementById("state");
        const districtElement = document.getElementById("district");
        const latitudeElement = document.getElementById("latitude");
        const longitudeElement = document.getElementById("longitude");

        latitudeElement.value = Number(latitude).toFixed(6);
        longitudeElement.value = Number(longitude).toFixed(6);

        if (stateElement && state) {
            const matchingOption = Array.from(stateElement.options).find(
                option =>
                    option.value.toLowerCase() === state.toLowerCase()
            );

            if (matchingOption) {
                stateElement.value = matchingOption.value;
            }
        }

        if (districtElement && district) {
            districtElement.value = district;
        }

        updateMapLocation(
            latitude,
            longitude,
            `<strong>${state || "Location"}</strong><br>${district || "Selected point"}`
        );

    } catch (error) {
        console.error("Reverse geocoding failed:", error);

        const latitudeElement = document.getElementById("latitude");
        const longitudeElement = document.getElementById("longitude");

        if (latitudeElement) {
            latitudeElement.value = Number(latitude).toFixed(6);
        }

        if (longitudeElement) {
            longitudeElement.value = Number(longitude).toFixed(6);
        }
    }
}

function initializeAutomaticLocationSelection() {

    const stateElement = document.getElementById("state");
    const districtElement = document.getElementById("district");

    if (stateElement) {
        stateElement.addEventListener(
            "change",
            scheduleLocationLookup
        );
    }

    if (districtElement) {
        districtElement.addEventListener(
            "change",
            scheduleLocationLookup
        );

        districtElement.addEventListener(
            "blur",
            scheduleLocationLookup
        );
    }
}


/* =====================================================
   CHECK RISK
   ===================================================== */


async function checkRisk() {

    const state =
        document.getElementById("state")?.value.trim() || "";

    const district =
        document.getElementById("district")?.value.trim() || "";

    const latitude = Number(
        document.getElementById("latitude")?.value
    );

    const longitude = Number(
        document.getElementById("longitude")?.value
    );

    if (!state) {
        alert(
            currentLanguage === "hi"
                ? "कृपया State select करें।"
                : "Please select the state."
        );
        return;
    }

    if (!district) {
        alert(
            currentLanguage === "hi"
                ? "कृपया District दर्ज करें।"
                : "Please enter the district."
        );
        return;
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        await geocodeAssessmentLocation();
    }

    const finalLatitude = Number(
        document.getElementById("latitude")?.value
    );

    const finalLongitude = Number(
        document.getElementById("longitude")?.value
    );

    if (
        !Number.isFinite(finalLatitude) ||
        !Number.isFinite(finalLongitude)
    ) {
        alert(
            currentLanguage === "hi"
                ? "Location के coordinates automatically प्राप्त नहीं हो सके। Map पर location select करें।"
                : "Location coordinates could not be obtained automatically. Please select a location on the map."
        );
        return;
    }

    if (
        finalLatitude < NER_BOUNDS.minLat ||
        finalLatitude > NER_BOUNDS.maxLat ||
        finalLongitude < NER_BOUNDS.minLon ||
        finalLongitude > NER_BOUNDS.maxLon
    ) {
        alert(
            currentLanguage === "hi"
                ? "कृपया North Eastern Region के अंदर का location select करें।"
                : "Please select a location within the North Eastern Region."
        );
        return;
    }

    const button = document.getElementById("checkRisk");

    if (button) {
        button.disabled = true;
        button.textContent =
            currentLanguage === "hi"
                ? "जोखिम जांचा जा रहा है..."
                : "Checking Risk...";
    }

    lastRiskRequest = {
        state,
        district,
        latitude: finalLatitude,
        longitude: finalLongitude,
        material: "Unknown",
        movement_type: "Unknown",
        rainfall: 0,
        soil_moisture: 0,
        slope: 0
    };

    try {
        const response = await fetch(
            `${API_URL}/risk`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(lastRiskRequest)
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        latestRiskResult = result;

        setRiskResult(result);

        addRiskAssessmentToHistory(result);

        updateMapLocation(
            finalLatitude,
            finalLongitude,
            `
                <strong>
                    ${translateRiskLevel(result.risk_level)}
                </strong>
                <br>
                ${t("riskScore")}: ${Number(result.risk_score).toFixed(2)}
                <br>
                ${state}, ${district}
            `
        );

        fillIncidentFromCurrentRisk(result);

    } catch (error) {
        console.error("Risk assessment failed:", error);

        alert(
            currentLanguage === "hi"
                ? "Risk assessment नहीं हो सका। Backend चल रहा है या नहीं, check करें।"
                : "Risk assessment failed. Please check that the backend is running."
        );

    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = t("checkRisk");
        }
    }
}

/* =====================================================
   ANALYTICS LABELS
   ===================================================== */

function translateAnalyticsLabels() {

    const map = {

        "Average Risk Score":
            t("averageRisk"),

        "Highest Risk Score":
            t("highestRisk"),

        "Latest Risk Level":
            t("latestRisk"),

        "Total Locations":
            t("locations"),

        "Risk Distribution":
            t("riskDistribution"),

        "Risk Trend":
            t("riskTrend"),

        "Total Assessments":
            t("totalAssessments")
    };


    document
        .querySelectorAll(
            ".analytics-card span, .analytics-title, .analytics-card h4"
        )
        .forEach(element => {

            const text =
                element.textContent.trim();


            if (
                map[text] !==
                undefined
            ) {

                element.textContent =
                    map[text];
            }
        });
}


/* =====================================================
   POPULATE CURRENT RISK DATA INTO FORM
   ===================================================== */

function populateRiskForm(
    result
) {

    const location =
        result?.location;


    if (!location) {
        return;
    }


    const fields = {

        state:
            location.state,

        district:
            location.district,

        latitude:
            location.latitude,

        longitude:
            location.longitude
    };


    Object.entries(fields)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element &&
                    value !==
                        undefined &&
                    value !== null
                ) {

                    element.value =
                        value;
                }
            }
        );
}


/* =====================================================
   RESET RISK RESULT
   ===================================================== */

function resetRiskResult() {

    const score =
        document.getElementById(
            "riskScore"
        );

    const level =
        document.getElementById(
            "riskLevel"
        );

    const message =
        document.getElementById(
            "riskMessage"
        );


    if (score) {
        score.textContent =
            "--";
    }


    if (level) {
        level.textContent =
            "--";
        level.className =
            "risk-level-display";
    }


    if (message) {
        message.textContent =
            "";
    }


    const mlScore =
        document.getElementById(
            "mlScore"
        );


    if (mlScore) {
        mlScore.textContent =
            "--";
    }


    const environmentalScore =
        document.getElementById(
            "environmentalScore"
        );


    if (environmentalScore) {
        environmentalScore.textContent =
            "--";
    }


    const environmentalLevel =
        document.getElementById(
            "environmentalLevel"
        );


    if (environmentalLevel) {
        environmentalLevel.textContent =
            "--";
    }


    updateEnvironmentalMonitoring(
        null
    );
}


/* =====================================================
   GEOLOCATION
   ===================================================== */

function useCurrentLocation() {

    if (
        !navigator.geolocation
    ) {

        alert(
            currentLanguage === "hi"
                ? "आपके browser में location service उपलब्ध नहीं है।"
                : "Geolocation is not supported by your browser."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                document.getElementById(
                    "latitude"
                );

            const longitude =
                document.getElementById(
                    "longitude"
                );


            if (latitude) {

                latitude.value =
                    position.coords.latitude
                        .toFixed(6);
            }


            if (longitude) {

                longitude.value =
                    position.coords.longitude
                        .toFixed(6);
            }


            updateMapLocation(
                position.coords.latitude,
                position.coords.longitude
            );
        },

        error => {

            console.error(
                "Geolocation error:",
                error
            );


            alert(
                currentLanguage === "hi"
                    ? "Current location प्राप्त नहीं हो सकी।"
                    : "Unable to get your current location."
            );
        },

        {

            enableHighAccuracy:
                true,

            timeout:
                10000,

            maximumAge:
                0
        }
    );
}


/* =====================================================
   DISTRICT AUTO FILTER
   ===================================================== */

function updateDistrictOptions() {

    const stateFilter =
        document.getElementById(
            "mapStateFilter"
        );

    const districtFilter =
        document.getElementById(
            "mapDistrictFilter"
        );


    if (
        !stateFilter ||
        !districtFilter
    ) {
        return;
    }


    const selectedState =
        stateFilter.value;


    const districts =
        [
            ...new Set(

                inventoryData
                    .filter(
                        row =>
                            !selectedState ||
                            row.State ===
                                selectedState
                    )
                    .map(
                        row =>
                            row.District
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    districtFilter.innerHTML =
        `<option value="">${t("allDistricts")}</option>`;


    districts.forEach(
        district => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                district;


            option.textContent =
                district;


            districtFilter.appendChild(
                option
            );
        }
    );
}


/* =====================================================
   UPDATE MAP FILTERED MARKERS
   ===================================================== */

function refreshMapLayers() {

    renderInventoryMarkers();

    loadIncidentReports();

    updateRiskZones();
}


/* =====================================================
   UPDATE UI AFTER LANGUAGE CHANGE
   ===================================================== */

function refreshTranslatedUI() {

    translatePage();

    populateMapFilters();

    updateDistrictOptions();

    refreshMapLayers();


    if (
        latestRiskResult
    ) {

        setRiskResult(
            latestRiskResult
        );
    }
}


/* =====================================================
   INCIDENT FORM RESET
   ===================================================== */

function resetIncidentForm() {

    const fields = [

        "incidentType",
        "incidentSeverity",
        "incidentLatitude",
        "incidentLongitude",
        "incidentDescription"
    ];


    fields.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {
                return;
            }


            if (
                element.tagName ===
                "SELECT"
            ) {

                element.selectedIndex =
                    0;

            } else {

                element.value =
                    "";
            }
        }
    );
}


/* =====================================================
   ATTACH EVENT LISTENERS
   ===================================================== */

function setupEventListeners() {

    const checkButton =
        document.getElementById(
            "checkRisk"
        );


    // Check Risk is already connected through onclick="checkRisk()" in the supplied HTML.
    // Do not attach a second listener here.



    const clearHistoryButton =
        document.getElementById(
            "clearHistoryBtn"
        );


    if (clearHistoryButton) {

        clearHistoryButton.addEventListener(
            "click",
            clearRiskHistory
        );
    }


    const historyFilter =
        document.getElementById(
            "historyRiskFilter"
        );


    if (historyFilter) {

        historyFilter.addEventListener(
            "change",
            renderRiskHistory
        );
    }


    const reportIncidentButton =
        document.getElementById(
            "reportIncidentBtn"
        );


    // Incident submit is already connected through onclick="reportIncident()" in the supplied HTML.
    // Do not attach a second listener here.



    const useLocationButton =
        document.getElementById(
            "useCurrentLocationBtn"
        );


    if (useLocationButton) {

        useLocationButton.addEventListener(
            "click",
            useCurrentLocation
        );
    }


    const resetIncidentButton =
        document.getElementById(
            "resetIncidentBtn"
        );


    if (resetIncidentButton) {

        resetIncidentButton.addEventListener(
            "click",
            resetIncidentForm
        );
    }


    const refreshEnvironmentButton =
        document.getElementById(
            "refreshEnvironmentBtn"
        );


    // Refresh Data is already connected through onclick="refreshEnvironmentNow()" in the supplied HTML.



    const mapStateFilter =
        document.getElementById(
            "mapStateFilter"
        );


    if (mapStateFilter) {

        mapStateFilter.addEventListener(
            "change",
            () => {

                updateDistrictOptions();

                renderInventoryMarkers();
            }
        );
    }


    const mapDistrictFilter =
        document.getElementById(
            "mapDistrictFilter"
        );


    if (mapDistrictFilter) {

        mapDistrictFilter.addEventListener(
            "change",
            renderInventoryMarkers
        );
    }
}


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createLanguageToggle();


        initializeMap();


        updateRiskHistoryAnalytics();


        renderRiskHistory();


        updateRiskTrendChart();


        setupEventListeners();


        translatePage();


        updateEnvironmentalMonitoring(
            null
        );


        const history =
            getRiskHistory();


        if (
            history.length
        ) {

            updateRiskZones();
        }


        const reports =
            getIncidentReports();


        if (
            reports.length
        ) {

            loadIncidentReports();
        }
    }
);


/* =====================================================
   GLOBAL ERROR HANDLING
   ===================================================== */

window.addEventListener(
    "error",
    event => {

        console.error(
            "LandGuard frontend error:",
            event.error ||
                event.message
        );
    }
);


window.addEventListener(
    "unhandledrejection",
    event => {

        console.error(
            "LandGuard async error:",
            event.reason
        );
    }
);


/* =====================================================
   API STATUS CHECK
   ===================================================== */

async function checkBackendStatus() {

    try {

        const response =
            await fetch(
                `${API_URL}/health`
            );


        if (!response.ok) {
            throw new Error(
                "Backend unavailable"
            );
        }


        const data =
            await response.json();


        console.log(
            "LandGuard backend:",
            data
        );


        return true;

    } catch (error) {

        console.warn(
            "LandGuard backend is not reachable:",
            error
        );


        return false;
    }
}


/* =====================================================
   INITIAL BACKEND CHECK
   ===================================================== */

setTimeout(
    () => {

        checkBackendStatus();

    },
    500
);
