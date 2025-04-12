document.addEventListener("DOMContentLoaded", () => {
    fetch("footer.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
        document.getElementById("current-year").textContent = new Date().getFullYear();
      });
  });