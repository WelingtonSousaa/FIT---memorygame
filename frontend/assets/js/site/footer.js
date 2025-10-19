document.addEventListener("DOMContentLoaded", function() {
    fetch('/page/site/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});