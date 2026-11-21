# 📱 Parametric Phone Wall & Table Clock Enclosure Generator

An interactive, 100% client-side 3D web application to generate custom-tailored, 3D-printable enclosures for repurposing old and spare smartphones into retro-modern bedside and wall digital clocks.

🔗 **Live Web App**: [https://tumesh007.github.io/phone-wall-clock-enclosure-generator/](https://tumesh007.github.io/phone-wall-clock-enclosure-generator/)

---

## 🌟 Key Features

- **Real-Time Client-Side 3D CAD Preview**: Uses Three.js and high-performance Constructive Solid Geometry (`three-bvh-csg`) to render the stepped CRT-style front bezel, honeycomb ventilation backplate, and 15° wedge desk stand with pass-through cabling.
- **Bambu Lab A1 Mini Build-Plate Validator**:
  - Displays a realistic $180 \times 180\text{ mm}$ build-plate footprint with wireframe build volume bounds.
  - Live status badge verifies whether your configured phone model fits in a single piece (straight or rotated $45^\circ$ diagonally) or requires two-part printing.
- **25+ Curated Smartphone Presets**:
  - Covers popular models from Apple (iPhone 12–16, mini, SE, Pro Max), Samsung (Galaxy S/A/M series, Ultra), Google Pixel (7–9 Pro XL), OnePlus, Nothing, Xiaomi/Redmi, and Realme.
  - Pre-calibrated active display window dimensions derived from display diagonal and aspect ratio to ensure phone bezels remain hidden while clock digits stay 100% visible.
- **Instant Client-Side Binary STL Export**:
  - Download individual print-oriented parts: Main Housing (face-down), Honeycomb Backplate, Desk Stand, or Complete Assembly.
- **Dynamic Parametric OpenSCAD Export**:
  - Export clean, parameterized `.scad` source code formatted with your exact customized dimensions and tolerance values.
- **Dual-Purpose Table Stand + Flush Wall Mount**:
  - **Table Clock Mode**: Docks into a detachable 15° wedge stand with cable pass-through arch and speaker relief ports.
  - **Wall Mount Mode**: Backplate features dual keyhole slots spaced $80.0\text{ mm}$ apart for M3.5/#6 screws, plus recessed pockets for damage-free 3M Command picture hanging strips.

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
| **Supports** | **DISABLED (None)** | All chamfers $\le 45^\circ$ and bridges span cleanly |

### Print Orientations:
1. **Main Housing**: Print **face-down** on a textured PEI plate. This ensures a beautiful matte textured finish across the front bezel.
2. **Backplate**: Print **flat on build plate**.
3. **Desk Stand**: Print **flat on its base**.

---

## 🛠️ Adding New Phone Models

To add custom smartphone models, open `src/data/presets.json` and add a new entry:

```json
{
  "id": "my-phone-model",
  "brand": "BrandName",
  "name": "Model Name",
  "bodyLength": 160.0,
  "bodyWidth": 76.0,
  "bodyThickness": 8.0,
  "cornerRadius": 10.0,
  "screenLength": 150.0,
  "screenWidth": 68.0,
  "screenCornerRadius": 8.0,
  "screenOffsetX": 0.0,
  "screenOffsetY": 0.0,
  "usbSide": "right",
  "usbOffset": 0.0,
  "notes": "Display size, resolution, and connector details"
}
```

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

MIT License. Designed with OpenSCAD and Three.js.
