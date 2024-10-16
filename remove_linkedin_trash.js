//initial load/globals
let intervalDiv;
var scrollDiv;
// add however many you want c:
var blacklistKeywords = ["Microsoft"];

// The event driven function to remove on scroll
// Reloaded with navigation of the site
function scrollDelete() {
  var spans = document.getElementsByClassName(
    "job-card-container__primary-description",
  );
  var cards = [];
  // Loop through the spans and filter for those containing "Oracle"
  for (let span of spans) {
    var spanText = span.textContent.trim();
    if (blacklistKeywords.some((keyword) => spanText.includes(keyword))) {
      cards.push(span);
    }
  }
  // Log the filtered spans only once when scrolled, and onl
  cards.forEach((span) => {
    var deleteLmao =
      span.parentElement.parentElement.parentElement.parentElement.parentElement
        .parentElement;
    deleteLmao.remove();
    console.log(span.textContent.trim(), "Position Removed");
    // }
  });
}

function removeTrashPostings(div) {
  // Get the scrollable div, they might change the name which is pretty annoying :/
  if (div) {
    scrollDiv = document.getElementsByClassName(div);
    if (scrollDiv[0]) {
      clearInterval(intervalDiv); // Stop the interval once the div is found
      // Do something with myDiv
      scrollDiv[0].addEventListener("scroll", scrollDelete);
    }
  } else {
    clearInterval(intervalDiv);
    document.addEventListener("scroll", scrollDelete);
  }
}

// Initial load
let currentURL = window.location.href;
if (
  currentURL.includes("https://www.linkedin.com/jobs/search") ||
  currentURL.includes("https://www.linkedin.com/jobs/collections")
) {
  //Run the thing
  // Attempt to get the div every 250 milliseconds.
  // This starts the function chain, It first makes sure to get the scrollable div
  intervalDiv = setInterval(
    removeTrashPostings,
    350,
    "jobs-search-results-list",
  );
} else if (currentURL.includes("https://www.linkedin.com/jobs")) {
  intervalDiv = setInterval(removeTrashPostings, 350, "");
}

//Start the event listener for navigation
navigation.addEventListener("navigate", (event) => {
  destination = event.destination.url;
  if (
    destination.includes("https://www.linkedin.com/jobs/search") ||
    destination.includes("https://www.linkedin.com/jobs/collections")
  ) {
    // Remove the existing  event listener
    if (scrollDiv && scrollDiv[0]) {
      scrollDiv[0].removeEventListener("scroll", scrollDelete);
    }
    document.removeEventListener("scroll", scrollDelete);
    // Then restart the whole thing
    intervalDiv = setInterval(
      removeTrashPostings,
      350,
      "jobs-search-results-list",
    );
  } else if (destination.includes("https://www.linkedin.com/jobs")) {
    // Remove the existing  event listener
    if (scrollDiv && scrollDiv[0]) {
      scrollDiv[0].removeEventListener("scroll", scrollDelete);
    }
    document.removeEventListener("scroll", scrollDelete);
    // Then restart the whole thing
    intervalDiv = setInterval(removeTrashPostings, 350, "");
  }
});
