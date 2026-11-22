# Parametric 3D Phone Wall & Echo Show 5 Clock Enclosure Studio

Zero-backend browser STL & OpenSCAD generator for repurposing smartphones (defaulting to **Realme 1**) into a clean **2-part standalone wall or tabletop digital clock**.

🔗 **Live Web App**: [https://tumesh007.github.io/phone-wall-clock-enclosure-generator/](https://tumesh007.github.io/phone-wall-clock-enclosure-generator/)

---

## 🌟 Dual Enclosure Form Factors

Switch seamlessly between two distinct parametric enclosure designs side-by-side:

1. **`v1: Wall & Table Box`** (`enclosureStyle = "wall_box"`):
   - Slim flush profile with weighted bottom foot ($22\text{ mm}$ depth).
   - Dual drywall keyhole slots spaced for standard M3.5/#6 wall screws.
   - Dual 3M Command strip recesses for damage-free hanging.
   - Clean, modern picture-frame aesthetic for bedside tables or wall mounting.

2. **`v2: Echo Show 5 Wedge`** (`enclosureStyle = "echoshow"`):
   - Ergonomic $18^\circ$ angled desk stand for optimal viewing angles on nightstands and desks.
   - Sculpted acoustic rear wedge with deep anti-tip base foot ($18.0\text{ mm}$ top to $48.5\text{ mm}$ base).
   - Rear pass-through ventilation and cable management.

---

## 🖨️ Bambu Lab A1 Mini Slicing & Calibration Profile

Both architectures are engineered to print **completely support-free** directly on the **$180 \times 180\text{ mm}$** build volume of the Bambu Lab A1 Mini.

### 1. Build Plate & Material Setup
- **Build Plate**: WOL3D Gold Textured PEI Plate (matte cosmetic front finish, zero glue stick required).
- **Material Selection**:
  - **PETG (Recommended)**: Nozzle $245^\circ\text{C}$ • Bed $65^\circ\text{C}$ • Part Fan $40\% - 50\%$. Eliminates thermal softening during 24/7 continuous phone charging.
  - **PLA (Alternative)**: Nozzle $215^\circ\text{C}$ • Bed $55^\circ\text{C}$ • Part Fan $100\%$.

### 2. Slicer Parameters

| Parameter | Part 1: Main Clock Body | Part 2: Hex Back Cover | Metric Corner Fasteners |
| :--- | :--- | :--- | :--- |
| **Print Orientation** | **Face-down** ($Z = 0$, screen bezel on bed) | **Flat** ($Z = 0$) | Head / hex face flat on bed |
| **Supports** | **DISABLED (0% / None)** | **DISABLED (0% / None)** | **DISABLED (0% / None)** |
| **Layer Height** | `0.20 mm` Standard | `0.20 mm` Standard | `0.12 mm` High Detail (for 0.5mm pitch) |
| **Wall Generator** | Classic / Arachne | Classic / Arachne | **Arachne** (mandatory for clean threads) |
| **Wall Loops** | `4` loops (reinforces M3 boss) | `4` loops (100% solid struts) | `6` loops (100% solid shank) |
| **Top / Bottom Shells** | 4 Top / 4 Bottom | 4 Top / 4 Bottom | 5 Top / 5 Bottom |
| **Infill Density & Pattern** | `20% Gyroid` | `25% Gyroid` | `100% Rectilinear` |
| **Outer Wall Speed** | $60 - 80\text{ mm/s}$ | $60 - 80\text{ mm/s}$ | $25 - 30\text{ mm/s}$ (prevents curling) |
| **Seam Alignment** | Aligned / Rear | Aligned | **Random** (prevents thread binding) |

---

## 🔩 Fastener Engineering & Screw Length Specifications

The back cover secures with 4 corner countersunk M3 screws. Because `v1` and `v2` have different internal depths, observe the fastener length rules:

| Form Factor | Top 2 Corner Holes | Bottom 2 Corner Holes | Critical Warning |
| :--- | :--- | :--- | :--- |
| **`v1: Wall Box`** ($22\text{ mm}$ depth) | **M3 × 12 mm** | **M3 × 12 mm** | Uniform $17.6\text{ mm}$ boss height. $10.7\text{ mm}$ shank penetration leaves $5.9\text{ mm}$ safety margin. |
| **`v2: Echo Show 5`** ($18^\circ$ wedge) | **M3 × 12 mm** *(or 10 mm)* | **M3 × 12 mm** *(standard)* or **M3 × 16 mm / 20 mm** *(heavy-duty)* | ⚠️ **Top bosses are only $16.8\text{ mm}$ tall.** Screws $>14\text{ mm}$ at the top **WILL BOTTOM OUT** and punch through the front cosmetic bezel! |

### Fastener Choice for v2 Echo Show 5:
- **Uniform Setup (Simplest)**: 4× **M3 × 12 mm** countersunk screws. The $10.7\text{ mm}$ thread bite into the bottom bosses provides $>450\text{ N}$ tensile retention, perfectly adequate for bedside and desktop use.
- **Deep-Anchor Base Setup**: 2× **M3 × 12 mm** (Top) + 2× **M3 × 16 mm** or **M3 × 20 mm** (Bottom) for maximum structural anchoring against desk vibration.

*Printable binary STLs for `M3x12mm`, `M3x16mm`, `M3x20mm` countersunk screws and `M3_Hex_Nut` are included in the repository deliverables.*

---

## 📐 Dimensional Calibration & Assembly

1. **Alignment Verification**: Print `Phone_Clock_Screw_Set_and_Alignment_Check_Sheet.pdf` at $100\%$ scale (do NOT scale to fit page). Verify the $100\text{ mm}$ calibration bar with a digital caliper.
2. **Body Check**: Place printed Part 1 over the outline to verify the $175.3\text{ mm}$ outer length and $151.4\text{ mm}$ corner hole center-to-center spacing.
3. **Cable Drop**: Connect the right-angle Micro-USB or USB-C charging cable through the dedicated rear pass-through channel ($15.0 \times 9.5\text{ mm}$).
4. **Fastening**: Secure Part 2 hex cover with corner screws. Tighten by hand with light torque ($0.4 - 0.6\text{ N}\cdot\text{m}$) to prevent stripping 3D printed internal threads.

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
