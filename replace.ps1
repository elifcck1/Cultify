$files = Get-ChildItem -Path "c:\Users\Elif\Desktop\cultf\26.0\html\*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace '(?s)<header class="sticky-top">.*?</header>', '<app-header></app-header>'
    $content = $content -replace '(?s)<footer class="site-footer">.*?</footer>', '<app-footer></app-footer>'
    $content = $content -replace '<script src="\.\./js/app\.js"></script>', '<script src="../js/components.js"></script>
    <script src="../js/app.js"></script>'
    Set-Content -Path $file.FullName -Value $content
}
