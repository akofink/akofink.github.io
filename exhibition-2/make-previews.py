# /// script
# dependencies = ["pillow"]
# ///
"""Convert actual browser-suite captures to local gallery thumbnails.

uv run make-previews.py /your/ignored/evidence
Screenshots must contain only the exhibition, never a desktop or private records.
"""
from pathlib import Path
import sys
from PIL import Image, ImageOps

source = Path(sys.argv[1])
target = Path(__file__).parent / "previews"
target.mkdir(exist_ok=True)
ids = ["switchyard", "machine", "score", "contours", "press", "garden", "xray", "hearing", "windows", "zine"]
for name in ids:
    state = "initial-stage" if name == "hearing" else "interacted"
    capture = source / f"{name}-desktop-{state}.png"
    image = Image.open(capture).convert("RGB")
    thumbnail = ImageOps.pad(image, (700, 440), color=image.getpixel((1, 1)), method=Image.Resampling.LANCZOS)
    thumbnail.save(target / f"{name}.webp", quality=85)
print("Created ten thumbnails from actual rendered experience captures.")
