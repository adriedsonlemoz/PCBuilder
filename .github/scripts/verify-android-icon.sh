#!/usr/bin/env bash
set -euo pipefail
RES="${1:-android/app/src/main/res}"
MANIFEST="${2:-android/app/src/main/AndroidManifest.xml}"

# Adaptive icon API 26+
test -f "$RES/mipmap-anydpi-v26/ic_launcher.xml"
test -f "$RES/mipmap-anydpi-v26/ic_launcher_round.xml"
test -f "$RES/drawable-nodpi/meu_pc_adaptive_foreground.png"
test -f "$RES/values/meu_pc_icon_colors.xml"
grep -q '@color/meu_pc_adaptive_background' "$RES/mipmap-anydpi-v26/ic_launcher.xml"
grep -q '@drawable/meu_pc_adaptive_foreground' "$RES/mipmap-anydpi-v26/ic_launcher.xml"

# Fallback legacy em todas as densidades.
for density in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  test -f "$RES/mipmap-$density/ic_launcher.png"
  test -f "$RES/mipmap-$density/ic_launcher_round.png"
done

# Manifest aponta somente para os launchers novos.
grep -q 'android:icon="@mipmap/ic_launcher"' "$MANIFEST"
grep -q 'android:roundIcon="@mipmap/ic_launcher_round"' "$MANIFEST"

# Nenhuma referência visual ao foreground padrão do Capacitor deve restar.
if grep -R -n -E 'ic_launcher_foreground|capacitor.*icon' "$RES/mipmap-anydpi-v26" "$RES/drawable" "$RES/drawable-nodpi" 2>/dev/null; then
  echo "Erro: referência ao launcher antigo encontrada." >&2
  exit 1
fi

echo "Validação dos recursos de Adaptive Icon concluída."
