//initial load/globals
let intervalDiv;
var scrollDiv;
// add however many you want c:
var blacklistKeywords = ["Microsoft"];
var lastDeletedJobScroll = -1;

// The event driven function to remove on scroll
// Reloaded with navigation of the site
function scrollDelete(a) {
  var elems = document.getElementsByClassName(a);
  var cards = [];
  // Loop through the elems and filter for those containing "Oracle"
  const listItems = elems[0].querySelectorAll("li");

  listItems.forEach((item) => {
    var companyName = item.getElementsByClassName(
      "artdeco-entity-lockup__subtitle",
    );
    if (companyName[0]) {
      if (
        blacklistKeywords.some((keyword) =>
          companyName[0].textContent.match(keyword),
        )
      ) {
        cards.push(item);
      }
    }
  });
  // Log the filtered spans only once when scrolled, and onl
  cards.forEach((span) => {
    var deleteLmao = span;
    deleteLmao.remove();
    var companyName = span.getElementsByClassName(
      "artdeco-entity-lockup__subtitle",
    );
    if (companyName[0]) {
      console.log(companyName[0].textContent.trim(), "Position Removed");
    }
  });
}

function scrollDeleteSJobs(a) {
  // The job card are loaded into jobs-feed-discovery-module-X
  // And it just does as many as possible, so infinite scroll is just changing the X
  // Ignore 2-3 since those have no job cards
  // Loading all of them with each scroll is pointless, store the last stored
  // var cards = [];
  // while (true) {
  //   curr = "jobs-feed-discovery-module-" + String(lastDeletedJobScroll + 1);
  // }

  // t = document.getElementsByClassName(
  //   "discovery-templates-jobs-feed-discovery-module",
  // );
  // getElementsByTagName("ul")[0];
  // ("discovery-templates-jobs-feed-discovery-module");
  // // The way it works first you get the cards module by the nth entry, ignore 2 & 3 & 5 deleteLmao
  // // And from the module itself, you then get the entries:
  // // Per scroll try once to delete the module, since it might not load before the scroll
  // // tries to delete it, just dont update the latest deleted
  i = lastDeletedJobScroll;
  notDone = true;
  while (notDone) {
    i++;
    console.log(i, "hih?");
    if ([2, 3, 5].includes(i) == true) {
      console.log("later ", i);
      lastDeletedJobScroll = i;
      notDone = false;
      continue;
    }
    curr = "jobs-feed-discovery-module-" + String(i);
    t = document.getElementById(curr);
    if (!t) {
      i--;
      console.log(i, t);
      console.log("new job card module not loaded yet");
      notDone = false;
      continue; // If you want to retry without waiting for another scroll
    }
    console.log(i, "last deleted");
    u_list = t.children[0].getElementsByTagName("ul")[0];

    if (u_list) {
      tt = u_list.getElementsByClassName("artdeco-entity-lockup__subtitle");
      if (tt) {
        // console.log("delete goes here");
        // console.log("iiii");
        // console.log(i);
        // console.log(tt);
        for (let span of tt) {
          var companyName = span.getElementsByClassName(
            "jobs-home-vertical-list__entity-list",
          );

          console.log(companyName);
          // deleteLmao.remove();
          // console.log("Removed Ad!");
          // }
        }
        // console.log(tt.results.size);
        lastDeletedJobScroll++;
      } else {
        notDone = false;
      }
    }
  }
  // t = document.getElementById("jobs-feed-discovery-module-0");
  // tt = t.getElementsByClassName("discovery-templates-entity-item");
}
function scrollDeleteSuggested() {
  var spans = document.getElementsByClassName(
    "update-components-header__text-view",
  );
  var cards = [];
  // Loop through the spans and filter for those containing "Oracle"
  for (let span of spans) {
    var spanText = span.textContent.trim();
    if (spanText == "Suggested") {
      cards.push(span);
    }
  }
  // Log the filtered spans only once when scrolled, and onl
  cards.forEach((span) => {
    var deleteLmao =
      span.parentElement.parentElement.parentElement.parentElement.parentElement
        .parentElement;
    deleteLmao.remove();
    console.log("Removed Ad!");
    // }
  });
}

function removeTrashPostings(div) {
  // Get the scrollable div, they might change the name which is pretty annoying :/
  if (div) {
    // Updated to the new name for divs
    const parentDiv = document.getElementsByClassName("scaffold-layout__list "); // Replace with your parent's class
    // Loop through the child elements of the parent div
    const childDivs = parentDiv[0].children;
    for (let i = 0; i < childDivs.length; i++) {
      const child = childDivs[i];
      // Check if the child div is scrollable
      if (
        child.scrollHeight > child.clientHeight ||
        child.scrollWidth > child.clientWidth
      ) {
        // Attach the event listener to the scrollable div
        console.log("adding event listener");
        clearInterval(intervalDiv);
        scrollDiv = child;
        scrollDiv.addEventListener("scroll", function () {
          scrollDelete(child.className);
        });
      }
    }
    // scrollDiv = document.getElementsByClassName(div);
    // if (scrollDiv[0]) {
    //   clearInterval(intervalDiv); // Stop the interval once the div is found
    //   // Do something with myDiv
    //   scrollDiv[0].addEventListener("scroll", scrollDelete);
    // }
  } else {
    clearInterval(intervalDiv);
    console.log("here? ");
    document.addEventListener("scroll", scrollDeleteSJobs);
  }
}

function removeSuggestedPosts() {
  if (document) {
    clearInterval(intervalDiv);
    document.addEventListener("scroll", scrollDeleteSuggested);
  }
}

// Initial load
let currentURL = window.location.href;
if (
  currentURL.match("https://www.linkedin.com/jobs/search") ||
  currentURL.match("https://www.linkedin.com/jobs/collections")
) {
  //Run the thing
  // Attempt to get the div every 250 milliseconds.
  // This starts the function chain, It first makes sure to get the scrollable div
  intervalDiv = setInterval(
    removeTrashPostings,
    350,
    "jobs-search-results-list",
  );
} else if (currentURL.match("https://www.linkedin.com/jobs")) {
  intervalDiv = setInterval(removeTrashPostings, 350, "");
} else if (currentURL.match("https://www.linkedin.com/feed/")) {
  intervalDiv = setInterval(removeSuggestedPosts, 350);
}

//Start the event listener for navigation
navigation.addEventListener("navigate", (event) => {
  destination = event.destination.url;
  if (
    destination.match("https://www.linkedin.com/jobs/search") ||
    destination.match("https://www.linkedin.com/jobs/collections")
  ) {
    // Remove the existing  event listener
    if (scrollDiv && scrollDiv[0]) {
      scrollDiv[0].removeEventListener("scroll", scrollDelete);
    }
    document.removeEventListener("scroll", scrollDelete);
    document.removeEventListener("scroll", scrollDeleteSuggested);
    // Then restart the whole thing
    intervalDiv = setInterval(
      removeTrashPostings,
      350,
      "scaffold-layout__list",
    );
  } else if (destination.match("https://www.linkedin.com/jobs")) {
    // Remove the existing  event listener
    if (scrollDiv && scrollDiv[0]) {
      scrollDiv[0].removeEventListener("scroll", scrollDelete);
    }
    document.removeEventListener("scroll", scrollDelete);
    document.removeEventListener("scroll", scrollDeleteSuggested);
    // Then restart the whole thing
    intervalDiv = setInterval(removeTrashPostings, 350, "");
  } else if (destination.match("https://www.linkedin.com/feed/")) {
    if (scrollDiv && scrollDiv[0]) {
      scrollDiv[0].removeEventListener("scroll", scrollDelete);
    }
    document.removeEventListener("scroll", scrollDelete);
    document.removeEventListener("scroll", scrollDeleteSuggested);
    intervalDiv = setInterval(removeSuggestedPosts, 350);
  }
});
