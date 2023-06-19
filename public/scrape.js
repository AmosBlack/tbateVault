
//chap-text :$("#chapterText")[0].innerText
//chap-links :$("#cm1 >tb- li > a")

fetch("https://lnreader.org/the-beginning-after-the-end-535558")
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html,'text/html')

        const links = doc.querySelectorAll('#cm1 >tb- li > a');

        links.forEach(link => {
          const href = link.getAttribute('href');
          const text = link.textContent;
          console.log(text + ": " + href);
        });
    })
    .catch(error => {
        console.error("Error -> " + error)
    })
    