// ==UserScript==
// @name         See All Groups' Exams
// @namespace    http://tampermonkey.net/
// @version      2024-06-11
// @description  try to take over the world!
// @author       You
// @match        https://university.com/exams/view/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

async function fetchOtherPages() {
    // Get the current page number from the URL
    let url = window.location.href;
    let urlParts = url.split('/');
    let currentPageNumber = parseInt(urlParts[urlParts.length - 2]);

    // Get the other parts of the URL
    let firstNumber = urlParts[urlParts.length - 4];
    let secondNumber = urlParts[urlParts.length - 3];
    let finalNumber = urlParts[urlParts.length - 1];

    // Define the base URL
    let baseUrl = "https://university.com/exams/view/";

    // Define an array of page numbers
    let pageNumbers = [1, 2, 3, 4];

    // Remove the current page number from the array
    pageNumbers = pageNumbers.filter(number => number !== currentPageNumber);

    // Sort the remaining page numbers in descending order
    pageNumbers.sort((a, b) => b - a);

    // Fetch the content from the other pages
    for (let i = 0; i < pageNumbers.length; i++) {
        let number = pageNumbers[i];
        let fullUrl = baseUrl + firstNumber + '/' + secondNumber + '/' + number;
        // Special case for page 37
        if (number === 4) {
            fullUrl += '/1698';
        } else {
            // Use 1699 for pages 1, 2, and 3 if the current page is 4
            if (currentPageNumber === 37) {
                fullUrl += '/1699';
            } else {
                fullUrl += '/' + finalNumber;
            }
        }
        console.log(fullUrl)
        await fetch(fullUrl)
            .then(response => response.text())
            .then(data => {
                // Use DOMParser to parse the HTML string into a Document
                let parser = new DOMParser();
                let doc = parser.parseFromString(data, 'text/html');

                // Get the specific div from the fetched page
                let fetchedDiv = doc.getElementById('wrapper');

                // Get the specific div from the current page
                let currentDiv = document.getElementById('wrapper');

                // Append the fetched div after the current div
                currentDiv.parentNode.insertBefore(fetchedDiv, currentDiv.nextSibling);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

// Call the function
fetchOtherPages();