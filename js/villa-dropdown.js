// Function to toggle the visibility of a specific dropdown
function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Function to close all open dropdowns
function closeAllDropdowns(event) {
    // Only proceed if the click target is NOT the button that opens the dropdown
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        
        for (let i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Export a setup function to be called from the main HTML script block
export function setupVillasDropdown() {
    // 1. Attach the toggle function to the button
    const dropdownButton = document.getElementById('villas-dropbtn');
    
    // Check if the button exists before attaching the listener
    if (dropdownButton) {
        dropdownButton.addEventListener('click', toggleDropdown);
    }
    
    // 2. Attach the close-on-click-outside logic to the window
    window.addEventListener('click', closeAllDropdowns);
}