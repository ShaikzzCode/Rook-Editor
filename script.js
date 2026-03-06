const editor = ace.edit("editor");
// editor.setTheme("ace/theme/chrome");
editor.setTheme("ace/theme/tomorrow_night");
editor.session.setMode("ace/mode/html");

// Enable the Ace editor's autocompletion feature
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

const outputFrame = document.getElementById("output-frame");

// Attach an event listener to the editor that runs the code on change
editor.session.on("change", function () {
  const code = editor.getValue();
  outputFrame.contentDocument.open();
  outputFrame.contentDocument.write(code);
  outputFrame.contentDocument.close();
});

// Set the default content in the editor
const initialContent = `<!DOCTYPE html>
<html>
<head>
    <title>My HTML Page</title>
    <style type="text/css">
        /*css*/
    </style>
</head>
<body>
    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>
    
    <script type="text/javascript">
        // script
    </script>
</body>
</html>`;

editor.setValue(initialContent, -1); // Set content without moving the cursor

// Refresh the editor to ensure it's properly displayed
editor.resize();

// Font size buttons code here...
const plusBtn = document.getElementById("plus_btn");
const minusBtn = document.getElementById("minus_btn");
const mainEditor = document.getElementById("editor");
const output = document.getElementById("output-container");
const handle = document.getElementById("handle");
const container = document.getElementById("main_parent");
const dragger_frame = document.getElementById("dragger_frame");

let isResizing = false;
let startX, initialWidth;

handle.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isResizing = true;
  startX = e.clientX;
  initialWidth = parseFloat(getComputedStyle(mainEditor).width);
  dragger_frame.style.display = "block";
});
handle.addEventListener('mouseup',(e) => {
  dragger_frame.style.display = "none";
})

document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;
  const newWidth = initialWidth + e.clientX - startX;

  // Calculate the current right edge position
  const currentRightEdge = newWidth + mainEditor.getBoundingClientRect().left;

  // Get the width of the screen
  const screenWidth = window.innerWidth;

  if (screenWidth - currentRightEdge <= 150) {
    // Stop resizing when it's within 100px of the right edge
    return;
  }

  mainEditor.style.width = newWidth + "px";
  output.style.width = container.offsetWidth - newWidth - 5 + "px";
});

document.addEventListener("mouseup", () => {
  isResizing = false;
});

mainEditor.style.fontSize = "16px";

function updateFontSizeButtons() {
  // Get the current font size of the mainEditor
  const currentFontSize = window
    .getComputedStyle(mainEditor, null)
    .getPropertyValue("font-size");

  // Parse the current font size as a number (remove 'px' unit)
  const currentSize = parseFloat(currentFontSize);

  // Disable the minus button if the font size is less than or equal to 8px
  minusBtn.disabled = currentSize <= 10;

  // Disable the plus button if the font size is greater than or equal to 30px
  plusBtn.disabled = currentSize >= 30;

  // Apply the background color to the disabled font size buttons
  if (minusBtn.disabled) {
    minusBtn.style.backgroundColor = "#ddd";
  } else {
    minusBtn.style.backgroundColor = "white"; // Reset to the default background color
  }

  if (plusBtn.disabled) {
    plusBtn.style.backgroundColor = "#ddd";
  } else {
    plusBtn.style.backgroundColor = "white"; // Reset to the default background color
  }
}

minusBtn.onclick = () => {
  if (!minusBtn.disabled) {
    // Get the current font size of the mainEditor
    const currentFontSize = window
      .getComputedStyle(mainEditor, null)
      .getPropertyValue("font-size");

    // Parse the current font size as a number (remove 'px' unit)
    const currentSize = parseFloat(currentFontSize);

    // Decrease the font size by a certain amount (e.g., 2 pixels)
    const newSize = currentSize - 2;

    // Limit the font size to a minimum of 10px
    const finalSize = Math.max(newSize, 10);

    // Apply the new font size to the mainEditor
    mainEditor.style.fontSize = finalSize + "px";

    // Update the button state after changing the font size
    updateFontSizeButtons();
  }
};

plusBtn.onclick = () => {
  if (!plusBtn.disabled) {
    // Get the current font size of the mainEditor
    const currentFontSize = window
      .getComputedStyle(mainEditor, null)
      .getPropertyValue("font-size");

    // Parse the current font size as a number (remove 'px' unit)
    const currentSize = parseFloat(currentFontSize);

    // Increase the font size by a certain amount (e.g., 2 pixels)
    const newSize = currentSize + 2;

    // Limit the font size to a maximum of 30px
    const finalSize = Math.min(newSize, 30);

    // Apply the new font size to the mainEditor
    mainEditor.style.fontSize = finalSize + "px";

    // Update the button state after changing the font size
    updateFontSizeButtons();
  }
};

// Initial check for button state
updateFontSizeButtons();

// Control + S
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "s") {
    // Perform your action here when Ctrl + S is pressed
    event.preventDefault(); // Prevent the default browser save action
    document.getElementById("custom-dialog-parent").style.display = "flex";
  }
});

// Control + T
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "t") {
    // Perform your action here when Ctrl + T is pressed
    event.preventDefault(); // Prevent the default browser open new tab action
  }
});

// Show the custom dialog when the "Save As Html File" button is clicked
document.getElementById("saveBtn").addEventListener("click", function () {
  document.getElementById("custom-dialog-parent").style.display = "flex";
});

// Handle the custom dialog save button
document
  .getElementById("custom-dialog-save")
  .addEventListener("click", function () {
    const content = editor.getValue();
    const fileName = document.getElementById("filename").value;
    if (fileName.trim() !== "") {
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9_-]/g, "");
      const finalFileName = sanitizedFileName + ".html";
      const blob = new Blob([content], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = finalFileName;
      a.click();
    }
    document.getElementById("custom-dialog-parent").style.display = "none";
  });

// Handle the custom dialog cancel button
document
  .getElementById("custom-dialog-cancel")
  .addEventListener("click", function () {
    document.getElementById("custom-dialog-parent").style.display = "none";
  });

// Ensure that the dialog is initially hidden
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("custom-dialog-parent").style.display = "none";
});

// Preventing Ctrl+R and F5 to refresh the page
// Show the custom alert when the "Ctrl+R" key is pressed
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "r") {
    event.preventDefault(); // Prevent the default browser refresh action
    document.getElementById("custom-alert-parent").style.display = "flex";
  }
});

// Show the custom alert when the "F5" key is pressed
document.addEventListener("keydown", function (event) {
  if (event.key === "F5") {
    event.preventDefault(); // Prevent the default browser refresh action
    document.getElementById("custom-alert-parent").style.display = "flex";
  }
});

// Handle the custom alert OK button
document
  .getElementById("custom-alert-ok-button")
  .addEventListener("click", function () {
    location.reload(); // Reload the page
  });

// Handle the custom alert Cancel button
document
  .getElementById("custom-alert-cancel-button")
  .addEventListener("click", function () {
    document.getElementById("custom-alert-parent").style.display = "none";
  });
