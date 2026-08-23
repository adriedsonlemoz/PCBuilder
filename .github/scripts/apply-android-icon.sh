#!/usr/bin/env bash
set -euo pipefail

ICON_SOURCE="${1:-public/meu-pc-adaptive-icon.png}"
RES_DIR="${2:-android/app/src/main/res}"
MANIFEST="${3:-android/app/src/main/AndroidManifest.xml}"

if [[ ! -f "$ICON_SOURCE" ]]; then
  echo "Erro: arte aprovada não encontrada em $ICON_SOURCE" >&2
  exit 1
fi
if [[ ! -d "$RES_DIR" ]]; then
  echo "Erro: diretório de recursos Android não encontrado em $RES_DIR" >&2
  exit 1
fi
if [[ ! -f "$MANIFEST" ]]; then
  echo "Erro: AndroidManifest.xml não encontrado em $MANIFEST" >&2
  exit 1
fi

# Garante que a fonte usada seja quadrada, requisito do launcher Android.
if command -v identify >/dev/null 2>&1; then
  dimensions="$(identify -format '%wx%h' "$ICON_SOURCE")"
  width="${dimensions%x*}"
  height="${dimensions#*x}"
  if [[ "$width" != "$height" ]]; then
    echo "Erro: a arte do ícone precisa ser 1:1; recebida ${dimensions}." >&2
    exit 1
  fi
fi

# Remove os launchers padrão que o Capacitor cria para impedir qualquer fallback
# visual para o antigo ícone do Capacitor.
find "$RES_DIR" -type f \( \
  -name 'ic_launcher.png' -o \
  -name 'ic_launcher.webp' -o \
  -name 'ic_launcher_round.png' -o \
  -name 'ic_launcher_round.webp' -o \
  -name 'ic_launcher_foreground.png' -o \
  -name 'ic_launcher_foreground.webp' -o \
  -name 'ic_launcher_foreground.xml' \
\) -delete
rm -f "$RES_DIR/mipmap-anydpi-v26/ic_launcher.xml"
rm -f "$RES_DIR/mipmap-anydpi-v26/ic_launcher_round.xml"
rm -f "$RES_DIR/values/ic_launcher_background.xml"

# Foreground do Adaptive Icon: cópia byte a byte da arte original aprovada.
# Nenhum padding, moldura, redesenho ou fundo branco é adicionado.
mkdir -p "$RES_DIR/drawable-nodpi"
cp "$ICON_SOURCE" "$RES_DIR/drawable-nodpi/meu_pc_adaptive_foreground.png"

# A arte aprovada já tem fundo tecnológico escuro. Como não foi gerado um
# background separado neste chat, o layer de background usa a cor do canto da
# própria arte (#000003) para que áreas expostas pela máscara permaneçam
# visualmente contínuas sem branco ou moldura artificial.
mkdir -p "$RES_DIR/values"
cat > "$RES_DIR/values/meu_pc_icon_colors.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="meu_pc_adaptive_background">#000003</color>
</resources>
XML

# Android 8.0+ (API 26): Adaptive Icon real. O Android fica responsável pelas
# máscaras circular, squircle e rounded-square.
mkdir -p "$RES_DIR/mipmap-anydpi-v26"
cat > "$RES_DIR/mipmap-anydpi-v26/ic_launcher.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/meu_pc_adaptive_background" />
    <foreground android:drawable="@drawable/meu_pc_adaptive_foreground" />
</adaptive-icon>
XML
cp "$RES_DIR/mipmap-anydpi-v26/ic_launcher.xml" "$RES_DIR/mipmap-anydpi-v26/ic_launcher_round.xml"

# Android 7.1 e anteriores: PNGs mipmap tradicionais, redimensionados a partir
# do MESMO arquivo aprovado, sem recorte, borda ou padding adicional.
resize_icon() {
  local size="$1"
  local output="$2"
  if command -v magick >/dev/null 2>&1; then
    magick "$ICON_SOURCE" -filter Lanczos -resize "${size}x${size}!" "$output"
  elif command -v convert >/dev/null 2>&1; then
    convert "$ICON_SOURCE" -filter Lanczos -resize "${size}x${size}!" "$output"
  else
    echo "Erro: ImageMagick é necessário para gerar os fallbacks mipmap." >&2
    exit 1
  fi
}

for spec in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  density="${spec%%:*}"
  size="${spec##*:}"
  out="$RES_DIR/mipmap-$density"
  mkdir -p "$out"
  resize_icon "$size" "$out/ic_launcher.png"
  cp "$out/ic_launcher.png" "$out/ic_launcher_round.png"
done

# O Manifest padrão do Capacitor já usa @mipmap/ic_launcher. Se alguma versão
# futura mudar esses nomes, normalizamos as duas referências explicitamente.
python3 - "$MANIFEST" <<'PY'
from pathlib import Path
import re, sys
path = Path(sys.argv[1])
text = path.read_text()
text = re.sub(r'android:icon="[^"]+"', 'android:icon="@mipmap/ic_launcher"', text, count=1)
if 'android:roundIcon=' in text:
    text = re.sub(r'android:roundIcon="[^"]+"', 'android:roundIcon="@mipmap/ic_launcher_round"', text, count=1)
else:
    text = text.replace('android:icon="@mipmap/ic_launcher"', 'android:icon="@mipmap/ic_launcher"\n        android:roundIcon="@mipmap/ic_launcher_round"', 1)
path.write_text(text)
PY

echo "Adaptive Icon do Meu PC aplicado."
