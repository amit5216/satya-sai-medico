$body = '{"username":"admin","password":"admin123"}'
$login = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
$token = $login.token

$headers = @{ Authorization = "Bearer $token" }

# Dr. Sharma (id=1): Mon, Wed, Fri
$sched1 = '{"doctorId":1,"days":["MONDAY","WEDNESDAY","FRIDAY"]}'
Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/schedules' -Method POST -Body $sched1 -ContentType 'application/json' -Headers $headers
Write-Output "Dr. Sharma schedule set: MON, WED, FRI"

# Dr. Amit (id=2): Tue, Thu, Sat
$sched2 = '{"doctorId":2,"days":["TUESDAY","THURSDAY","SATURDAY"]}'
Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/schedules' -Method POST -Body $sched2 -ContentType 'application/json' -Headers $headers
Write-Output "Dr. Amit schedule set: TUE, THU, SAT"

Write-Output "Done! Schedules added."
