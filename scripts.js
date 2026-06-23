const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav-bar");
const customCursor = document.querySelector(".custom-cursor");
const year = document.querySelector("[data-year]");
const certificateModal = document.querySelector("#certificate-modal");
const certificateModalImage = document.querySelector("#certificate-modal-image");
const certificateModalTitle = document.querySelector("#certificate-modal-title");
const certificateModalClose = document.querySelector(".certificate-modal-close");
const certificateTriggers = document.querySelectorAll(".certificate-trigger");
const hero = document.querySelector(".hero");
const heroNetwork = document.querySelector(".hero-network");

if (year) {
    year.textContent = String(new Date().getFullYear());
}

if (header) {
    const updateHeaderState = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
}

if (menuToggle && nav) {
    const setMenuState = (isOpen) => {
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        nav.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    });

    nav.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 860) {
            setMenuState(false);
        }
    });
}

if (
    certificateModal
    && certificateModalImage
    && certificateModalTitle
    && certificateModalClose
    && certificateTriggers.length
) {
    let previousFocus = null;

    const openCertificate = (trigger) => {
        const imageSource = trigger.dataset.certificateSrc;
        const certificateTitle = trigger.dataset.certificateTitle;

        if (!imageSource || !certificateTitle) {
            return;
        }

        previousFocus = document.activeElement;
        certificateModalImage.src = imageSource;
        certificateModalImage.alt = `${certificateTitle} certificate`;
        certificateModalTitle.textContent = `${certificateTitle} certificate preview`;
        certificateModal.hidden = false;
        document.body.classList.add("modal-open");
        certificateModalClose.focus();
    };

    const closeCertificate = () => {
        if (certificateModal.hidden) {
            return;
        }

        certificateModal.hidden = true;
        certificateModalImage.removeAttribute("src");
        certificateModalImage.alt = "";
        document.body.classList.remove("modal-open");

        if (previousFocus instanceof HTMLElement) {
            previousFocus.focus();
        }
    };

    certificateTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => openCertificate(trigger));
        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCertificate(trigger);
            }
        });
    });

    certificateModal.querySelectorAll("[data-certificate-close]").forEach((control) => {
        control.addEventListener("click", closeCertificate);
    });

    document.addEventListener("keydown", (event) => {
        if (certificateModal.hidden) {
            return;
        }

        if (event.key === "Escape") {
            closeCertificate();
        } else if (event.key === "Tab") {
            event.preventDefault();
            certificateModalClose.focus();
        }
    });
}

if (hero && heroNetwork) {
    const context = heroNetwork.getContext("2d");

    if (context) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const pointer = {
            x: 0,
            y: 0,
            active: false,
        };

        let width = 0;
        let height = 0;
        let animationFrame = null;
        let lastFrame = 0;
        let nodes = [];

        const getNodeCount = () => {
            const density = width < 560 ? 15000 : 11000;
            const minimum = width < 560 ? 26 : 38;
            return Math.round(Math.min(92, Math.max(minimum, (width * height) / density)));
        };

        const getLinkDistance = () => {
            if (width < 560) {
                return 92;
            }

            if (width < 900) {
                return 116;
            }

            return 146;
        };

        const createNode = () => {
            const speed = width < 560 ? 0.22 : 0.34;

            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                radius: 1.05 + Math.random() * 1.45,
                pulse: Math.random() * Math.PI * 2,
            };
        };

        const buildNodes = () => {
            nodes = Array.from({ length: getNodeCount() }, createNode);
        };

        const resizeCanvas = () => {
            const bounds = hero.getBoundingClientRect();
            const nextWidth = Math.max(1, bounds.width);
            const nextHeight = Math.max(1, bounds.height);
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const nextCanvasWidth = Math.round(nextWidth * pixelRatio);
            const nextCanvasHeight = Math.round(nextHeight * pixelRatio);
            const sizeChanged = nextCanvasWidth !== heroNetwork.width || nextCanvasHeight !== heroNetwork.height;

            width = nextWidth;
            height = nextHeight;
            heroNetwork.width = nextCanvasWidth;
            heroNetwork.height = nextCanvasHeight;
            heroNetwork.style.width = `${nextWidth}px`;
            heroNetwork.style.height = `${nextHeight}px`;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            const nextNodeCount = getNodeCount();
            if (!nodes.length || sizeChanged || Math.abs(nextNodeCount - nodes.length) > 4) {
                buildNodes();
            }
        };

        const drawLine = (startX, startY, endX, endY, opacity) => {
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.lineWidth = width < 560 ? 0.75 : 0.9;
            context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            context.stroke();
        };

        const updateNode = (node, delta) => {
            if (pointer.active) {
                const dx = pointer.x - node.x;
                const dy = pointer.y - node.y;
                const distance = Math.hypot(dx, dy);
                const influence = width < 560 ? 82 : 118;

                if (distance > 0 && distance < influence) {
                    const force = (1 - distance / influence) * 0.026 * delta;
                    node.vx -= (dx / distance) * force;
                    node.vy -= (dy / distance) * force;
                }
            }

            node.x += node.vx * delta;
            node.y += node.vy * delta;
            node.vx *= 0.996;
            node.vy *= 0.996;

            const speed = Math.hypot(node.vx, node.vy);
            const maxSpeed = width < 560 ? 0.42 : 0.62;

            if (speed > maxSpeed) {
                node.vx = (node.vx / speed) * maxSpeed;
                node.vy = (node.vy / speed) * maxSpeed;
            }

            if (node.x < -10) {
                node.x = width + 10;
            } else if (node.x > width + 10) {
                node.x = -10;
            }

            if (node.y < -10) {
                node.y = height + 10;
            } else if (node.y > height + 10) {
                node.y = -10;
            }
        };

        const drawNetwork = (timestamp = 0) => {
            const isReducedMotion = prefersReducedMotion.matches;
            const delta = isReducedMotion ? 0 : Math.min(32, timestamp - lastFrame || 16) / 16.67;
            const linkDistance = getLinkDistance();
            const pointerDistance = width < 560 ? 105 : 142;

            lastFrame = timestamp;
            context.clearRect(0, 0, width, height);
            context.lineWidth = width < 560 ? 0.75 : 0.9;
            context.lineCap = "round";

            nodes.forEach((node) => {
                if (!isReducedMotion) {
                    updateNode(node, delta);
                }
            });

            for (let i = 0; i < nodes.length; i += 1) {
                for (let j = i + 1; j < nodes.length; j += 1) {
                    const firstNode = nodes[i];
                    const secondNode = nodes[j];
                    const distance = Math.hypot(firstNode.x - secondNode.x, firstNode.y - secondNode.y);

                    if (distance < linkDistance) {
                        drawLine(
                            firstNode.x,
                            firstNode.y,
                            secondNode.x,
                            secondNode.y,
                            (1 - distance / linkDistance) * 0.72
                        );
                    }
                }
            }

            nodes.forEach((node) => {
                if (pointer.active) {
                    const pointerLinkDistance = Math.hypot(pointer.x - node.x, pointer.y - node.y);

                    if (pointerLinkDistance < pointerDistance) {
                        drawLine(
                            pointer.x,
                            pointer.y,
                            node.x,
                            node.y,
                            (1 - pointerLinkDistance / pointerDistance) * 0.82
                        );
                    }
                }

                const pulse = isReducedMotion ? 0.74 : 0.74 + Math.sin(timestamp / 850 + node.pulse) * 0.12;

                context.beginPath();
                context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                context.fillStyle = `rgba(255, 255, 255, ${pulse})`;
                context.fill();

                context.beginPath();
                context.arc(node.x, node.y, node.radius + 2.4, 0, Math.PI * 2);
                context.strokeStyle = "rgba(255, 255, 255, 0.22)";
                context.stroke();
            });

            if (!isReducedMotion && !document.hidden) {
                animationFrame = window.requestAnimationFrame(drawNetwork);
            }
        };

        const stopNetwork = () => {
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        };

        const startNetwork = () => {
            stopNetwork();
            lastFrame = performance.now();
            animationFrame = window.requestAnimationFrame(drawNetwork);
        };

        const renderNetwork = () => {
            resizeCanvas();

            if (prefersReducedMotion.matches) {
                stopNetwork();
                drawNetwork(0);
            } else if (!document.hidden) {
                startNetwork();
            }
        };

        const updatePointer = (event) => {
            const bounds = hero.getBoundingClientRect();
            pointer.x = event.clientX - bounds.left;
            pointer.y = event.clientY - bounds.top;
            pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
        };

        hero.addEventListener("pointermove", updatePointer, { passive: true });
        hero.addEventListener("pointerdown", updatePointer, { passive: true });
        hero.addEventListener("pointerleave", () => {
            pointer.active = false;
        });

        window.addEventListener("resize", renderNetwork, { passive: true });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden || prefersReducedMotion.matches) {
                stopNetwork();
                drawNetwork(0);
            } else {
                startNetwork();
            }
        });

        if (typeof ResizeObserver !== "undefined") {
            const heroResizeObserver = new ResizeObserver(renderNetwork);
            heroResizeObserver.observe(hero);
        }

        if (typeof prefersReducedMotion.addEventListener === "function") {
            prefersReducedMotion.addEventListener("change", renderNetwork);
        } else if (typeof prefersReducedMotion.addListener === "function") {
            prefersReducedMotion.addListener(renderNetwork);
        }

        renderNetwork();
    }
}

if (customCursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("mousemove", (event) => {
        customCursor.style.left = `${event.pageX}px`;
        customCursor.style.top = `${event.pageY}px`;
    });

    document.addEventListener("mouseover", (event) => {
        customCursor.classList.toggle("is-active", Boolean(event.target.closest("a, button, [role='button']")));
    });
}
