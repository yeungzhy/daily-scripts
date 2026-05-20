Set ws = WScript.CreateObject("WScript.Shell")

' 启动 IDM（路径带空格，用三引号包裹）
ws.Run """D:\Program Files\IDM.6.42.63\IDM\IDMan.exe""", 1

' 等待窗口出现（最多 5 秒）
Dim found
found = False

For i = 1 To 50
    WScript.Sleep 100
    ' AppActivate 同时完成"检测存在"和"抢回焦点"两件事
    If ws.AppActivate("Internet Download Manager") Then
        found = True
        Exit For
    End If
Next

' 窗口已激活，再 Alt+F4 关闭
If found Then
    WScript.Sleep 100
    ws.SendKeys "%{F4}"
Else
    ' 降级方案：如果始终找不到窗口，用 taskkill 发送正常关闭信号（不依赖焦点，不模拟按键）
    ws.Run "taskkill /im IDMan.exe", 0, False
End If