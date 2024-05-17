const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".image-ar img"),
musicName = wrapper.querySelector(".songdetails .name"),
musicArt = wrapper.querySelector(".songdetails .artist"),
mainAudio = wrapper.querySelector("#audio"),
playPauseBtn=wrapper.querySelector(".play-p"),
prevBtn=wrapper.querySelector("#back"),
nextBtn=wrapper.querySelector("#for"),
progressB=wrapper.querySelector(".bar"),
progressArea=wrapper.querySelector(".prograss"),
musicList=wrapper.querySelector(".music-list"),
showBtn=wrapper.querySelector("#more"),
hideBtn=musicList.querySelector("#close");

//random song when page is loaded
let musicIndex = Math.floor((Math.random()) * allMusic.length+1);
window.addEventListener("load",()=>{
    loadMusic(musicIndex);//calling load music fun once window loaded
    playingNow();
})

//load music func
function loadMusic(indexNumb){
        musicName.innerText = allMusic[indexNumb-1].name;
        musicArt.innerText = allMusic[indexNumb-1].artist;
        musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
        mainAudio.src=`songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music fun
function playMusic(){
    wrapper.classList.add("paused");
    //change icon
    playPauseBtn.querySelector("i").className="fa-solid fa-pause";
    mainAudio.play();
}

//pause music fun
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").className="fa-solid fa-play";
    mainAudio.pause();
}

//next music func
function nextMusic(){
//here we will increment the index by 1
musicIndex++;
// if index is greater than array list, play from starting
musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
loadMusic(musicIndex);
playMusic();
playingNow();
}

//prev music func
function prevMusic(){
    //here we will decrement the index by 1
    musicIndex--;
    // if index is less than 1, play from end basically loop through a playlist
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//play or pause music btn event
playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true the call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();

});

//next btn
nextBtn.addEventListener("click",()=>{
    nextMusic(); //calling nextMusic func
}) 

//previous btn
prevBtn.addEventListener("click",()=>{
    prevMusic(); //calling nextMusic func
})  

//update the progress bar according to current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //getting current time of song
    const duration = e.target.duration;  //getting duration of song
    let progressW = (currentTime / duration)*100;
    progressB.style.width = `${progressW}%`
    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
         
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec<10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec<10){
     currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//lets update playing song current time according to prograss bar width
progressArea.addEventListener("click", (e)=>{
    console.log(e);
    let prgWval = progressArea.clientWidth; //getting width of prg bar
    let clickedOffSetX = e.offsetX; //getting x value
    let songDuration = mainAudio.duration; //getting song duration

    mainAudio.currentTime = (clickedOffSetX / prgWval) * songDuration;
    playMusic();
});

//shuffle, repeat according to icon
const repeatBtn = wrapper.querySelector("#rept");
repeatBtn.addEventListener("click", ()=>{
     // first lets icon later change
     let getText = repeatBtn.innerText; //getting icon
     switch(getText){
        case "repeat": //if the icon is repeat to repeat 1
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title", "Song Looped")
        break;
        case "repeat_one": //shuffle
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "Playback Shuffle")
        break;
        case "shuffle": //repeat
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title", "Playlist Looped")
        break;
     }
  
});
//after song ended
mainAudio.addEventListener("ended",()=>{
    //we'll do according to the icon means if user has set icon to loop song then we will repeat
    //the current song and will do accordingly
    let getText = repeatBtn.innerText; //getting icon
     switch(getText){
        case "repeat": //if the icon is repeat to repeat 1 //if icon is repeat we will play next song
        nextMusic();
        playingNow();
        break;
        case "repeat_one": //shuffle
        mainAudio.currentTime = 0; //we play the current song again and again until user changes so setting current time to 0
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        break;
        case "shuffle": //repeat //using random() we will play random music from list
        let randIndex = Math.floor((Math.random()) * allMusic.length+1);
        do{
            randIndex = Math.floor((Math.random()) * allMusic.length+1);
        }while(musicIndex == randIndex); //loop will continue until the next random number wont be same
        musicIndex = randIndex; //passing random number to musicIndex so song will play
        loadMusic(musicIndex); //calling loadmusic func
        playMusic();
        playingNow();
        break;
     }
})

//opening/showing musiclist
showBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show")
})

//close musiclist
hideBtn.addEventListener("click",()=>{
   showBtn.click();
})

const ulTag = wrapper.querySelector("ul");

//lets create li according to array length

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-dur"></span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    let liAudioDur = ulTag.querySelector(`#${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec<10){
            totalSec = `0${totalSec}`;
        }
        liAudioDur.innerText = `${totalMin}:${totalSec}`;
        //adding t-dur attribute which we are using below
        liAudioDur.setAttribute("t-dur",`${totalMin}:${totalSec}` );
    });
}

//play song when clicked on particular song
const allLiTag = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-dur")
        // removing playing class from all other li expect the last one which is clicked
        if(allLiTag[j].classList.contains("playing")){
            allLiTag[j].classList.remove("playing");
            //getting audio duration and pass it to .audio-dur innertext
            let adDur = audioTag.getAttribute("t-dur");
            audioTag.innerText = adDur; //passing t-dur value to audio dur innertext
        }
        //if there is an li tag where index is equal to musicIndex
        //then this music is playing now and styling it
        if(allLiTag[j].getAttribute("li-index") == musicIndex){
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        //adding onclick attribute for all li tags
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
    
}
//lets play song on li click
function clicked(element){
    //getting li index of pareticular clicked li tag
    let getLi = element.getAttribute("li-index");
    musicIndex = getLi; //passing that as musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//"C:\Users\ADMIN\OneDrive\Desktop\project"