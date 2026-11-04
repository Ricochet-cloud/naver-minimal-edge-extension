const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const queryInput = document.getElementById("query");
const clearButton = document.getElementById("clearButton");

const weatherBadge = document.getElementById("weatherBadge");
const weatherIcon = document.getElementById("weatherIcon");
const weatherTemp = document.getElementById("weatherTemp");
const weatherDesc = document.getElementById("weatherDesc");
const weatherCity = document.getElementById("weatherCity");

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

/* =========================================================
   오늘의 날씨 기능 (Open-Meteo & Geolocation)
   ========================================================= */

const KOREAN_CITIES = [
  { name: "서울", lat: 37.5665, lon: 126.9780 },
  { name: "인천", lat: 37.4563, lon: 126.7052 },
  { name: "수원", lat: 37.2636, lon: 127.0286 },
  { name: "춘천", lat: 37.8813, lon: 127.7298 },
  { name: "강릉", lat: 37.7519, lon: 128.8761 },
  { name: "대전", lat: 36.3504, lon: 127.3845 },
  { name: "청주", lat: 36.6424, lon: 127.4890 },
  { name: "세종", lat: 36.4800, lon: 127.2890 },
  { name: "대구", lat: 35.8714, lon: 128.6014 },
  { name: "포항", lat: 36.0190, lon: 129.3435 },
  { name: "부산", lat: 35.1796, lon: 129.0756 },
  { name: "울산", lat: 35.5384, lon: 129.3114 },
  { name: "창원", lat: 35.2280, lon: 128.6811 },
  { name: "전주", lat: 35.8242, lon: 127.1480 },
  { name: "광주", lat: 35.1595, lon: 126.8526 },
  { name: "목포", lat: 34.8118, lon: 126.3922 },
  { name: "여수", lat: 34.7604, lon: 127.6622 },
  { name: "제주", lat: 33.4996, lon: 126.5312 }
];

function getNearestCity(lat, lon) {
  let closest = KOREAN_CITIES[0];
  let minDistance = Infinity;
  for (const city of KOREAN_CITIES) {
    const d = Math.hypot(city.lat - lat, city.lon - lon);
    if (d < minDistance) {
      minDistance = d;
      closest = city;
    }
  }
  return minDistance < 1.6 ? closest.name : "내 위치";
}

function getWeatherMeta(code, isDay = 1) {
  if (code === 0) {
    return isDay
      ? { text: "맑음", svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>` }
      : { text: "맑은 밤", svg: `<svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>` };
  }
  if (code === 1 || code === 2) {
    return isDay
      ? { text: code === 1 ? "대체로 맑음" : "구름 조금", svg: `<svg viewBox="0 0 24 24"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41"></path><path d="M15.5 12A4.5 4.5 0 0 0 8 13.5"></path><path d="M17.5 19H9a5 5 0 0 1 0-10c.34 0 .67.04 1 .1A6 6 0 0 1 20 14.5a4.5 4.5 0 0 1-2.5 4.5Z"></path></svg>` }
      : { text: "구름 조금", svg: `<svg viewBox="0 0 24 24"><path d="M11 5a5 5 0 0 0 5 5 5 5 0 0 0 4-2"></path><path d="M17.5 19H9a5 5 0 0 1 0-10c.34 0 .67.04 1 .1A6 6 0 0 1 20 14.5a4.5 4.5 0 0 1-2.5 4.5Z"></path></svg>` };
  }
  if (code === 3) {
    return { text: "흐림", svg: `<svg viewBox="0 0 24 24"><path d="M17.5 19H9a5 5 0 0 1 0-10c.34 0 .67.04 1 .1A6 6 0 0 1 20 14.5a4.5 4.5 0 0 1-2.5 4.5Z"></path></svg>` };
  }
  if (code === 45 || code === 48) {
    return { text: "안개", svg: `<svg viewBox="0 0 24 24"><path d="M4 10h16M4 14h16M7 18h10M6 6h12"></path></svg>` };
  }
  if ([51, 53, 55].includes(code)) {
    return { text: "이슬비", svg: `<svg viewBox="0 0 24 24"><path d="M20 14.5A4.5 4.5 0 0 0 17.5 10H16a6 6 0 0 0-11.8 1.5A5 5 0 0 0 7 19h10"></path><line x1="8" y1="19" x2="7" y2="21"></line><line x1="12" y1="19" x2="11" y2="21"></line><line x1="16" y1="19" x2="15" y2="21"></line></svg>` };
  }
  if ([61, 63, 65, 80, 81, 82].includes(code)) {
    return { text: code >= 80 ? "소나기" : "비", svg: `<svg viewBox="0 0 24 24"><path d="M20 14.5A4.5 4.5 0 0 0 17.5 10H16a6 6 0 0 0-11.8 1.5A5 5 0 0 0 7 19h10"></path><line x1="8" y1="19" x2="6" y2="22"></line><line x1="12" y1="19" x2="10" y2="22"></line><line x1="16" y1="19" x2="14" y2="22"></line></svg>` };
  }
  if (code === 66 || code === 67) {
    return { text: "진눈깨비", svg: `<svg viewBox="0 0 24 24"><path d="M20 14.5A4.5 4.5 0 0 0 17.5 10H16a6 6 0 0 0-11.8 1.5A5 5 0 0 0 7 19h10"></path><line x1="9" y1="19" x2="7" y2="22"></line><circle cx="14" cy="21" r="1" fill="currentColor"></circle></svg>` };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { text: "눈", svg: `<svg viewBox="0 0 24 24"><path d="M20 14.5A4.5 4.5 0 0 0 17.5 10H16a6 6 0 0 0-11.8 1.5A5 5 0 0 0 7 19h10"></path><circle cx="8" cy="21" r="1.2" fill="currentColor"></circle><circle cx="12" cy="21" r="1.2" fill="currentColor"></circle><circle cx="16" cy="21" r="1.2" fill="currentColor"></circle></svg>` };
  }
  if ([95, 96, 99].includes(code)) {
    return { text: "뇌우", svg: `<svg viewBox="0 0 24 24"><path d="M20 14.5A4.5 4.5 0 0 0 17.5 10H16a6 6 0 0 0-11.8 1.5A5 5 0 0 0 7 19h5"></path><path d="m13 15-3 5h4l-2 4 6-7h-4l2-2h-3z" fill="currentColor"></path></svg>` };
  }
  return { text: "구름", svg: `<svg viewBox="0 0 24 24"><path d="M17.5 19H9a5 5 0 0 1 0-10c.34 0 .67.04 1 .1A6 6 0 0 1 20 14.5a4.5 4.5 0 0 1-2.5 4.5Z"></path></svg>` };
}

function renderWeather(data) {
  const meta = getWeatherMeta(data.code, data.isDay);
  weatherIcon.innerHTML = meta.svg;
  weatherTemp.textContent = `${Math.round(data.temp)}°`;
  weatherDesc.textContent = meta.text;
  weatherCity.textContent = data.cityName ? `(${data.cityName})` : "";

  const minMaxText = (data.minTemp !== undefined && data.maxTemp !== undefined)
    ? `\n최저 ${data.minTemp}° / 최고 ${data.maxTemp}°`
    : "";
  weatherBadge.title = `네이버 날씨 자세히 보기\n${data.cityName || "내 위치"} · ${meta.text} ${Math.round(data.temp)}°C${minMaxText}`;
  weatherBadge.href = `https://search.naver.com/search.naver?query=${encodeURIComponent((data.cityName || "") + " 날씨")}`;
}

async function fetchWeather(lat, lon, cityName) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FSeoul`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
    const json = await res.json();
    const data = {
      temp: json.current.temperature_2m,
      code: json.current.weather_code,
      isDay: json.current.is_day !== undefined ? json.current.is_day : 1,
      maxTemp: Math.round(json.daily.temperature_2m_max[0]),
      minTemp: Math.round(json.daily.temperature_2m_min[0]),
      cityName: cityName,
      updatedAt: Date.now()
    };
    localStorage.setItem("naver_minimal_weather", JSON.stringify(data));
    renderWeather(data);
  } catch (error) {
    console.warn("날씨 정보를 불러오는 중 오류가 발생했습니다:", error);
  }
}

function initWeather() {
  const CACHE_DURATION = 25 * 60 * 1000; // 25분 캐시
  const cached = localStorage.getItem("naver_minimal_weather");
  let hasValidCache = false;

  if (cached) {
    try {
      const data = JSON.parse(cached);
      renderWeather(data);
      if (Date.now() - data.updatedAt < CACHE_DURATION) {
        hasValidCache = true;
      }
    } catch (e) {
      localStorage.removeItem("naver_minimal_weather");
    }
  }

  if (hasValidCache) return;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const cityName = getNearestCity(latitude, longitude);
        fetchWeather(latitude, longitude, cityName);
      },
      () => {
        // 위치 권한 거부 또는 실패 시 기본 서울 좌표 사용
        fetchWeather(37.5665, 126.9780, "서울");
      },
      { timeout: 6000, maximumAge: 600000 }
    );
  } else {
    fetchWeather(37.5665, 126.9780, "서울");
  }
}

updateDateTime();
setInterval(updateDateTime, 1000);
updateClearButton();

initWeather();
setInterval(initWeather, 20 * 60 * 1000);
