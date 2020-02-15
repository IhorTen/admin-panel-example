interface Number {
    _formatDate: (format: "YMD" | "HMS" | "full") => string
}

Number.prototype._formatDate = function(format) {
    let date = new Date((this as number) * 1000)
    
    if(format == "YMD") {
        let [fullYear, fullMonth, fullDate] = [
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ]
    
        let year = fullYear
        let month = ++fullMonth < 10 ? "0" + fullMonth : fullMonth
        let day = fullDate < 10 ? "0" + fullDate : fullDate

        return `${year}.${month}.${day}`
    } else if (format == "HMS") {
        let [hoursDate, minutesDate, secondsDate] = [
            date.getHours(), 
            date.getMinutes(), 
            date.getSeconds()
        ]
    
        var hours = hoursDate < 10 ? "0" + hoursDate : hoursDate
        var min = minutesDate < 10 ? "0" + minutesDate : minutesDate
        var sec = secondsDate < 10 ? "0" + secondsDate : secondsDate
    
        return `${hours}:${min}:${sec}`
    } else if (format == "full") {
        let [year, month, day, hours, min, sec] = [
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ]

        let gethours = hours < 10 ? "0" + hours : hours
        let getMin = min < 10 ? "0" + min : min
        let getSec = sec < 10 ? "0" + sec : sec
        let getMonth = month < 9 ? "0" + ++month : ++month

        return `${getMonth}/${day}/${year} ${gethours}:${getMin}:${getSec}`
    }
}