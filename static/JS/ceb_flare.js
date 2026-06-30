document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth <= 600) {

    const table = document.querySelector(".responsive-table");
    const headers = table.querySelectorAll("thead th");
    const values = table.querySelectorAll("tbody td");

    let newHTML = "";

    for (let i = 1; i < headers.length; i++) {
      newHTML += `
        <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px; border-radius:6px;">
          <div style="font-weight:600;">${headers[0].innerText}:</div>
          <div>${headers[i].innerText} SCFM</div>
          
          <div style="margin-top:8px; font-weight:600;">
            ${values[0].innerText}:
          </div>
          <div>${values[i].innerText}</div>
        </div>
      `;
    }

    table.outerHTML = newHTML;
  }
});