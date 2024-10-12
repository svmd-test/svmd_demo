// https://stackoverflow.com/questions/30069988/how-can-i-create-a-promise-for-the-end-of-playing-sound

export const playAudio= (url) => {
    return new Promise( (resolve, reject) => {     // return a promise
      var audio = new Audio();                     // create audio wo/ src
      audio.preload = "auto";                      // intend to play through
      audio.autoplay = true;                       // autoplay when loaded
      audio.onerror = reject;                      // on error, reject
      audio.onended = resolve;                     // when done, resolve
  
      audio.src = url
    });
  }
  