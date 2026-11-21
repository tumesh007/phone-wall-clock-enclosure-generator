# 📱 Parametric Phone Wall & Table Clock Enclosure Generator

An interactive, 100% client-side 3D web application to generate custom-tailored, 3D-printable **2-part standalone clock enclosures** for repurposing smartphones into retro-modern bedside and wall digital clocks.

🔗 **Live Web App**: [https://tumesh007.github.io/phone-wall-clock-enclosure-generator/](https://tumesh007.github.io/phone-wall-clock-enclosure-generator/)

---

## 🌟 True 2-Part Standalone Clock Housing

Unlike tight snap-on phone cases, this project generates a chunky, self-standing desk and wall clock frame in **two unified pieces**:

1. **Part 1: Front Faceplate + Body + Table Base Foot (`main_clock_body`)**:
   - **Prints face-down** flat on the build plate with **zero supports**.
   - **Front Face**: Thick bezel ($\ge 2.8\text{ mm}$) with an **Active Screen Cutout** that frames only the display, cleanly hiding phone bezels.
   - **Open-Backed Pocket**: Phones drop straight into the rear cavity without bending or flexing around a tight case.
   - **Chunky Table Foot**: Flat bottom foot ($24\text{ mm}$ depth) allows the clock to stand upright on any nightstand or desk without tipping.
   - **Open Rear-Drop Ports**: USB-C cable channel and bottom speaker slots are open toward the rear edge so a plugged-in phone drops straight into place.
   - **4 Corner M3 Screw Bosses**: Anchors the back cover firmly.

2. **Part 2: Flat Hexagonal Mesh Back Cover (`hex_back_cover`)**:
   - Single flat closing plate ($3.0\text{ mm}$) that seats flush into the rear perimeter step.
   - **Hexagonal Honeycomb Grid**: Maximum airflow directly over the battery and CPU for 24/7 continuous clock display.
   - **Dual Keyhole Wall Mounts**: Spaced $80.0\text{ mm}$ apart for standard M3.5/#6 wall screws.
   - **Dual 3M Command Strip Recesses**: Flat landing pads for damage-free hanging.
   - **4 Corner Countersunk Screw Holes**: Fastens into the main clock body.

---

## 🖨️ 3D Printing & Slicing Recommendations

Every component has been engineered to print **completely support-free**!

| Parameter | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Material** | **PETG** (or PLA) | PETG provides superior heat resistance for 24/7 charging and display operation |
| **Layer Height** | `0.20 mm` | Standard profile |
| **Wall Loops / Perimeters** | `4` | Solid $1.6\text{ mm}$ outer walls |
| **Top / Bottom Shells** | `5` Top, `4` Bottom | Clean surface finish |
| **Infill** | `15% - 20% Gyroid` | Optimum strength-to-weight ratio |
| **Supports** | **DISABLED (None)** | Main body prints face-down; Back cover prints flat |

---

## 📊 Bambu Lab A1 Mini Compatibility

- Both Part 1 (`main_clock_body`) and Part 2 (`hex_back_cover`) fit well within the **$180 \times 180\text{ mm}$** build volume for standard smartphones (e.g. Realme 1, iPhone 15/16, Galaxy S24, Pixel 8/9).
- The web app includes a real-time validator checking straight and 45° diagonal fit margins.

---

## 🛠️ Adding New Phone Models

To add custom smartphone models, open `src/data/presets.json` and add an entry with:
- `bodyLength`, `bodyWidth`, `bodyThickness`, `cornerRadius` (for internal cavity)
- `screenLength`, `screenWidth`, `screenCornerRadius`, `screenOffsetY` (for front window cutout)

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/tumesh007/phone-wall-clock-enclosure-generator.git
cd phone-wall-clock-enclosure-generator

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

MIT License. Designed with OpenSCAD, Three.js, and React.
