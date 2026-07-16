export function initShootingStarsGrid() {
  const container = document.querySelector(".problem-grid-bg");
  if (!container) return;

  // Clear previous grid
  container.innerHTML = "";

  const squareSize = 24; // Dense premium grid size
  const strokeColor = "rgba(107, 98, 172, 0.11)"; // Brand purple grid lines

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
  path.setAttribute("stroke-width", "1");

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

  // Calculate grid count dynamically based on element dimensions
  const rect = container.getBoundingClientRect();
  const cols = Math.ceil(rect.width / squareSize) + 1;
  const rows = Math.ceil(rect.height / squareSize) + 1;

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
