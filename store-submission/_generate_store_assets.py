"""Split Python Pal icon sheet + generate Microsoft Store assets.

Partner Center Store listing image order (Desktop app):
1) Screenshots (1920x1080) — generated separately after UI restyle
2) Store logos (this script):
   - 300 x 300   app tile / 1:1 logo
   - 1080 x 1080 box art 1:1
   - 2160 x 2160 box art 1:1 (optional hi-res)
   - 720 x 1080  poster 2:3
   - 1440 x 2160 poster 2:3
Package APPX tiles (embedded in buildResources/appx):
   - StoreLogo 50x50
   - Square44x44Logo 44x44
   - Square150x150Logo 150x150
   - Wide310x150Logo 310x150
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"C:\Users\justi\Desktop\python-pal")
SHEET = ROOT / "store-submission/images/branding/icon-sheet-source.png"
BRAND = ROOT / "store-submission/images/branding"
LOGOS = ROOT / "store-submission/images/logos"
APPX = ROOT / "electron/buildResources/appx"
PUBLIC = ROOT / "public"
ICONS = PUBLIC / "icons"

for d in (BRAND, LOGOS, APPX, ICONS):
    d.mkdir(parents=True, exist_ok=True)

BG = (8, 8, 8)
GOLD = (212, 175, 55)


def cover_square(img: Image.Image, size: int) -> Image.Image:
    img = img.convert("RGBA")
    side = min(img.width, img.height)
    left = (img.width - side) // 2
    top = (img.height - side) // 2
    cropped = img.crop((left, top, left + side, top + side))
    return cropped.resize((size, size), Image.Resampling.LANCZOS)


def fit_on_canvas(img: Image.Image, w: int, h: int, pad_ratio: float = 0.06) -> Image.Image:
    canvas = Image.new("RGBA", (w, h), BG + (255,))
    inner = int(min(w, h) * (1 - pad_ratio * 2))
    tile = cover_square(img, inner)
    canvas.paste(tile, ((w - inner) // 2, (h - inner) // 2), tile)
    return canvas


def split_sheet(sheet: Image.Image) -> dict[str, Image.Image]:
    """Crop the 7 icons from the 1024 collage using known layout proportions."""
    W, H = sheet.size
    # Layout measured against the provided sheet composition:
    # Large hero top-left; two stacked tiles top-right; four tiles bottom row.
    # Coordinates are fractional of W/H for resilience to slight resizes.
    regions = {
        "01-brand-main": (0.02, 0.02, 0.58, 0.58),
        "02-learn-grad": (0.60, 0.02, 0.98, 0.30),
        "03-code-book": (0.60, 0.32, 0.98, 0.58),
        "04-terminal": (0.02, 0.62, 0.26, 0.98),
        "05-brain": (0.27, 0.62, 0.50, 0.98),
        "06-progress": (0.51, 0.62, 0.74, 0.98),
        "07-mascot": (0.75, 0.62, 0.98, 0.98),
    }
    out: dict[str, Image.Image] = {}
    for name, (x0, y0, x1, y1) in regions.items():
        box = (
            int(W * x0),
            int(H * y0),
            int(W * x1),
            int(H * y1),
        )
        crop = sheet.crop(box).convert("RGBA")
        out[name] = crop
        crop.save(BRAND / f"{name}.png")
        print(f"split {name} {crop.size}")
    return out


def main() -> None:
    sheet = Image.open(SHEET).convert("RGBA")
    icons = split_sheet(sheet)
    brand = icons["01-brand-main"]

    # Canonical app icons
    for size, name in [(1024, "icon-1024.png"), (512, "icon-512.png"), (192, "icon-192.png"), (256, "icon.png")]:
        cover_square(brand, size).convert("RGB").save(PUBLIC / name)
        print("public", name)

    cover_square(brand, 256).save(PUBLIC / "icon.ico", sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])

    # In-app icon set (nav / feature tiles)
    mapping = {
        "brand.png": "01-brand-main",
        "learn.png": "02-learn-grad",
        "code.png": "03-code-book",
        "terminal.png": "04-terminal",
        "tutor.png": "05-brain",
        "progress.png": "06-progress",
        "mascot.png": "07-mascot",
    }
    for out_name, key in mapping.items():
        cover_square(icons[key], 256).save(ICONS / out_name)
        print("icons", out_name)

    # Partner Center Store logos — submission page order after screenshots
    # 1) 300x300 app tile
    fit_on_canvas(brand, 300, 300).convert("RGB").save(LOGOS / "01-app-tile-300x300.png")
    # 2) 1:1 box art
    fit_on_canvas(brand, 1080, 1080).convert("RGB").save(LOGOS / "02-box-art-1x1-1080.png")
    fit_on_canvas(brand, 2160, 2160).convert("RGB").save(LOGOS / "03-box-art-1x1-2160.png")
    # 3) 2:3 posters
    def poster(w: int, h: int, path: Path) -> None:
        canvas = Image.new("RGB", (w, h), BG)
        portrait = cover_square(brand, int(w * 0.72))
        canvas.paste(portrait, ((w - portrait.width) // 2, int(h * 0.12)), portrait)
        draw = ImageDraw.Draw(canvas)
        try:
            font = ImageFont.truetype("georgia.ttf", max(36, w // 12))
            sub = ImageFont.truetype("georgia.ttf", max(20, w // 28))
        except OSError:
            font = ImageFont.load_default()
            sub = font
        title = "PYTHON PAL"
        bbox = draw.textbbox((0, 0), title, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) // 2, int(h * 0.62)), title, fill=GOLD, font=font)
        tag = "Learn Python. Build confidence."
        bbox = draw.textbbox((0, 0), tag, font=sub)
        sw = bbox[2] - bbox[0]
        draw.text(((w - sw) // 2, int(h * 0.70)), tag, fill=(180, 160, 90), font=sub)
        canvas.save(path)

    poster(720, 1080, LOGOS / "04-poster-2x3-720x1080.png")
    poster(1440, 2160, LOGOS / "05-poster-2x3-1440x2160.png")

    # APPX package tiles
    specs = {
        "StoreLogo.png": (50, 50),
        "Square44x44Logo.png": (44, 44),
        "Square150x150Logo.png": (150, 150),
        "Wide310x150Logo.png": (310, 150),
    }
    for name, (w, h) in specs.items():
        fit_on_canvas(brand, w, h).save(APPX / name)
        print("appx", name, w, h)

    print("DONE")


if __name__ == "__main__":
    main()
