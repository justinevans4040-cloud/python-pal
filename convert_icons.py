# Icon Conversion Helper
# Run this after choosing your icon: python convert_icons.py 1  (or 2)
# Requires: pip install Pillow

import sys
import struct
import zlib
from pathlib import Path
from PIL import Image

choice = sys.argv[1] if len(sys.argv) > 1 else "1"
src = Path(f"public/icon-option-{choice}.jpg")
if not src.exists():
    print(f"ERROR: {src} not found"); sys.exit(1)

img = Image.open(src).convert("RGBA")

# ── PNG sizes (Android/iOS/web) ──────────────────────────────────────────────
sizes = {
    "public/icon.png":          (512, 512),
    "public/icon-192.png":      (192, 192),
    "public/icon-512.png":      (512, 512),
    # Android
    "public/android/mipmap-mdpi/ic_launcher.png":     (48,  48),
    "public/android/mipmap-hdpi/ic_launcher.png":     (72,  72),
    "public/android/mipmap-xhdpi/ic_launcher.png":    (96,  96),
    "public/android/mipmap-xxhdpi/ic_launcher.png":   (144, 144),
    "public/android/mipmap-xxxhdpi/ic_launcher.png":  (192, 192),
    # iOS
    "public/ios/AppIcon-20x20@1x.png":    (20,  20),
    "public/ios/AppIcon-20x20@2x.png":    (40,  40),
    "public/ios/AppIcon-20x20@3x.png":    (60,  60),
    "public/ios/AppIcon-29x29@1x.png":    (29,  29),
    "public/ios/AppIcon-29x29@2x.png":    (58,  58),
    "public/ios/AppIcon-29x29@3x.png":    (87,  87),
    "public/ios/AppIcon-60x60@2x.png":    (120, 120),
    "public/ios/AppIcon-60x60@3x.png":    (180, 180),
    "public/ios/AppIcon-76x76@1x.png":    (76,  76),
    "public/ios/AppIcon-76x76@2x.png":    (152, 152),
    "public/ios/AppIcon-83.5x83.5@2x.png":(167, 167),
    "public/ios/AppIcon-1024x1024@1x.png":(1024,1024),
}

for path_str, size in sizes.items():
    out = Path(path_str)
    out.parent.mkdir(parents=True, exist_ok=True)
    resized = img.resize(size, Image.LANCZOS)
    resized.save(out, "PNG")
    print(f"  ✓ {out}")

# ── Windows .ico (multi-size) ────────────────────────────────────────────────
ico_sizes = [16, 32, 48, 64, 128, 256]
ico_images = []
for s in ico_sizes:
    frame = img.resize((s, s), Image.LANCZOS)
    ico_images.append(frame)

ico_path = Path("public/icon.ico")
ico_images[0].save(
    ico_path, format="ICO",
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:]
)
print(f"  ✓ {ico_path}")

# ── macOS: copy 1024 PNG (rename to .icns manually or use iconutil on Mac) ──
import shutil
shutil.copy("public/ios/AppIcon-1024x1024@1x.png", "public/icon-1024.png")
print("  ✓ public/icon-1024.png  (rename to .icns using iconutil on Mac)")

print(f"\nAll icons generated from option-{choice}.")
print("For macOS .icns: run `iconutil -c icns icon.iconset` on a Mac.")
