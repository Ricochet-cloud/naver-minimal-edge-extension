const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const queryInput = document.getElementById("query");
const clearButton = document.getElementById("clearButton");
const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function updateDateTime() {
  const now = new Date();
  clockElement.textContent = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit", minute: "2-digit", hour12: false
  }).format(now);
  dateElement.textContent =
    `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${weekdays[now.getDay()]}`;
}
function updateClearButton() {
  clearButton.hidden = queryInput.value.length === 0;
}
queryInput.addEventListener("input", updateClearButton);
clearButton.addEventListener("click", () => {
  queryInput.value = "";
  updateClearButton();
  queryInput.focus();
});
document.getElementById("searchForm").addEventListener("submit", event => {
  if (!queryInput.value.trim()) {
    event.preventDefault();
    queryInput.focus();
  } else {
    queryInput.value = queryInput.value.trim();
  }
});
updateDateTime();
setInterval(updateDateTime, 1000);
updateClearButton();
