export function createWallpaperPicker() {
    // Inject Styles
    if (!document.getElementById('css-wp')) {
        const link = document.createElement('link');
        link.id = 'css-wp'; link.rel = 'stylesheet';
        link.href = './src/apps/wallpaper-picker/styles.css';
        document.head.appendChild(link);
    }

    const container = document.createElement('div');
    container.className = 'wp-container';
    container.innerHTML = `
        <div class="wp-status">Loading wallpapers...</div>
        <div class="wp-grid"></div>
    `;

    const grid = container.querySelector('.wp-grid');
    const status = container.querySelector('.wp-status');
    const wallpaperPath = './assets/wallpapers/';

    // --- The Magic: Fetch the folder content ---
    fetch(wallpaperPath)
        .then(response => response.text())
        .then(htmlText => {
            // 1. Parse the HTML returned by Python server
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            
            // 2. Find all links (<a> tags)
            const links = Array.from(doc.querySelectorAll('a'));

            // 3. Filter for image files
            const images = links
                .map(link => link.getAttribute('href'))
                .filter(href => /\.(jpg|jpeg|png|gif|webp)$/i.test(href));

            // 4. Render
            if (images.length === 0) {
                status.innerText = "No images found in /assets/wallpapers/";
                return;
            }

            status.innerText = `Found ${images.length} wallpapers. Click to apply.`;
            
            images.forEach(imgName => {
                const imgUrl = wallpaperPath + imgName;
                
                const img = document.createElement('img');
                img.className = 'wp-thumb';
                img.src = imgUrl;
                img.title = imgName;

                img.onclick = () => {
                    // Update the Desktop Background
                    const desktop = document.getElementById('desktop');
                    desktop.style.backgroundImage = `url('${imgUrl}')`;
                    desktop.style.backgroundSize = 'cover'; // Modern fit
                    desktop.style.backgroundPosition = 'center';
                };

                grid.appendChild(img);
            });
        })
        .catch(err => {
            console.error(err);
            status.innerText = "Error: Could not read folder. (Server listing might be disabled)";
        });

    return container;
}