const datetime = document.querySelector(".condition>:nth-child(2)");
const input = document.querySelector("input");
const searchLocation = document.querySelector(".search>div>button");

searchLocation.addEventListener("click", (event) => {
  console.log(event.target.tagName);
  if (event.target.tagName == "BUTTON") {
    const location = event.target.parentNode.childNodes[1].value;
    event.target.parentNode.childNodes[1].value = "";
    search(location);
  } else if (event.target.tagName == "I") {
    const location = event.target.parentNode.parentNode.childNodes[1].value;
    event.target.parentNode.parentNode.childNodes[1].value = "";
    search(location);
  }
});
input.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    console.log(event.target.value);
    document.querySelector(
      "body > div.current > div.search > div > input[type=text]"
    ).disabled = true;
    document.querySelector(
      "body > div.current > div.search > div > button"
    ).disabled = true;
    const location = event.target.value;
    event.target.value = "";
    search(location);
  }
});

function search(location) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      q: location,
    }),
  };

  fetch("https://clima-7bmz.onrender.com/", options)
    .then((response) => {
      if (response.ok) {
        document.querySelector(
          "body > div.current > div.search > div > input[type=text]"
        ).disabled = false;
        document.querySelector(
          "body > div.current > div.search > div > button"
        ).disabled = false;
        return response.json();
      }
      throw new Error("Request failed");
    })
    .then((data) => {
      console.log("Console in frontend: ", data);
      writeData(data);
    })
    .catch((error) => {
      console.log("Network error: ", error);
    });
}
function selector(querySelector, content) {
  document.querySelector(querySelector).textContent = content;
}
//https://stackoverflow.com/questions/25275696/javascript-format-date-time
function formatDate(dateTime) {
  let hours = new Date(dateTime).getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : "12";
  return hours + ampm;
}
function writeData(data) {
  selector(".city", data.location.region + ", " + data.location.country);

  selector(
    ".datetime",
    new Date(data.location.localtime).toLocaleString("es-es", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  ); //https://stackdatetime998624/day-name-from-date-in-js

  document
    .querySelector(".condition > img")
    .setAttribute("src", data.current.condition.icon);

  selector(".condition > :nth-child(2)", Math.floor(data.current.temp_c) + "°");

  selector(".condition > :nth-child(3)", data.current.condition.text);
  selector(
    ".other-data > :nth-child(1) > :nth-child(1)",
    Math.floor(data.forecast.forecastday[0].day.maxtemp_c) + "°"
  );
  selector(
    ".other-data > :nth-child(2) > :nth-child(1)",
    Math.floor(data.current.wind_mph) + "mph"
  );
  selector(
    ".other-data > :nth-child(3) > :nth-child(1)",
    data.forecast.forecastday[0].astro.sunrise
  );
  selector(
    ".other-data > :nth-child(4) > :nth-child(1)",
    Math.floor(data.forecast.forecastday[0].day.mintemp_c) + "°"
  );
  selector(
    ".other-data > :nth-child(5) > :nth-child(1)",
    data.current.humidity + "%"
  );
  selector(
    ".other-data > :nth-child(6) > :nth-child(1)",
    data.forecast.forecastday[0].astro.sunset
  );

  for (let i = 1; i <= 7; i++) {
    selector(
      `.forecast > div > :nth-child(${i}) > :nth-child(1)`,
      formatDate(data.forecast.forecastday[0].hour[3 * i].time)
    );

    document
      .querySelector(`.today-forecast > :nth-child(${i}) > :nth-child(2)`)
      .setAttribute(
        "src",
        data.forecast.forecastday[0].hour[3 * i].condition.icon
      );

    selector(
      `.today-forecast > :nth-child(${i}) > :nth-child(3)`,
      Math.floor(data.forecast.forecastday[0].hour[3 * i].temp_c) + "°"
    );
  }
}
