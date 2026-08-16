/* =========================================
   CONFIGURATION
========================================= */

const SUPABASE_URL = "https://shkeqdeengzgayrvcpme.supabase.co";

const SUPABASE_KEY = "sb_publishable_77x94aRUe9oNKNkai6tQEA_sqxhfiez";


/* =========================================
   SUPABASE
========================================= */

const {
    createClient
} = supabase;

const db =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================
   ELEMENTS
========================================= */

const loginScreen =
    document.getElementById(
        "loginScreen"
    );

const dashboard =
    document.getElementById(
        "dashboard"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const loginStatus =
    document.getElementById(
        "loginStatus"
    );

const ordersList =
    document.getElementById(
        "ordersList"
    );

const orderCount =
    document.getElementById(
        "orderCount"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const orderModal =
    document.getElementById(
        "orderModal"
    );

const modalBody =
    document.getElementById(
        "modalBody"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );


let allOrders = [];
let currentOrder = null;


/* =========================================
   CHECK SESSION
========================================= */

async function checkSession() {

    const {
        data
    } =
        await db.auth.getSession();


    if (
        data.session
    ) {

        showDashboard();

    } else {

        showLogin();

    }
}


function showDashboard() {

    loginScreen.classList.add(
        "hidden"
    );

    dashboard.classList.remove(
        "hidden"
    );

    loadOrders();
}


function showLogin() {

    loginScreen.classList.remove(
        "hidden"
    );

    dashboard.classList.add(
        "hidden"
    );
}


/* =========================================
   LOGIN
========================================= */

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        loginStatus.textContent =
            "Signing in...";


        const email =
            document.getElementById(
                "loginEmail"
            ).value;


        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        const {
            error
        } =
            await db.auth.signInWithPassword({

                email,
                password

            });


        if (error) {

            console.error(error);

            loginStatus.textContent =
                "Invalid email or password.";

            return;

        }


        loginStatus.textContent = "";

        showDashboard();

    }
);


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener(
    "click",
    async () => {

        await db.auth.signOut();

        showLogin();

    }
);


/* =========================================
   LOAD ORDERS
========================================= */

async function loadOrders() {

    ordersList.innerHTML =
        "<p>Loading orders...</p>";


    const {
        data,
        error
    } =
        await db
            .from("orders")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        ordersList.innerHTML =
            "<p>Could not load orders.</p>";

        return;

    }


    allOrders =
        data || [];


    renderOrders();
}


/* =========================================
   FILTER
========================================= */

statusFilter.addEventListener(
    "change",
    renderOrders
);


function renderOrders() {

    const filter =
        statusFilter.value;


    const filtered =
        filter === "ALL"
            ? allOrders
            : allOrders.filter(
                order =>
                    order.status === filter
            );


    orderCount.textContent =
        `${filtered.length} ${
            filtered.length === 1
                ? "order"
                : "orders"
        }`;


    if (!filtered.length) {

        ordersList.innerHTML = `
            <div class="empty">
                No orders found.
            </div>
        `;

        return;

    }


    ordersList.innerHTML =
        filtered
            .map(
                order =>
                    createOrderCard(order)
            )
            .join("");


    document
        .querySelectorAll(".order-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            card.dataset.id
                        );

                    const order =
                        allOrders.find(
                            item =>
                                item.id === id
                        );

                    openOrder(order);

                }
            );

        });
}


/* =========================================
   ORDER CARD
========================================= */

function createOrderCard(order) {

    const date =
        new Date(
            order.created_at
        ).toLocaleString();


    return `

        <article
            class="order-card"
            data-id="${order.id}"
        >

            <div>

                <div class="order-number">
                    ${escapeHtml(
                        order.order_number
                    )}
                </div>

                <div class="order-client">
                    ${escapeHtml(
                        order.client_name
                    )}
                </div>

                <div class="order-meta">

                    <span class="meta-pill">
                        ${escapeHtml(
                            order.edit_type
                        )}
                    </span>

                    <span class="meta-pill">
                        ${escapeHtml(
                            order.edit_length
                        )}
                    </span>

                    <span class="meta-pill">
                        ${escapeHtml(
                            order.project_type
                        )}
                    </span>

                </div>

            </div>


            <div class="order-right">

                <span class="status-badge">
                    ${escapeHtml(
                        order.status
                    )}
                </span>

                <div class="order-date">
                    ${date}
                </div>

            </div>

        </article>

    `;
}


/* =========================================
   OPEN ORDER
========================================= */

function openOrder(order) {

    currentOrder =
        order;


    const references =
        Array.isArray(
            order.reference_files
        )
            ? order.reference_files
            : [];


    const footage =
        Array.isArray(
            order.footage_files
        )
            ? order.footage_files
            : [];


    modalBody.innerHTML = `

        <div class="modal-header">

            <p class="eyebrow">
                ${escapeHtml(
                    order.order_number
                )}
            </p>

            <h2>
                ${escapeHtml(
                    order.client_name
                )}
            </h2>

        </div>


        ${detail(
            "Email",
            order.client_email
        )}


        ${detail(
            "Discord / Instagram",
            order.contact || "—"
        )}


        ${detail(
            "Project Type",
            order.project_type
        )}


        ${detail(
            "Edit Style",
            order.edit_type
        )}


        ${detail(
            "Duration",
            order.edit_length
        )}


        ${detail(
            "Platform",
            order.platform
        )}


        ${detail(
            "Deadline",
            order.deadline
        )}


        ${detail(
            "Footage Status",
            order.footage_status
        )}


        ${detail(
            "What should it feel like?",
            order.feeling
        )}


        ${detail(
            "Reference Edits",
            order.reference_links || "—"
        )}


        ${detail(
            "Audio",
            `${order.audio_status || "—"}\n${
                order.audio_link || ""
            }`
        )}


        ${detail(
            "Comment",
            order.comment || "—"
        )}


        <div class="detail">

            <span class="detail-label">
                Visual References
            </span>

            <div class="file-list">

                ${
                    references.length
                        ? references
                            .map(file =>
                                fileItem(file)
                            )
                            .join("")
                        : "<span>No files</span>"
                }

            </div>

        </div>


        <div class="detail">

            <span class="detail-label">
                Footage
            </span>

            <div class="file-list">

                ${
                    footage.length
                        ? footage
                            .map(file =>
                                fileItem(file)
                            )
                            .join("")
                        : "<span>No files</span>"
                }

            </div>

        </div>


        <div class="status-editor">

            <span class="detail-label">
                ORDER STATUS
            </span>

            <select id="orderStatus">

                ${statusOptions(
                    order.status
                )}

            </select>


            <button
                class="save-button"
                id="saveStatus"
            >
                SAVE STATUS
            </button>


            <p
                class="save-status"
                id="saveStatusMessage"
            ></p>

        </div>

    `;


    document
        .getElementById("saveStatus")
        .addEventListener(
            "click",
            saveOrderStatus
        );


    orderModal.classList.remove(
        "hidden"
    );
}


/* =========================================
   DETAIL
========================================= */

function detail(
    label,
    value
) {

    return `

        <div class="detail">

            <span class="detail-label">
                ${escapeHtml(label)}
            </span>

            <div class="detail-value">
                ${escapeHtml(
                    value ?? "—"
                )}
            </div>

        </div>

    `;
}


/* =========================================
   FILE
========================================= */

function fileItem(file) {

    return `

        <div class="file-item">

            <span>
                ${escapeHtml(
                    file.name ||
                    "File"
                )}
            </span>

            <a
                href="${file.url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                OPEN →
            </a>

        </div>

    `;
}


/* =========================================
   STATUS OPTIONS
========================================= */

function statusOptions(current) {

    const statuses = [

        "NEW",
        "REVIEWING",
        "ACCEPTED",
        "IN PROGRESS",
        "WAITING FOR CLIENT",
        "REVISION",
        "COMPLETED",
        "CANCELLED"

    ];


    return statuses
        .map(status => `

            <option
                value="${status}"
                ${
                    status === current
                        ? "selected"
                        : ""
                }
            >
                ${status}
            </option>

        `)
        .join("");
}


/* =========================================
   SAVE STATUS
========================================= */

async function saveOrderStatus() {

    const newStatus =
        document.getElementById(
            "orderStatus"
        ).value;


    const message =
        document.getElementById(
            "saveStatusMessage"
        );


    const {
        error
    } =
        await db
            .from("orders")
            .update({

                status:
                    newStatus,

                updated_at:
                    new Date().toISOString()

            })
            .eq(
                "id",
                currentOrder.id
            );


    if (error) {

        console.error(error);

        message.textContent =
            "Could not save.";

        return;

    }


    currentOrder.status =
        newStatus;


    const index =
        allOrders.findIndex(
            order =>
                order.id === currentOrder.id
        );


    if (index !== -1) {

        allOrders[index] =
            currentOrder;

    }


    message.textContent =
        "Saved.";


    renderOrders();
}


/* =========================================
   MODAL CLOSE
========================================= */

closeModal.addEventListener(
    "click",
    () => {

        orderModal.classList.add(
            "hidden"
        );

    }
);


document
    .querySelector(".modal-overlay")
    .addEventListener(
        "click",
        () => {

            orderModal.classList.add(
                "hidden"
            );

        }
    );


/* =========================================
   ESCAPE
========================================= */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================================
   START
========================================= */

checkSession();