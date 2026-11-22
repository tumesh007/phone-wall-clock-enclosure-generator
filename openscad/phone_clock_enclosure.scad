// ============================================================================
// Parametric 2-Part Phone Wall & Echo Show 5 Tabletop Clock Enclosure
// Default Preset: Realme 1 (CPH1859 / CPH1861)
//
// Enclosure Styles:
//   "echoshow" : Echo Show 5 inspired angled wedge desk stand (default 18 deg tilt,
//                sculpted tapered acoustic rear body, flat desk foot, zero supports)
//   "wall_box" : Slim flush wall-mount & upright tabletop box with keyhole slots
//
// Print Orientation (Zero Supports in BOTH modes):
//   Part 1 (main_clock_body): Face-down on build plate (Z=0 is front bezel face)
//   Part 2 (hex_back_cover):  Flat on build plate
// ============================================================================

enclosure_style = "wall_box"; // "wall_box" (v1: Wall & Table Box) or "echoshow" (v2: Echo Show 5 Wedge)
part_to_render  = "both";     // "part1", "part2", "both", "assembled"

// 1. Phone Body Dimensions (Landscape: Length = Horizontal X, Width = Vertical Y)
phone_length   = 156.5;   // mm
phone_width    = 75.2;    // mm
phone_thick    = 7.8;     // mm
phone_corner_r = 8.5;     // mm

// 2. Fit & Case Allowance
case_allowance = 0.0;     // mm (0 = bare, 1.8 = slim case, 3.5 = rugged)
fit_tolerance  = 0.4;     // mm per side clearance

// 3. Active Screen Cutout (Hides physical bezels / chin)
screen_length   = 137.0;  // mm
screen_width    = 68.5;   // mm
screen_corner_r = 2.0;    // mm
screen_offset_x = 0.0;    // mm
screen_offset_y = 1.2;    // mm

// 4. Housing, Bezel & Echo Show 5 Wedge Geometry
bezel_thick        = 2.6;   // mm (>= 2.4 mm solid front faceplate)
wall_thick         = 2.8;   // mm perimeter wall thickness
outer_frame_margin = 9.0;   // mm clean clock frame border around pocket
outer_corner_r     = 11.0;  // mm

// Echo Show 5 Wedge Parameters (used when enclosure_style == "echoshow")
tilt_angle_deg     = 18.0;  // deg backward screen tilt (15-22 deg ideal for desk)
wedge_top_depth    = 18.0;  // mm front-to-back depth at top edge
// Base depth is automatically derived from tilt_angle_deg & height, or floored at min_base_depth:
min_base_depth     = 22.0;  // mm (wall_box uses this directly)

// 5. Rear-Open Charging & Speaker Channels
cable_side     = "right"; // "right", "left", "bottom"
cable_slot_w   = 15.0;    // mm
cable_slot_h   = 9.5;     // mm
speaker_slots  = true;

// 6. Part 2 Hexagonal Mesh Back Cover & Mounting
cover_thick     = 2.6;    // mm
cover_lip_depth = 3.0;    // mm recessed seat in rear of Part 1
cover_clearance = 0.25;   // mm radial clearance
hex_cell_size   = 9.0;    // mm
hex_strut_w     = 2.2;    // mm
screw_hole_d    = 3.2;    // mm M3 clearance hole

$fn = 64;

// Derived Dimensions
pocket_x = phone_length + 2 * (case_allowance + fit_tolerance);
pocket_y = phone_width  + 2 * (case_allowance + fit_tolerance);
pocket_r = phone_corner_r + case_allowance + fit_tolerance;

outer_x  = pocket_x + 2 * outer_frame_margin;
outer_y  = pocket_y + 2 * outer_frame_margin;

min_pocket_z = bezel_thick + phone_thick + 2*case_allowance + cover_lip_depth + 2.5;
top_z   = (enclosure_style == "echoshow")
          ? max(wedge_top_depth, min_pocket_z)
          : max(min_base_depth, min_pocket_z);

// For Echo Show 5 wedge: bottom is deeper than top by outer_y * tan(tilt_angle_deg)
bot_z   = (enclosure_style == "echoshow")
          ? max(min_base_depth, top_z + outer_y * tan(tilt_angle_deg))
          : top_z;

cover_x = pocket_x + 2 * wall_thick - 2 * cover_clearance;
cover_y = pocket_y + 2 * wall_thick - 2 * cover_clearance;
cover_r = max(2.0, pocket_r + wall_thick - cover_clearance);

module rrect_2d(w, h, r) {
    rc = min(r, min(w, h)/2 - 0.01);
    offset(r = rc) offset(delta = -rc) square([w, h], center = true);
}

module keyhole_2d() {
    union() {
        translate([0, -4.5]) circle(d = 8.5);
        hull() {
            translate([0, -4.5]) circle(d = 4.5);
            translate([0, 5.5])  circle(d = 4.5);
        }
    }
}

// Outer shell: either rectangular prism (wall_box) or Echo Show 5 tapered acoustic wedge
module outer_shell_solid() {
    if (enclosure_style == "echoshow") {
        // Intersection of rounded front profile and side-view Echo Show 5 wedge trapezoid
        // Rear face tapers inward toward top while keeping a flat angled plane for Part 2!
        intersection() {
            linear_extrude(height = bot_z + 1.0)
                rrect_2d(outer_x, outer_y, outer_corner_r);

            // Side-profile wedge in YZ plane extruded along X
            rotate([90, 0, 90])
                linear_extrude(height = outer_x + 2.0, center = true)
                    polygon(points = [
                        [-outer_y/2, 0],
                        [ outer_y/2, 0],
                        [ outer_y/2, top_z],
                        [-outer_y/2, bot_z]
                    ]);
        }
    } else {
        linear_extrude(height = top_z)
            rrect_2d(outer_x, outer_y, outer_corner_r);
    }
}

// Helper transform that aligns any rear-cover operation onto the tilted back plane of Echo Show 5
// In face-down print coordinates: front is Z=0; back plane passes through (y=0, z=(top_z+bot_z)/2)
// with tilt angle alpha = atan2(bot_z - top_z, outer_y) around X axis.
tilt_actual = atan2(bot_z - top_z, outer_y);
mid_z = (top_z + bot_z) / 2;

module on_back_plane() {
    translate([0, 0, mid_z])
        rotate([-tilt_actual, 0, 0])
            children();
}

module part1_main_clock_body() {
    difference() {
        outer_shell_solid();

        // 1. Active Screen Window Cutout through Front Faceplate (Z = -0.1 to bezel_thick + 0.1)
        translate([screen_offset_x, screen_offset_y, -0.1])
            linear_extrude(height = bezel_thick + 0.2)
                rrect_2d(screen_length, screen_width, screen_corner_r);

        // 2. Open-Backed Interior Phone Pocket (starts at Z = bezel_thick, open through rear)
        translate([0, 0, bezel_thick])
            linear_extrude(height = bot_z + 2.0)
                rrect_2d(pocket_x, pocket_y, pocket_r);

        // 3. Recessed Rear Lip Seat aligned flush with the rear face (tilted in Echo Show mode!)
        on_back_plane()
            translate([0, 0, -cover_lip_depth])
                linear_extrude(height = cover_lip_depth + 4.0)
                    rrect_2d(cover_x + 2*cover_clearance, cover_y/cos(tilt_actual) + 2*cover_clearance, cover_r + cover_clearance);

        // 4. Rear-Open Charging Cable Channel (drop-in from rear with cable plugged in)
        slot_z_start = bezel_thick + (phone_thick + 2*case_allowance)/2 - cable_slot_h/2;
        if (cable_side == "right") {
            translate([outer_x/2 - (outer_x - pocket_x)/4, 0, slot_z_start + bot_z/2])
                cube([(outer_x - pocket_x)/2 + 2.0, cable_slot_w, bot_z], center = true);
        } else if (cable_side == "left") {
            translate([-outer_x/2 + (outer_x - pocket_x)/4, 0, slot_z_start + bot_z/2])
                cube([(outer_x - pocket_x)/2 + 2.0, cable_slot_w, bot_z], center = true);
        } else {
            translate([0, -outer_y/2 + (outer_y - pocket_y)/4, slot_z_start + bot_z/2])
                cube([cable_slot_w, (outer_y - pocket_y)/2 + 2.0, bot_z], center = true);
        }

        // 5. Rear-Open Bottom Speaker / Acoustic Vent Slots
        if (speaker_slots) {
            for (sx = [-pocket_x*0.28, pocket_x*0.28]) {
                translate([sx, -outer_y/2 + (outer_y - pocket_y)/4, slot_z_start + bot_z/2])
                    cube([12.0, (outer_y - pocket_y)/2 + 2.0, bot_z], center = true);
            }
        }
    }

    // Subtle internal centering ribs (4 sides)
    rib_h = phone_thick + 2*case_allowance;
    for (sx = [-1, 1]) {
        if (!(cable_side == "right" && sx == 1) && !(cable_side == "left" && sx == -1)) {
            translate([sx * (pocket_x/2 - 0.25), 0, bezel_thick + rib_h/2])
                cube([0.5, 14.0, rib_h], center = true);
        }
    }
    for (sy = [-1, 1]) {
        if (!(cable_side == "bottom" && sy == -1)) {
            translate([0, sy * (pocket_y/2 - 0.25), bezel_thick + rib_h/2])
                cube([18.0, 0.5, rib_h], center = true);
        }
    }

    // 4 Corner M3 Bosses trimmed cleanly at cover seat plane
    cov_y_eff = cover_y / cos(tilt_actual);
    intersection() {
        union() {
            for (sx = [-1, 1], sy = [-1, 1]) {
                bx = sx * (cover_x/2 - 5.5);
                by = sy * (pocket_y/2 - 3.8);
                translate([bx, by, bezel_thick]) {
                    difference() {
                        cylinder(h = bot_z, d = 7.5);
                        translate([0, 0, 1.0])
                            cylinder(h = bot_z, d = 2.85);
                    }
                }
            }
        }
        on_back_plane()
            translate([0, 0, -bot_z - cover_lip_depth])
                cube([outer_x*2, outer_y*2, bot_z*2], center = true);
    }
}

module part2_hex_back_cover() {
    cov_y_eff = cover_y / cos(tilt_actual);
    pitch_x = (hex_cell_size + hex_strut_w) * 0.866025;
    pitch_y = (hex_cell_size + hex_strut_w);
    nx = floor((cover_x - 36) / pitch_x);
    ny = floor((cov_y_eff - 24) / pitch_y);

    difference() {
        linear_extrude(height = cover_thick)
            rrect_2d(cover_x, cov_y_eff, cover_r);

        // Hexagonal Honeycomb Ventilation Mesh
        translate([0, 0, -0.1])
            linear_extrude(height = cover_thick + 0.2)
                difference() {
                    union() {
                        for (ix = [-nx/2 : 1 : nx/2]) {
                            for (iy = [-ny/2 : 1 : ny/2]) {
                                hx = ix * pitch_x;
                                hy = iy * pitch_y + ((abs(round(ix)) % 2 == 1) ? pitch_y/2 : 0);
                                if (abs(hx) < (cover_x/2 - 18) && abs(hy) < (cov_y_eff/2 - 12)) {
                                    translate([hx, hy])
                                        rotate([0, 0, 30])
                                            circle(d = hex_cell_size / 0.866025, $fn = 6);
                                }
                            }
                        }
                    }
                    if (enclosure_style == "wall_box") {
                        for (kx = [-cover_x*0.26, cover_x*0.26]) {
                            translate([kx, cov_y_eff*0.14])
                                rrect_2d(18.0, 24.0, 4.0);
                        }
                    }
                }

        // Keyhole Wall-Mount Slots (included in wall_box mode; optional in echoshow)
        if (enclosure_style == "wall_box") {
            for (kx = [-cover_x*0.26, cover_x*0.26]) {
                translate([kx, cov_y_eff*0.14, -0.1])
                    linear_extrude(height = cover_thick + 0.2)
                        keyhole_2d();
            }
        }

        // 4 Corner M3 Countersunk Mounting Holes
        for (sx = [-1, 1], sy = [-1, 1]) {
            bx = sx * (cover_x/2 - 5.5);
            by = sy * ((pocket_y/2 - 3.8) / cos(tilt_actual));
            translate([bx, by, -0.1]) {
                cylinder(h = cover_thick + 0.2, d = screw_hole_d);
                translate([0, 0, cover_thick - 1.3])
                    cylinder(h = 1.5, d1 = screw_hole_d, d2 = 6.0);
            }
        }
    }
}

if (part_to_render == "part1") {
    part1_main_clock_body();
} else if (part_to_render == "part2") {
    part2_hex_back_cover();
} else if (part_to_render == "assembled") {
    if (enclosure_style == "echoshow") {
        // Orient upright on desk (bottom foot flat on Z=0, screen tilted back by tilt_actual!)
        translate([0, 0, outer_y/2 * sin(tilt_actual)])
            rotate([90 - tilt_actual, 0, 0]) {
                part1_main_clock_body();
                color("#38bdf8", 0.9)
                    on_back_plane()
                        translate([0, 0, -cover_lip_depth + 0.2])
                            part2_hex_back_cover();
            }
    } else {
        part1_main_clock_body();
        color("#38bdf8", 0.9)
            translate([0, 0, top_z - cover_lip_depth + 0.2])
                part2_hex_back_cover();
    }
} else {
    // 2-Part Print Bed Layout (Part 1 face-down + Part 2 flat)
    cov_y_eff = cover_y / cos(tilt_actual);
    translate([0, -outer_y/2 - 6, 0])
        part1_main_clock_body();
    translate([0, cov_y_eff/2 + 6, 0])
        part2_hex_back_cover();
}
