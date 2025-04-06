document.addEventListener("DOMContentLoaded", () => {
    
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
        });

    const menuButton = document.querySelector(".mobile-menu-btn");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("open");
            const icon = menuButton.querySelector(".lucide");

            if (icon) {
                icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
                lucide.createIcons(); // Refresh icons
            }
        });

        document.querySelectorAll(".mobile-link").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("open");
                const icon = menuButton.querySelector(".lucide");
                
                if (icon) {
                    icon.setAttribute("data-lucide", "menu");
                    lucide.createIcons(); // Refresh icons
                }
            });
        });
    }

    const loadIcons = () => {
        document.querySelectorAll("[data-lucide]").forEach(icon => {
            const iconName = icon.getAttribute("data-lucide");
            fetch(`https://cdnjs.cloudflare.com/ajax/libs/lucide/1.3.0/icons/${iconName}.svg`)
                .then(response => response.text())
                .then(svg => {
                    icon.innerHTML = new DOMParser()
                        .parseFromString(svg, "image/svg+xml")
                        .documentElement.innerHTML;
                })
                .catch(error => console.error(`Error loading icon ${iconName}:`, error));
        });
    };

    loadIcons();
});
