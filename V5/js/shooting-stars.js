export function initShootingStarsGrid() {
  const container = document.querySelector(".problem-grid-bg");
  if (!container) return;

  const squareSize = 28; // 20% larger than 24px
  const strokeColor = "#ffffff"; // White grid lines

  function drawGrid() {
    container.innerHTML = "";
    
    // Get actual layout dimensions with screen fallback to cover full viewport area
    const width = Math.max(container.offsetWidth || 0, window.innerWidth || 0);
    const height = Math.max(container.offsetHeight || 0, window.innerHeight || 0);

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("class", "interactive-grid-pattern-svg");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    const patternId = "brand-interactive-grid-pattern";

    pattern.setAttribute("id", patternId);
    pattern.setAttribute("width", squareSize);
    pattern.setAttribute("height", squareSize);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("x", "-1");
    pattern.setAttribute("y", "-1");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${squareSize} 0 L 0 0 0 ${squareSize}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", "3");

    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    // Background rect filling with grid lines pattern
    const gridRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    gridRect.setAttribute("width", "100%");
    gridRect.setAttribute("height", "100%");
    gridRect.setAttribute("fill", `url(#${patternId})`);
    svg.appendChild(gridRect);

    // Render SVG cells for hover interaction
    const cellsSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cellsSvg.setAttribute("x", "-1");
    cellsSvg.setAttribute("y", "-1");
    cellsSvg.setAttribute("class", "interactive-cells-overlay");
    cellsSvg.style.overflow = "visible";

    // Extra columns and rows as safety margin to ensure full coverage
    const cols = Math.ceil(width / squareSize) + 4;
    const rows = Math.ceil(height / squareSize) + 4;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cell.setAttribute("x", c * squareSize);
        cell.setAttribute("y", r * squareSize);
        cell.setAttribute("width", squareSize);
        cell.setAttribute("height", squareSize);
        cell.setAttribute("class", "interactive-grid-cell");
        cellsSvg.appendChild(cell);
      }
    }

    svg.appendChild(cellsSvg);
    container.appendChild(svg);
  }

  // Initial draw
  drawGrid();

  // Redraw grid dynamically on window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(drawGrid, 100);
  });
}
