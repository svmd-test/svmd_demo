const userReadings = (uid,firestore,lastWeek,today,type) => {
    if (uid) {
  
      firestore
        .collection("users")
        .doc(uid)
        .collection("readings")
        .where('created','>',lastWeek)
        .orderBy("created", "desc")
        .get()
        .then( async querySnapshot => {
          //alert(querySnapshot.length)
          //console.log(querySnapshot)
          let i = 0
          let bt = 0
          let maxCreated=null, nav=''
          querySnapshot.forEach(  ( reading, index ) => {
            if ( i === 0 ) {
              maxCreated=reading.data().created
              if (type) {
                nav=JSON.stringify(reading.data().navigator)
                nav=nav.includes("iPhone")?'iPhone':nav.includes("Android")?'Android':nav
              }
            }
            if ( reading.data().devices?.bloodPressureMonitor?.device?.model === "BP100" ) bt++
            i++
            //const readingCreated = reading.data().created
          })
          if(i>0) {
            const dt = new Date(maxCreated)
            const d = dt.toLocaleString()
            var diffDays = Math.ceil(Math.abs(today-dt) / (1000 * 3600 * 24)) ;
            console.log("max readingCreated", i,  d)
            const bts = bt>0 ? `<${bt}>` : ''
            document.getElementById(uid).innerHTML = `[${i}]${bts} {${diffDays}d} ${d} ${nav}`
          }
  
          //return {"count":i,"max":new Date(maxCreated).toLocaleString()}
        })
    }
  }
  
export default userReadings;