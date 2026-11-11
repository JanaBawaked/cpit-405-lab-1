
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const message = document.getElementById("message");

const apiKey = "J8lpZLLGz8KCfI3l9X7LAMOk4aRVE4Jq0OwxLX3mHfk";
const apiURL = "https://api.unsplash.com/search/photos";

function getSearchURL(keyword) {
    return apiURL + "?query=" +
        encodeURIComponent(keyword) + "&per_page=9";
}

function prepareSearch() {
    searchResults.innerHTML = "";
    message.innerText = "";

    let keyword = searchInput.value.trim();

    if (keyword === "") {
        message.innerText = "Please enter a keyword.";
        return "";
    }

    message.innerText = "Loading images...";
    return keyword;
}

function processResponse(data) {
    searchResults.innerHTML = "";

    if (data.results.length === 0) {
        message.innerText = "No images found.";
        return;
    }

    message.innerText = "";

    for (let item of data.results) {
        let link = document.createElement("a");
        link.href = item.links.html;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        let img = document.createElement("img");
        img.src = item.urls.small;
        img.alt = item.alt_description || "Unsplash photo";

        link.appendChild(img);
        searchResults.appendChild(link);
    }
}

// XMLHttpRequest
document.getElementById("xhrSearch").addEventListener("click", function() {
    let keyword = prepareSearch();
    if (keyword === "") return;

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                processResponse(data);
            } else {
                message.innerText = "Error loading images.";
            }
        }
    };

    xhr.onerror = function() {
        message.innerText = "Network error.";
    };

    xhr.open("GET", getSearchURL(keyword), true);
    xhr.setRequestHeader("Authorization", "Client-ID " + apiKey);
    xhr.send();
});

// Fetch with Promises
document.getElementById("fetchSearch").addEventListener("click", function() {
    let keyword = prepareSearch();
    if (keyword === "") return;

    fetch(getSearchURL(keyword), {
        headers: {
            "Authorization": "Client-ID " + apiKey
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Request failed");
        }
        return response.json();
    })
    .then(function(data) {
        processResponse(data);
    })
    .catch(function(error) {
        message.innerText = "Error loading images.";
        console.error(error);
    });
});

// Fetch with Async/Await
document.getElementById("asyncSearch").addEventListener("click", async function() {
    let keyword = prepareSearch();
    if (keyword === "") return;

    try {
        let response = await fetch(getSearchURL(keyword), {
            headers: {
                "Authorization": "Client-ID " + apiKey
            }
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        let data = await response.json();
        processResponse(data);

    } catch (error) {
        message.innerText = "Error loading images.";
        console.error(error);
    }
});
