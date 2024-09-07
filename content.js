/* Define some variables */
let internships = [];
let pos = [];

/* Get the table */
function getTable() {
    return document.querySelector("#BB308197177_300 > table");
}

/* Define a function that check when the page is loaded */
function checkPageLoaded() {
    return new Promise((resolve) => {
        let counter = 0;
        const checkTable = setInterval(() => {
            let table = getTable();
            if (table) {
                clearInterval(checkTable);
                resolve(table);
            } else {
                counter++;
                if (counter > 10) {
                    clearInterval(checkTable);
                    resolve(null);
                }
            }
        }, 500);
    })
}

/* Get all the internships */
function getAllinternships() {
    /* Get the rows of the table */
    let rows = getTable().querySelectorAll("tbody tr");

    /* Create the object */
    rows.forEach((row) => {
        /* Get the columns */
        let cols = row.querySelectorAll("td");

        /* Get all the information */
        let onClickButton = cols[1];
        let title = cols[1].innerText;
        let company = cols[2].innerText;
        let location = cols[3].innerText;
        let id = cols[5].innerText;
        let type = cols[6].innerText;
        let registered = cols[7].innerText;
        let available = cols[8].innerText;
        let creation = cols[10].innerText;

        /* Find if the internship is in the local storage */
        let cat = localStorage.getItem(id);
        if (!cat) {
            cat = "uncategorized";
        }
        
        /* Add the intership to the list */
        internships.push({
            title: title,
            company: company,
            location: location,
            id: id,
            type: type,
            registered: registered + " / " + available,
            creation: creation,
            category: cat,
            onClickButton: onClickButton,
        });
        pos.push(id);
    });

    /* Return all the internships */
    return internships;
}

function changeAction(event) {
    /* Row id */
    let id = event.target.id.split("-")[1];
    let idPos = pos.indexOf(id);

    /* Change the category of the intership */
    internships[idPos].category = event.target.value;

    /* Add the new category to the local storage */
    localStorage.setItem(id, event.target.value);

    /* Refresh the table */
    populateTable("uncategorized");
    populateTable("interested");
    populateTable("not-for-me");
}


/* Table creation */
const headers = ["Action", "Title", "Company", "Location", "ID", "Type", "Spots", "Creation date"];
function createTable(type,caption) {
    /* Create the table */
    let table = document.createElement("table");
    table.classList.add("grid");
    table.id = "table-" + type;

    /* Add the caption */
    let captionElement = document.createElement("caption");
    captionElement.innerText = caption;
    table.appendChild(captionElement);

    /* Add the thead */
    let head = document.createElement("thead");
    table.appendChild(head);

    /* Add the headers */
    let headerRow = document.createElement("tr");
    headers.forEach((header) => {
        let th = document.createElement("th");
        th.innerText = header;
        headerRow.appendChild(th);
    });
    head.appendChild(headerRow);

    /* Add the tbody */
    let body = document.createElement("tbody");
    table.appendChild(body);

    /* Return the table */
    return table;
}
function populateTable(type) {
    /* Select the table */
    let tbody = document.querySelector("#table-" + type).querySelector("tbody");

    /* Remove all the rows */
    let rows = tbody.querySelectorAll("tr");
    rows.forEach((row) => {
        row.remove();
    });

    /* Populate the table */
    let counter = 0;
    internships.forEach((internship) => {
        if (internship.category == type) {
            /* Create the row */
            let row = document.createElement("tr");
            row.id = "row-" + internship.id;

            /* Create the select option */
            let td = document.createElement("td");
            let select = document.createElement("select");
            select.id = "select-" + internship.id;
            select.addEventListener("change", changeAction);
            let options = [
                { value: "uncategorized", text: "Uncategorized" },
                { value: "interested", text: "Interested" },
                { value: "not-for-me", text: "Not for me" }
            ]
            options.forEach((option) => {
                let opt = document.createElement("option");
                opt.value = option.value;
                opt.selected = option.value == type;
                opt.innerText = option.text;
                select.appendChild(opt);
            });
            td.appendChild(select);
            row.appendChild(td);
            Object.keys(internship).forEach((key) => {
                if (key == "category" || key == "onClickButton") {
                    return;
                }
                let td = document.createElement("td");
                td.innerText = internship[key];
                if (key == "title") {
                    td.addEventListener("click", () => {
                        internship.onClickButton.click();
                    });
                }
                row.appendChild(td);
            });
            /* Append the row */
            tbody.appendChild(row);
            /* Increase the counter */
            counter++;
        }
    });

    if (counter == 0) {
        let row = document.createElement("tr");
        row.id = "row-no-internships-" + type;
        let td = document.createElement("td");
        td.innerText = "No internships found in this category";
        td.colSpan = headers.length;
        row.appendChild(td);
        tbody.appendChild(row);
    }
}


/* Get if the hash is the correct one */
checkPageLoaded().then((table) => {
    /* Check if the table has been found */
    if (!table) {
        return;
    }

    /* Remove element with filter class */
    let filters = document.querySelectorAll(".filter");
    filters.forEach((filter) => {
        filter.remove();
    });

    /* Get the internships */
    getAllinternships();

    /* Create a div element after the table */
    let div = document.createElement("div");
    div.classList.add('table-container');
    table.parentNode.appendChild(div);

    /* Create the uncategorized table */
    let uncategorizedTable = createTable("uncategorized", "Uncategorized");
    div.appendChild(uncategorizedTable);
    populateTable("uncategorized");

    /* Create the interested table */
    let interestedTable = createTable("interested", "Interested");
    div.appendChild(interestedTable);
    populateTable("interested");

    /* Create the not for me table */
    let notForMeTable = createTable("not-for-me", "Not for me");
    div.appendChild(notForMeTable);
    populateTable("not-for-me");

    /* Hide the original table */
    table.style.display = "none";
});

/* Every 1 second check if prtl is defined */
setInterval(() => {
    if (typeof window.prtl != "undefined") {
        console.log("prtl is defined");
    }
});
