const dateNow = Date.now()

const randomNum = (min,max) => {
    return Math.floor(Math.random() * max) + min
}

export const sampleReadings = (doctor,type,count) => {

    let data = []
    for(var i=0; i<count; i++) {
        let reading={
            "profile": { 
                "doctor": doctor 
            },
            "created": dateNow - (i * 24 * 60 * 60 * 1000 *  randomNum(1,10) )
        }
        reading["devices"]={}
        if (type === "bloodPressureMonitor" ) {
            reading["devices"][type] = {
                note: "Demo/Training", 
                reading:  { 
                    "Upper": randomNum(60,150), 
                    "Lower": randomNum(60,150),  
                    "Pulse": randomNum(60,150) 
                }
            }
        } else if (type === "bloodGlucoseMeter" ) {
            reading["devices"][type] = {
                note: "Demo/Training", 
                reading:  { 
                    "Glucose": randomNum(60,150), 
                }
            }
        } else if (type === "continuousGlucoseMonitor" ) {
            reading["devices"][type] = {
                note: "Demo/Training", 
                reading:  { 
                    "Glucose": randomNum(60,150), 
                }
            }
        } else if (type === "peakFlowMeter" ) {
            reading["devices"][type] = {
                note: "Demo/Training", 
                reading:  { 
                    "Peak Flow": randomNum(60,150), 
                }
            }
        } else if (type === "fingertipPulseOximeter" ) {
            reading["devices"][type] = {
                note: "Demo/Training", 
                reading:  { 
                    "SpO2": randomNum(70,150), 
                    "PR": randomNum(90,130), 
                    "PI": randomNum(90,120), 
                }
            }
        }              
        data.push({reading});
    }
    return data
} 