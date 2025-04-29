# บันทึก output และ error ไปที่ไฟล์
$output = vercel --prod 2>&1

# เช็คสถานะ
if ($LASTEXITCODE -eq 0) {
    # ถ้าสำเร็จ
    Write-Host "Deployment successful!"
    Write-Host "Output: $output"
    
    # ดึง URL จาก output
    $deploymentUrl = $output | Select-String -Pattern "https://" | Select-Object -First 1
    Write-Host "Deployment URL: $deploymentUrl"
} else {
    # ถ้าเกิด error
    Write-Host "Deployment failed!"
    Write-Host "Error: $output"
} 