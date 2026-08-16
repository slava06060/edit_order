/* =========================================
   CONFIGURATION
========================================= */

const SUPABASE_URL = "https://shkeqdeengzgayrvcpme.supabase.co";

const SUPABASE_KEY = "sb_publishable_77x94aRUe9oNKNkai6tQEA_sqxhfiez";

const CLOUDINARY_CLOUD_NAME =
    "md1gg2w8";

const FOOTAGE_UPLOAD_PRESET =
    "edit_footage";

const REFERENCE_UPLOAD_PRESET =
    "edit_references";


/* =========================================
   SUPABASE
========================================= */

const {
    createClient
} = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================
   ORDER ID
========================================= */

function generateOrderNumber() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    const random =
        Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();

    return `EDIT-${year}${month}${day}-${random}`;
}


const orderNumber =
    generateOrderNumber();


/* =========================================
   UPLOADED FILES
========================================= */

const uploadedReferences = [];
const uploadedFootage = [];


/* =========================================
   DISPLAY FILE
========================================= */

function displayUploadedFile(
    containerId,
    file
) {

    const container =
        document.getElementById(containerId);

    const element =
        document.createElement("div");

    element.className =
        "uploaded-file";

    element.innerHTML = `
        <span>
            ✓ ${escapeHtml(file.name)}
        </span>

        <a
            href="${file.url}"
            target="_blank"
            rel="noopener noreferrer"
        >
            OPEN
        </a>
    `;

    container.appendChild(element);
}


function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* =========================================
   CLOUDINARY WIDGET
========================================= */

function createCloudinaryWidget(type) {

    const isFootage =
        type === "footage";


    const widget =
        cloudinary.createUploadWidget(

            {

                cloudName:
                    CLOUDINARY_CLOUD_NAME,

                uploadPreset:
                    isFootage
                        ? FOOTAGE_UPLOAD_PRESET
                        : REFERENCE_UPLOAD_PRESET,


                sources: [
                    "local",
                    "url",
                    "google_drive",
                    "dropbox"
                ],


                multiple: true,


                clientAllowedFormats:
                    isFootage
                        ? [
                            "mp4",
                            "mov",
                            "webm",
                            "m4v"
                        ]
                        : [
                            "jpg",
                            "jpeg",
                            "png",
                            "webp",
                            "gif"
                        ],


                maxFileSize:
                    isFootage
                        ? 1000000000
                        : 25000000,


                asset_folder:
                    `edit-orders/${orderNumber}`,


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
                        error: "#D00000",
                        inProgress: "#111111",
                        complete: "#111111",
                        sourceBg: "#F5F5F3"

                    }

                }

            },


            function(error, result) {

                if (error) {

                    console.error(
                        "Cloudinary error:",
                        error
                    );

                    return;
                }


                if (
                    result &&
                    result.event === "success"
                ) {

                    const info =
                        result.info;


                    const file = {

                        name:
                            info.original_filename ||
                            info.public_id,

                        url:
                            info.secure_url,

                        publicId:
                            info.public_id,

                        resourceType:
                            info.resource_type,

                        format:
                            info.format,

                        bytes:
                            info.bytes

                    };


                    if (isFootage) {

                        uploadedFootage.push(file);

                        displayUploadedFile(
                            "footageFiles",
                            file
                        );

                    } else {

                        uploadedReferences.push(file);

                        displayUploadedFile(
                            "referenceFiles",
                            file
                        );

                    }

                }

            }

        );


    return widget;
}


/* =========================================
   UPLOAD BUTTONS
========================================= */

const referenceWidget =
    createCloudinaryWidget(
        "reference"
    );


const footageWidget =
    createCloudinaryWidget(
        "footage"
    );


document
    .getElementById("referenceUpload")
    .addEventListener(
        "click",
        () => {

            referenceWidget.open();

        }
    );


document
    .getElementById("footageUpload")
    .addEventListener(
        "click",
        () => {

            footageWidget.open();

        }
    );


/* =========================================
   RADIO HELPER
========================================= */

function getRadioValue(name) {

    const element =
        document.querySelector(
            `input[name="${name}"]:checked`
        );

    return element
        ? element.value
        : "—";
}


/* =========================================
   SUMMARY
========================================= */

function updateSummary() {

    document.getElementById(
        "summaryProject"
    ).textContent =
        document.querySelector(
            '[name="projectType"]'
        ).value || "—";


    document.getElementById(
        "summaryStyle"
    ).textContent =
        getRadioValue("editType");


    document.getElementById(
        "summaryDuration"
    ).textContent =
        getRadioValue("editLength");


    document.getElementById(
        "summaryPlatform"
    ).textContent =
        getRadioValue("platform");


    document.getElementById(
        "summaryDeadline"
    ).textContent =
        getRadioValue("deadline");


    document.getElementById(
        "summaryFootage"
    ).textContent =
        getRadioValue("footageStatus");
}


document
    .getElementById("orderForm")
    .addEventListener(
        "change",
        updateSummary
    );


/* =========================================
   SUBMIT
========================================= */

document
    .getElementById("orderForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const form =
                this;

            const button =
                document.getElementById(
                    "submitButton"
                );

            const status =
                document.getElementById(
                    "formStatus"
                );


            button.disabled = true;

            status.textContent =
                "Submitting your project...";


            try {

                const formData =
                    new FormData(form);


                const order = {

                    order_number:
                        orderNumber,


                    client_name:
                        formData.get(
                            "clientName"
                        ),


                    client_email:
                        formData.get(
                            "clientEmail"
                        ),

                    contact:
                        formData.get(
                            "contact"
                        ),


                    edit_type:
                        formData.get(
                            "editType"
                        ),


                    edit_length:
                        formData.get(
                            "editLength"
                        ),


                    project_type:
                        formData.get(
                            "projectType"
                        ),


                    platform:
                        formData.get(
                            "platform"
                        ),


                    feeling:
                        formData.get(
                            "feeling"
                        ),


                    reference_links:
                        formData.get(
                            "referenceLinks"
                        ),


                    footage_status:
                        formData.get(
                            "footageStatus"
                        ),


                    audio_status:
                        formData.get(
                            "audioStatus"
                        ),


                    audio_link:
                        formData.get(
                            "audioLink"
                        ),


                    deadline:
                        formData.get(
                            "deadline"
                        ),


                    comment:
                        formData.get(
                            "comment"
                        ),


                    reference_files:
                        uploadedReferences,


                    footage_files:
                        uploadedFootage,


                    status:
                        "NEW"

                };


                const {
                    error
                } = await db
                    .from("orders")
                    .insert(order);


                if (error) {

                    console.error(error);

                    throw error;

                }


                status.textContent =
                    `Project submitted successfully — ${orderNumber}`;


                form.reset();


                document.getElementById(
                    "referenceFiles"
                ).innerHTML = "";


                document.getElementById(
                    "footageFiles"
                ).innerHTML = "";


                uploadedReferences.length = 0;

                uploadedFootage.length = 0;


                updateSummary();


                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });


            } catch (error) {

                console.error(
                    "Submission error:",
                    error
                );


                status.textContent =
                    "Something went wrong. Please try again.";


            } finally {

                button.disabled = false;

            }

        }
    );


/* =========================================
   INITIAL SUMMARY
========================================= */

updateSummary();