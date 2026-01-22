/**
 * Create an HTMLImageElement to give a visual display of the goal.
 * This will prefix the image source with "assets/iamges/" to make
 * sure the correct path is created. It will also add the alt text
 * for whenever the image link is broken.
 *
 * @param item {{image: string, description: string}}
 * @returns {HTMLImageElement}
 */
function createImageElement(item) {
    const img = document.createElement("img");
    img.src = "assets/images/" + item.image;
    img.alt = item.description;
    return img;
}

/**
 * Create an HTMLDivElement for the description within the grid cell.
 * This will also add the correct classname and text content to the cell.
 *
 * @param item {{description: string}}
 * @returns {HTMLDivElement}
 */
function createDescriptionElement(item) {
    const desc = document.createElement("div");
    desc.className = "description";
    desc.textContent = item.description;
    return desc;
}

/**
 * Create an HTMLDivElement with the correct CSS class name
 * which is dependent on if the goal was completed or not.
 *
 * @param item {{done: boolean}}
 * @returns {HTMLDivElement}
 */
function createGridCell(item) {
    const cell = document.createElement("div");
    cell.className = item.done ? "cell done" : "cell";
    return cell;
}

/**
 * Take a list of goals and convert the first 25 to div elements
 * including an HTMLImageElement and an HTMLDivElement displaying
 * the goal.
 *
 * @param goals {{description: string, image: string, done: boolean}[]}
 * @returns {HTMLDivElement[]}
 */
function convertGoalsToGridCells(goals) {
    return goals.slice(0, 25).map(goal => {
        const img = createImageElement(goal);
        const desc = createDescriptionElement(goal);
        const cell = createGridCell(goal);

        cell.append(img, desc);

        return cell;
    });
}

/**
 * Take a set of HTML nodes and appends them to the grid. For optimal
 *   use, this should include exactly 25 cells.
 *
 * @param cells {Node[]}
 */
function appendCellsToGrid(cells) {
    const grid = document.getElementById("grid");
    grid.append(...cells);
}

/**
 * Load the CSV file from the root of the project and convert it into an
 * javascript array containing the images and labels to display within
 * the grid.
 *
 * This function also strips the header from the CSV, which does not
 * need to be displayed.
 *
 * @returns {Promise<{description: string, image: string, done: boolean}[]>}
 */
async function loadGoalsFromFile() {
    return (await fetch("goals.csv")
        .then((response) => response.text())
        .then((data) =>
            data.split("\n")
                .splice(1) // Remove header row.
                .map((line) => {
                    const [description, image, done] = line.split(",");
                    return {description, image, done: done === "true"};
                })));
}

function createCellWithContent(content) {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
}

function createTableRow(event) {
    const row = document.createElement("tr");
    row.append(
        createCellWithContent(event.description),
        createCellWithContent(event.time)
    );
    return row;
}

function convertTimelineToTableRows(events) {
    return events.map(event => createTableRow(event));
}

function appendRowsToTable(rows) {
    const tableBody = document.getElementById("events");
    tableBody.append(...rows);
}

async function loadTimelineFromFile() {
    return (await fetch("updates.csv")
        .then((response) => response.text())
        .then((data) =>
            data.split("\n")
                .splice(1) // Remove header row.
                .map((line) => {
                    const [description, time] = line.split(",");
                    return {description, time};
                })));
}

(async () => {
    appendCellsToGrid(convertGoalsToGridCells(await loadGoalsFromFile()));
    appendRowsToTable(convertTimelineToTableRows(await loadTimelineFromFile()));
})();