document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, starting fetch...");
    fetch("navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Fetch successful, inserting navbar...");
            document.getElementById("navbar").innerHTML = data;

            const menuButton = document.querySelector(".mobile-menu-btn");
            const mobileMenu = document.querySelector(".mobile-menu");
            const menuIcon = menuButton?.querySelector(".menu-icon");

            if (menuButton && mobileMenu && menuIcon) {
                console.log("Elements found, adding event listeners...");
                menuButton.addEventListener("click", () => {
                    console.log("Menu button clicked...");
                    const isOpen = mobileMenu.classList.toggle("open");
                    
                    menuIcon.innerHTML = isOpen 
                        ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
                        : '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
                });

                document.querySelectorAll(".mobile-link").forEach(link => {
                    link.addEventListener("click", () => {
                        mobileMenu.classList.remove("open");
                        menuIcon.innerHTML = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
                    });
                });
            } else {
                console.error("One or more elements not found:", { menuButton, mobileMenu, menuIcon });
            }
        })
        .catch(error => console.error("Error loading navbar:", error));
});