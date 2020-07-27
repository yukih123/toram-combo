javascript:( function () {
    // To crawl skills from a site.
    // Doesn't work on some pages meybe because of its markup differences.
    var headings = document.querySelectorAll('article h3');
    var walker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, {acceptNode: (node) => node.localName == 'table'});
    var items = {};
    for (const heading of headings) {
        const name = heading.textContent;
        items[name] = {};
        walker.currentNode = heading;
        const table = walker.nextNode();
        if (!table) continue;
        for (const row of table.querySelectorAll('tr')) {
            const cells = row.querySelectorAll('td');
            if (!cells[1]) continue;
            items[name][cells[0].textContent] = cells[1].textContent;
        }
    }
    var csv = '';
    for (const key of Object.keys(items)) {
        if (typeof items[key]["消費MP"] == 'undefined' || items[key]["消費MP"] == 'パッシブ') continue;
        csv += `${key},${items[key]["消費MP"]}\n`;
    }
    console.log(csv);
    navigator.clipboard.writeText(csv);
})();
