###  Performance Test Reporting.
Here is a precise analysis of my load test performed and conducted. I will show only a part of it.

Test executed for the below mentioned scenario in server https://blazedemo.com/.

### Scenario 1. Normal operation without exceeding the limits
📌20 users click on the site at the same time

📌Ramp-up period 5 seconds.

📌Loop Count 1

📌Users purchase the flight booking completed.

📌Users periodically make transfers.



### Testing results: Scenario 1 
🕜Start Time "9/6/22, 12:55 AM"

🕜End Time	"9/12/22, 1:16 AM"

### Total Transactions Per Second
![](https://github.com/sabbir72/img/blob/main/F1.png)

The Avg number for Total Transactions Per Second 47ransactions/per second.

20 Concurrent Request with 1 Loop Count; Avg TPS for Total Samples is ~ 47 And Total Concurrent API requested: 30589.

While executed 20 concurrent request, found  75 request got connection timeout and error rate is 0.25%.

### Transactions Per Second
![](https://github.com/sabbir72/img/blob/main/F2.png)

## Test environment is most Importent
OS - Windows 11, 
RAM -8GB,
SSD- 500GB

Click Here.➡️
[Live Report](https://sabbir72.github.io/PerformanceTest_BlazeDemo/)







