const launchDate = new Date("2025-12-01T00:00:00").getTime();

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = launchDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML = "We're live!";
  }
}, 1000);

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thanks! We'll notify you when we launch.");
});
