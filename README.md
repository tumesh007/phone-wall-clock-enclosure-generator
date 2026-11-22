# Parametric 3D Phone Wall & Echo Show 5 Clock Enclosure Studio

Zero-backend browser STL & OpenSCAD generator for repurposing smartphones (defaulting to **Realme 1**) into a clean **2-part standalone wall or tabletop digital clock**.

🔗 **Live Web App**: [https://tumesh007.github.io/phone-wall-clock-enclosure-generator/](https://tumesh007.github.io/phone-wall-clock-enclosure-generator/)

---

## 🌟 Dual Enclosure Form Factors

Switch seamlessly between two distinct parametric enclosure designs side-by-side:

1. **`v1: Wall & Table Box`** (`enclosureStyle = 'wall_box'`):
   - Slim flush profile with weighted bottom foot ($22\text{ mm}$ depth).
   - Dual drywall keyhole slots spaced for standard M3.5/#6 wall screws.
   - Dual 3M Command strip recesses for damage-free hanging.
   - Clean, modern picture-frame aesthetic for bedside tables or wall mounting.

2. **`v2: Echo Show 5 Wedge`** (`enclosureStyle = 'echoshow'`):
   - Ergonomic $18^\circ$ angled desk stand for optimal viewing angles on nightstands and desks.
   - Sculpted acoustic rear wedge with deep anti-tip base foot.
   - Rear pass-through ventilation and cable management.

---

## 🖨️ Zero-Support 2-Part 3D Printing

Both architectures are engineered to print **completely support-free**:

- **Part 1 (`main_clock_body`)**: Prints **face-down** on the build plate with **zero supports**. Front face features an active screen cutout that conceals phone bezels and chin. Internal centering ribs snugly position the phone while keeping rear-drop charging and speaker channels open.
- **Part 2 (`hex_back_cover`)**: Prints **flat** on the build plate. Features a hexagonal honeycomb mesh for 24/7 heat dissipation over the phone battery and CPU, securing flush into the rear step with 4 corner M3 screws.

| Parameter | Recommended Setting |
| :--- | :--- |
| **Material** | **PETG** (superior heat resistance for continuous charging) or PLA |
| **Layer Height** | `0.20 mm` |
| **Perimeters / Walls** | `3` to `4` |
| **Infill** | `15% - 20% Gyroid` |
| **Supports** | **None (0% / Disabled)** |

---

## 📊 Bambu Lab A1 Mini Compatibility

- The web app dynamically verifies the enclosure footprint against the **$180 \times 180\text{ mm}$** build volume of the Bambu Lab A1 mini.
- Standard smartphones (e.g. Realme 1, iPhone 16/15, Galaxy S25/S24, Pixel 9/8) fit straight or on a $45^\circ$ diagonal.

---

## 📱 Smartphone Presets (`presets.json`)

To add new smartphone models, edit `presets.json`:

```json
{
  "group": "Brand",
  "name": "Model Name",
  "bodyL": 156.5,
  "bodyW": 75.2,
  "bodyT": 7.8,
  "bodyR": 8.5,
  "screenL": 137.0,
  "screenW": 68.5,
  "screenR": 2.0,
  "offsetX": 0.0,
  "offsetY": 1.2
}
```

---

## 📄 License

MIT License. Designed with OpenSCAD, Three.js, and Tailwind CSS.
