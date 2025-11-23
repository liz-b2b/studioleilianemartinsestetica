<#
  PowerShell helper: generate PNG icons and favicon.ico from SVG sources using ImageMagick.

  Requirements:
  - ImageMagick installed and `magick` available on PATH.

  Run from project root (PowerShell):
    .\tools\generate-icons.ps1

  This will create these files under `img/`:
    - favicon-16x16.png
    - favicon-32x32.png
    - icon-192.png
    - icon-512.png
    - apple-touch-icon.png
    - favicon.ico

#>
Set-StrictMode -Version Latest

$svgDir = Join-Path $PSScriptRoot '..\img' | Resolve-Path
$svgDir = $svgDir.Path

Write-Host "Generating PNG icons from SVG in $svgDir"

function Run-Magick([string]$args){
  Write-Host "magick $args"
  & magick $args
  if($LASTEXITCODE -ne 0){ throw "magick failed with exit code $LASTEXITCODE" }
}

# Source SVGs (these should exist already)
$src192 = Join-Path $svgDir 'icon-192.svg'
$src512 = Join-Path $svgDir 'icon-512.svg'
$srcFavicon = Join-Path $svgDir 'favicon.svg'

if(-not (Test-Path $src192) -or -not (Test-Path $src512) -or -not (Test-Path $srcFavicon)){
  Write-Error "One or more source SVGs are missing in img/. Ensure 'icon-192.svg', 'icon-512.svg' and 'favicon.svg' exist."; exit 1
}

# Generate PNGs
Run-Magick "$src192 -resize 192x192 png:$svgDir\icon-192.png"
Run-Magick "$src512 -resize 512x512 png:$svgDir\icon-512.png"
Run-Magick "$srcFavicon -resize 32x32 png:$svgDir\favicon-32x32.png"
Run-Magick "$srcFavicon -resize 16x16 png:$svgDir\favicon-16x16.png"
Run-Magick "$src192 -resize 180x180 png:$svgDir\apple-touch-icon.png"

# Create favicon.ico from multiple sizes
Write-Host "Creating favicon.ico"
Run-Magick "$svgDir\favicon-16x16.png $svgDir\favicon-32x32.png $svgDir\icon-192.png ico:$svgDir\favicon.ico"

Write-Host "Icons generated in: $svgDir"
Write-Host "Remember to clear browser cache when testing favicons/manifests."
