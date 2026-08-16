const CLOUD_NAME = "md1gg2w8";
const UPLOAD_PRESET = "edit_orders";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/myegdboy";


/* --------------------------------
   CLOUDINARY
-------------------------------- */

const uploadedReferences = [];
const uploadedFootage = [];


const cloudinaryWidget = (type) => {

    return cloudinary.createUploadWidget(
        {
            cloudName: CLOUD_NAME,
            uploadPreset: UPLOAD_PRESET,

            sources: [
                "local",
                "url",
                "google_drive",
                "dropbox"
            ],

            multiple: true,

            clientAllowedFormats:
                type === "footage"
                    ? ["mp4", "mov", "webm", "m4v"]
                    : ["jpg", "jpeg", "png", "webp"],

            maxFileSize:
                type === "footage"
                    ? 500000000
                    : 20000000,

            folder: "edit-orders",

            showAdvancedOptions: false,

            styles: {
                palette: {
                    window: "#FFFFFF",
                    windowBorder: "#111111",
                    tabIcon: "#111111",
                    menuIcons: "#111111",
                    textDark: "#111111",
                    textLight: "#FFFFFF",
                    link: "#111111",
                    action: "#111111",
                    inactiveTabIcon: "#999999",
                    error: "#D00",
                    inProgress: "#111111",
                    complete: "#111111",
                    sourceBg: "#F5F5F3"
                }
            }
        },

        (error, result) => {

            if (error) {
                console.error(error);
                return;
            }

            if (
                result &&
                result.event === "success"
            ) {

                const file = {
                    name: result.info.original_filename,
                    url: result.info.secure_url,
                    publicId: result.info.public_id,
                    type: result.info.resource_type
                };

                if (type === "reference") {

                    uploadedReferences.push(file);

                    displayUploadedFile(
                        "referenceFiles",
                        file
                    );

                } else {

                    uploadedFootage.push(file);

                    displayUploadedFile(
                        "footageFiles",
                        file
                    );
                }

            }
        }
    );
};


/* --------------------------------
   DISPLAY UPLOADED FILE
-------------------------------- */

function displayUploadedFile(containerId, file) {

    const container =
        document.getElementById(containerId);

    const element =
        document.createElement("div");

    element.className = "uploaded-file";

    element.innerHTML = `
        ✓ ${escapeHtml(file.name)}
    `;

    container.appendChild(element);
}


function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* --------------------------------
   UPLOAD BUTTONS
-------------------------------- */

document
    .getElementById("referenceUpload")
    .addEventListener("click", () => {

        cloudinaryWidget("reference").open();

    });


document
    .getElementById("footageUpload")
    .addEventListener("click", () => {

        cloudinaryWidget("footage").open();

    });


/* --------------------------------
   GET RADIO VALUE
-------------------------------- */

function getRadioValue(name) {

    const checked =
        document.querySelector(
            `input[name="${name}"]:checked`
        );

    return checked
        ? checked.value
        : "—";
}


/* --------------------------------
   SUMMARY
-------------------------------- */

function updateSummary() {

    document.getElementById("summaryProject")
        .textContent =
        document.querySelector(
            '[name="projectType"]'
        ).value || "—";


    document.getElementById("summaryStyle")
        .textContent =
        getRadioValue("editType");


    document.getElementById("summaryDuration")
        .textContent =
        getRadioValue("length");


    document.getElementById("summaryPlatform")
        .textContent =
        getRadioValue("platform");


    document.getElementById("summaryDeadline")
        .textContent =
        getRadioValue("deadline");


    document.getElementById("summaryFootage")
        .textContent =
        getRadioValue("footageStatus");
}


document
    .getElementById("orderForm")
    .addEventListener("change", updateSummary);


/* --------------------------------
   FORM SUBMISSION
-------------------------------- */

document
    .getElementById("orderForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        updateSummary();

        const button =
            document.getElementById("submitButton");

        const status =
            document.getElementById("formStatus");


        button.disabled = true;

        status.textContent =
            "Submitting your project...";


        const formData =
            new FormData(this);


        /* Add uploaded references */

        formData.append(
            "referenceFiles",
            uploadedReferences
                .map(file => `${file.name}: ${file.url}`)
                .join("\n")
        );


        /* Add uploaded footage */

        formData.append(
            "footageFiles",
            uploadedFootage
                .map(file => `${file.name}: ${file.url}`)
                .join("\n")
        );


        /* Summary */

        formData.append(
            "orderSummary",
            `
Project Type:
${getRadioValue("projectType")}

Edit Style:
${getRadioValue("editType")}

Duration:
${getRadioValue("length")}

Platform:
${getRadioValue("platform")}

Deadline:
${getRadioValue("deadline")}

Footage:
${getRadioValue("footageStatus")}
            `
        );


        try {

            const response =
                await fetch(
                    FORMSPREE_ENDPOINT,
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );


            if (response.ok) {

                status.textContent =
                    "Your project has been submitted. Thank you!";

                this.reset();

                uploadedReferences.length = 0;
                uploadedFootage.length = 0;

                document.getElementById(
                    "referenceFiles"
                ).innerHTML = "";

                document.getElementById(
                    "footageFiles"
                ).innerHTML = "";

                updateSummary();

            } else {

                throw new Error(
                    "Submission failed"
                );

            }

        } catch (error) {

            console.error(error);

            status.textContent =
                "Something went wrong. Please try again.";

        } finally {

            button.disabled = false;

        }

    });