
/* =========================================================
   PORTFOLIO WEBSITE
   Data source: database.json
========================================================= */

const DATA_FILE = "database.json";


/* =========================================================
   MAIN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadPortfolio();
});


/* =========================================================
   LOAD JSON
========================================================= */

async function loadPortfolio() {

    try {

        const response = await fetch(DATA_FILE);

        if (!response.ok) {
            throw new Error(
                `Could not load ${DATA_FILE}`
            );
        }

        const data = await response.json();

        renderPortfolio(data);

    } catch (error) {

        console.error("Portfolio loading error:", error);

        showError();

    }

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderPortfolio(data) {

    renderPersonal(data.personal);
    renderNavigation(data.navigation);
    renderSocials(data.socials);

    renderAbout(data.personal, data.interests);

    renderEducation(data.education);
    renderSkills(data.skills);
    renderProjects(data.projects);

    renderCertifications(data.certifications);
    renderAchievements(data.achievements);

    renderContact(data.contact, data.personal, data.socials);

    setupMobileMenu();

    setupActiveNavigation();

    document.title =
        `${data.personal.name} | Portfolio`;

}


/* =========================================================
   PERSONAL INFORMATION
========================================================= */

function renderPersonal(personal) {

    setText("logo", personal.shortName);
    setText("heroName", personal.name);
    setText("heroRole", personal.role);
    setText("heroTagline", personal.tagline);
    setText("heroAbout", personal.about);

    setText("aboutText", personal.about);
    setText("aboutLocation", personal.location);
    setText("aboutPhone", personal.phone);

    setText("footerName", personal.name);

    setLink(
        "aboutEmail",
        `mailto:${personal.email}`,
        personal.email
    );

    setText(
        "profileImage",
        personal.shortName
    );

    /*
       If you add an actual image URL/path
       to database.json, it will replace
       the initials.
    */

    if (personal.profileImage) {

        const profileImage =
            document.getElementById("profileImage");

        profileImage.innerHTML = "";

        const image =
            document.createElement("img");

        image.src = personal.profileImage;
        image.alt = `${personal.name} profile photo`;

        profileImage.appendChild(image);
    }

    /*
       Resume button can be added here later.

       Example database.json:

       "resume": "assets/resume.pdf"
    */
}


/* =========================================================
   NAVIGATION
========================================================= */

function renderNavigation(navigation) {

    const navMenu =
        document.getElementById("navMenu");

    navMenu.innerHTML = "";

    navigation.forEach(item => {

        const link =
            document.createElement("a");

        link.className = "nav-link";

        link.href = `#${item.target}`;

        link.textContent = item.label;

        navMenu.appendChild(link);

    });
}


/* =========================================================
   SOCIAL LINKS
========================================================= */

function renderSocials(socials) {

    const containers = [
        document.getElementById("socialLinks"),
        document.getElementById("contactSocials")
    ];

    containers.forEach(container => {

        if (!container) return;

        container.innerHTML = "";

        Object.entries(socials).forEach(
            ([platform, url]) => {

                if (!url || url === "#") {
                    return;
                }

                const link =
                    document.createElement("a");

                link.className = "social-link";

                link.href = url;

                link.target = "_blank";

                link.rel = "noopener noreferrer";

                link.textContent =
                    formatPlatformName(platform);

                container.appendChild(link);

            }
        );

    });
}


/* =========================================================
   ABOUT
========================================================= */

function renderAbout(personal, interests) {

    const list =
        document.getElementById("interestsList");

    list.innerHTML = "";

    interests.forEach(interest => {

        const tag =
            document.createElement("span");

        tag.className = "tag";

        tag.textContent = interest;

        list.appendChild(tag);

    });
}


/* =========================================================
   EDUCATION
========================================================= */

function renderEducation(education) {

    const container =
        document.getElementById("educationList");

    container.innerHTML = "";

    education.forEach(item => {

        const element =
            document.createElement("article");

        element.className = "timeline-item";

        element.innerHTML = `
            <span class="timeline-dot"></span>

            <h3>${escapeHTML(item.degree)}</h3>

            <div class="timeline-institution">
                ${escapeHTML(item.institution)}
            </div>

            <div class="timeline-meta">
                ${escapeHTML(item.startYear)}
                -
                ${escapeHTML(item.endYear)}
                ·
                ${escapeHTML(item.status)}
                ·
                ${escapeHTML(item.location)}
            </div>

            <p class="timeline-description">
                ${escapeHTML(item.description)}
            </p>
        `;

        container.appendChild(element);

    });
}


/* =========================================================
   SKILLS
========================================================= */

function renderSkills(skills) {

    const container =
        document.getElementById("skillsList");

    container.innerHTML = "";

    skills.forEach(skill => {

        const card =
            document.createElement("article");

        card.className = "skill-card";

        card.innerHTML = `
            <div class="skill-name">
                ${escapeHTML(skill.name)}
            </div>

            <div class="skill-category">
                ${escapeHTML(skill.category)}
            </div>

            <div class="skill-level">
                ${escapeHTML(skill.level)}
            </div>
        `;

        container.appendChild(card);

    });
}


/* =========================================================
   PROJECTS
========================================================= */

function renderProjects(projects) {

    const container =
        document.getElementById("projectsList");

    container.innerHTML = "";

    projects.forEach(project => {

        const card =
            document.createElement("article");

        card.className = "project-card";

        const techHTML =
            project.technologies
                .map(tech => `
                    <span class="tech-tag">
                        ${escapeHTML(tech)}
                    </span>
                `)
                .join("");

        const linkHTML =
            project.link &&
            project.link !== "#"

            ? `
                <a
                    href="${escapeAttribute(project.link)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >
                    View Project →
                </a>
              `

            : "";

        card.innerHTML = `
            <div class="project-category">
                ${escapeHTML(project.category)}
            </div>

            <h3>
                ${escapeHTML(project.title)}
            </h3>

            <p class="project-description">
                ${escapeHTML(project.description)}
            </p>

            <div class="project-tech">
                ${techHTML}
            </div>

            <div class="project-footer">

                <span class="project-date">
                    ${escapeHTML(project.date)}
                </span>

                ${linkHTML}

            </div>
        `;

        container.appendChild(card);

    });
}


/* =========================================================
   CERTIFICATIONS
========================================================= */

function renderCertifications(certifications) {

    const container =
        document.getElementById("certificationsList");

    container.innerHTML = "";

    certifications.forEach(cert => {

        const card =
            document.createElement("article");

        card.className =
            "certification-card";

        const linkHTML =
            cert.link &&
            cert.link !== "#"

            ? `
                <a
                    href="${escapeAttribute(cert.link)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="certification-link"
                >
                    View Certificate →
                </a>
              `

            : "";

        card.innerHTML = `
            <h3>
                ${escapeHTML(cert.name)}
            </h3>

            <div class="certification-issuer">
                ${escapeHTML(cert.issuer)}
            </div>

            <div class="certification-year">
                ${escapeHTML(cert.year)}
            </div>

            ${linkHTML}
        `;

        container.appendChild(card);

    });
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function renderAchievements(achievements) {

    const container =
        document.getElementById("achievementsList");

    container.innerHTML = "";

    achievements.forEach(achievement => {

        const card =
            document.createElement("article");

        card.className =
            "achievement-card";

        card.innerHTML = `
            <h3>
                ${escapeHTML(achievement.title)}
            </h3>

            <p>
                ${escapeHTML(achievement.description)}
            </p>

            <span class="achievement-year">
                ${escapeHTML(achievement.year)}
            </span>
        `;

        container.appendChild(card);

    });
}


/* =========================================================
   CONTACT
========================================================= */

function renderContact(
    contact,
    personal,
    socials
) {

    setText(
        "contactHeading",
        contact.heading
    );

    setText(
        "contactDescription",
        contact.description
    );

    setLink(
        "contactEmail",
        `mailto:${contact.email}`,
        "Send Me an Email"
    );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const toggle =
        document.getElementById("menuToggle");

    const menu =
        document.getElementById("navMenu");

    toggle.addEventListener(
        "click",
        () => {

            menu.classList.toggle("active");

        }
    );


    /*
       Close menu after clicking a link.
    */

    menu.addEventListener(
        "click",
        event => {

            if (
                event.target.classList
                    .contains("nav-link")
            ) {
                menu.classList.remove("active");
            }

        }
    );
}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function setupActiveNavigation() {

    const sections =
        document.querySelectorAll("main section");

    const links =
        document.querySelectorAll(".nav-link");

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    links.forEach(link => {

                        link.classList.remove(
                            "active"
                        );

                        if (
                            link.getAttribute("href")
                            === `#${entry.target.id}`
                        ) {

                            link.classList.add(
                                "active"
                            );

                        }

                    });

                });

            },
            {
                threshold: 0.25
            }
        );

    sections.forEach(section => {
        observer.observe(section);
    });
}


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value ?? "";
    }
}


function setLink(id, href, text) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.href = href;
    element.textContent = text;
}


/*
   Escape HTML to prevent accidental
   HTML injection when rendering JSON.
*/

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*
   Escape values used inside HTML attributes.
*/

function escapeAttribute(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


function formatPlatformName(platform) {

    const names = {
        linkedin: "LinkedIn",
        github: "GitHub",
        instagram: "Instagram",
        twitter: "X / Twitter"
    };

    return (
        names[platform] ||
        platform.charAt(0).toUpperCase()
        + platform.slice(1)
    );
}


/* =========================================================
   ERROR HANDLING
========================================================= */

function showError() {

    document.querySelector("main").innerHTML = `
        <section class="section">

            <div class="container">

                <div class="error-message">

                    <h2>
                        Unable to load portfolio
                    </h2>

                    <p>
                        Make sure that
                        <strong>database.json</strong>
                        is in the same folder as
                        index.html and that you are
                        running the website through
                        a local server.
                    </p>

                </div>

            </div>

        </section>
    `;

}


/* =========================================================
   FOOTER YEAR
========================================================= */

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

