# Dragon Sovereign Homestead — Integrated Self-Sufficiency Dashboard

## Vision

Dragon Sovereign Homestead is a comprehensive monitoring, control, and automation platform for a fully integrated, self-sufficient homestead. The philosophy is solarpunk: high-tech but organic, green but powerful, peaceful but defended.

Every system connects to every other system. Solar powers the aquaponics. Aquaponics feeds the biodigester. The biodigester produces gas for cooking and fertilizer for the food forest. The food forest feeds the community. The community sustains the mission. Nothing is wasted. Everything cycles.

This project starts with software architecture and data modeling, with hardware integration rolling out as prototypes come online. The full systems blueprint is documented in `dragon_sovereign_homestead.html`.

## Domains

The homestead is organized into six interconnected domains:

### Energy Independence
Solar panels, LiFePO4 battery bank, biogas digester, and micro-wind turbine. Three redundant energy sources, zero grid dependency. An energy management AI monitors all flows, predicts consumption, and routes power automatically.

### Food Production
Aquaponics (tilapia + vegetables), food forest (mango, avocado, banana, citrus), automated chicken coop (eggs + fertilizer), vertical garden towers (leafy greens), and mushroom cultivation. Year-round production for household and restaurant.

### Water Sovereignty
Rainwater harvesting (roof catchment + cistern), greywater recycling for irrigation, biosand filtration for potable water, and atmospheric water generation via solar-powered Peltier condensers. Multiple sources, closed-loop usage.

### Communications & AI
LoRa mesh network (2-10km range, no ISP dependency), local AI server (Ollama + open-source LLMs), self-hosted encrypted messaging (Matrix/Signal), and an offline knowledge library (Kiwix + Wikipedia). Full information sovereignty.

### Perimeter Defense
ESP32 thermal/visual sensor mesh, automated deterrence systems (lights, acoustic, fog), autonomous patrol rovers, reinforced safe room, and aerial reconnaissance drones. Layered security with no single point of failure.

### Workshop & Fabrication
3D printing, CNC milling, electronics workbench, welding station, and parts inventory. The ability to manufacture, repair, and invent.

## System Flows

The value of the homestead is in the interconnections:

- **Solar -> Battery -> Everything** — One energy source sustains every other system.
- **Chickens -> Manure -> Biogas + Fertilizer -> Food Forest** — Waste becomes fuel and fertilizer.
- **Rain -> Cistern -> Aquaponics -> Gardens** — One raindrop does four jobs.
- **Food Production -> Restaurant -> Revenue -> More Systems** — The business and the homestead feed each other.
- **Sensors -> Local AI -> Analysis -> Optimization** — The homestead gets smarter over time without sending data to anyone.
- **Defense -> Awareness -> Network -> Community** — Sovereignty scales from household to community.

## Technology Stack

- **Frontend:** React 19 + Vite + Material UI 7 + Redux Toolkit (RTK Query) + Nivo charts
- **Backend:** Node.js + Express 5 + Prisma ORM
- **Database:** PostgreSQL (hosted on Neon.tech)
- **IoT Layer:** ESP32 sensors -> MQTT -> Raspberry Pi gateway -> REST API / WebSockets
- **Communication Protocols:** MQTT for IoT messaging, HTTPS for API, WebSockets for real-time dashboard updates, LoRa for mesh networking

## Architecture

The system is designed with a layered approach:

1. **Sensing Layer** — Sensors (pH, temperature, water level, motion, power, etc.) deployed across all domains.
2. **Microcontroller Layer** — ESP32 modules collect sensor data, perform edge processing, and control local actuators.
3. **Gateway Layer** — Raspberry Pi aggregates data from ESP32 nodes via MQTT, manages local logging, and serves as the secure network gateway.
4. **Backend Layer** — Node.js/Express API handles data validation, storage via Prisma + PostgreSQL, authentication, alert processing, and actuator command dispatch.
5. **Dashboard Layer** — React SPA provides real-time visualization, historical analysis, system control, and alert management across all domains.

## Project Status

- **Current Phase:** Foundation — designing ERD, domain architecture, and vertical slice plan.
- **Implemented:** Aquaponics water level monitoring (sensor ingestion -> storage -> dashboard with charts).
- **In Progress:** Sequelize to Prisma migration, full database schema design across all six domains.
- **Next:** Shared infrastructure (auth, sensor pipeline, alert engine), then domain-by-domain vertical slices.

## Development Approach

- **Schema-first** — All entities and relationships defined in Prisma before application code.
- **Vertical slices** — Each feature delivers a complete capability across the full stack (sensor -> API -> database -> dashboard) rather than building layers horizontally.
- **Domain blueprints** — Each domain is documented with its entities, data flows, and connections to other domains before implementation begins.

## Future Goals

- Complete the full-stack monitoring and control platform across all six domains.
- Deploy hardware prototypes with ESP32 sensor networks and Raspberry Pi gateways.
- Integrate machine learning for predictive analytics (crop health, energy optimization, anomaly detection).
- Build community mesh networking for shared awareness across allied homesteads.
- Document the build process via YouTube series covering DIY aquaponics, solar, IoT, and homestead automation.
- Open-source reusable components (ESP32 sensor modules, dashboard widgets) for the homesteading community.

## Contributing

This is a personal project under active development. The journey and framework will be documented for fellow homesteaders interested in integrating technology into self-sufficient living.
