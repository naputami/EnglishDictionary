const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchButton = document.getElementById("go-search");
const searchInput = document.getElementById("search-input");
const result = document.getElementById("result");
const searchMessage = document.querySelector(".search-message");
let audio;

searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    if(searchInput.value == ""){
        alert("Input field can't be empty")
    } else {
        result.innerHTML = `<p class="loading">Searching <span class="word-loading">${searchInput.value}</span> meaning... </p>`
        const kw = searchInput.value.toString().toLowerCase();
        fetch(`${url}${kw}`)
        .then((response) => {
            if(response.ok) {
            return response.json();
        } throw new Error("Couldn't find the word");
        })
        .then((data) => {
            result.innerHTML = ""
            audio = new Audio(data[0].phonetics[0].audio);
            const showWord = generateWord(data);
            result.append(showWord);
        })
        .catch((error) => result.innerHTML = `<h3 class=error>${error.message}</h3>`);
    }
   
});

function generateWord(data){
    const wordTitle = document.createElement("h2");
    wordTitle.innerText = data[0].word;
    wordTitle.classList.add("word")

    const buttonPlayVoice = document.createElement("button");
    buttonPlayVoice.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    buttonPlayVoice.setAttribute("id", "play-sound");
    buttonPlayVoice.addEventListener("click", () => {
        if(audio.getAttribute("src") !== ""){
            audio.play()
        } else {
            alert("Audio not found");
        }
    });

    const partOfSpeech = document.createElement("p");
    partOfSpeech.innerText = data[0].meanings[0].partOfSpeech || "";
    partOfSpeech.classList.add("part-of-speech");

    const phonetic = document.createElement("p");
    phonetic.innerText = data[0].phonetic;
    phonetic.classList.add("phonetics");
    
    const wordDetailWrap = document.createElement("div");
    wordDetailWrap.classList.add("detail");
    wordDetailWrap.append(partOfSpeech, phonetic);

    const wordMeaning = document.createElement("p");
    wordMeaning.innerText = data[0].meanings[0].definitions[0].definition;
    wordMeaning.classList.add("meaning");

    const exampleSentence = document.createElement("p");
    exampleSentence.innerText = data[0].meanings[0].definitions[0].example || "";
    
    const exampleSentenceWrap = document.createElement("div");
    exampleSentenceWrap.classList.add("example-sentence");
    exampleSentenceWrap.append(exampleSentence);

    const wordResultWrap = document.createElement("div");
    wordResultWrap.classList.add("word-result");
    wordResultWrap.append(wordTitle, buttonPlayVoice, wordDetailWrap, wordMeaning, exampleSentenceWrap);

    return wordResultWrap;
}

searchInput.addEventListener("focus", () => {
    searchInput.value= "";
})

