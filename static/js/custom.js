particlesJS('particles-js',

    {
        "particles": {
            "number": {
                "value": 100,
                "density": {
                    "enable": true,
                    "value_area": 900
                }
            },
            "color": {
                "value": "#000000"
            },
            "shape": {
                "type": ["polygon", "polygon", "polygon", "polygon", "polygon", "circle", "circle"],
                "stroke": {
                    "width": 0,
                    "color": "#1fbe8cff"
                },
                "polygon": [
                    {
                        "nb_sides": 5
                    },
                    {
                        "nb_sides": 6
                    },
                    {
                        "nb_sides": 8
                    },
                    {
                        "nb_sides": 4
                    },
                    {
                        "nb_sides": 7
                    }
                ],
                "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 3.85,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 5,
                    "opacity_min": 0.3,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 13,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 200,
                "color": "#000000",
                "opacity": 0.8,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 0.85,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": false,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 20,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    }

);

// ====================================
// Multi-color Line Animation
// ====================================
// Keep particle link color stable and dark (black)
var lineColors = ["#b91212ff"];
var currentColorIndex = 0;

function changeLineColors() {
    if (window.pJSDom && window.pJSDom[0]) {
        var particlesInstance = window.pJSDom[0].pJS;
        if (particlesInstance) {
            particlesInstance.particles.line_linked.color = lineColors[currentColorIndex];
            particlesInstance.particles.line_linked.opacity = 0.42;
            particlesInstance.particles.line_linked.width = 1;
        }
    }
}

// One-time apply on load to ensure consistent color
setTimeout(changeLineColors, 500);

// ====================================
// Publication Management Functions
// ====================================

$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

var allPublications = null;

function publicationBySelected() {
    console.log('✓ publicationBySelected() triggered');
    var button = $("#publication-by-selected");

    // Update button states (activate this, deactivate others)
    $("#publication-by-selected, #publication-by-date").removeClass("activated");
    button.addClass("activated");

    // Clear container
    var container = $("#main-pub-card-container");
    container.html("");

    // Filter and display selected publications
    var count = 0;
    for (var i = 0; i < allPublications.length; i++) {
        var pub = $(allPublications[i]);
        if (pub.data("selected") == true || pub.data("selected") === "true") {
            container.append(pub.clone());
            count++;
        }
    }
    console.log('✓ Selected publications displayed: ' + count);
    container.removeClass("hide");
}

function publicationByDate() {
    console.log('✓ publicationByDate() triggered');
    var button = $("#publication-by-date");

    // Update button states (activate this, deactivate others)
    $("#publication-by-selected, #publication-by-date").removeClass("activated");
    button.addClass("activated");

    // Clear container
    var container = $("#main-pub-card-container");
    container.html("");

    // Sort by year descending
    var sorted = allPublications.slice().sort(function (a, b) {
        var yearA = parseInt($(a).data("year")) || 0;
        var yearB = parseInt($(b).data("year")) || 0;
        return yearB - yearA;
    });

    // Group by year and display
    var lastYear = null;
    for (var i = 0; i < sorted.length; i++) {
        var pub = $(sorted[i]);
        var year = pub.data("year");

        // Add year header if new year
        if (year !== lastYear) {
            container.append($("<h5 style='margin-top:20px; color:#566c7f;'>" + year + "</h5>"));
            lastYear = year;
        }
        container.append(pub.clone());
    }
    console.log('✓ All publications sorted by date');
    container.removeClass("hide");
}

function initPublications() {
    console.log('=== Initializing Publications ===');

    // Get all pub-card elements from the DOM
    var pubCardElements = $("#main-pub-card-container .pub-card");
    console.log('Found ' + pubCardElements.length + ' publication cards');

    // Build allPublications array (store DOM elements)
    allPublications = [];
    pubCardElements.each(function (index) {
        allPublications.push(this);
        var year = $(this).data("year");
        var selected = $(this).data("selected");
        console.log('  [' + index + '] year=' + year + ', selected=' + selected);
    });

    console.log('Ready to filter/sort ' + allPublications.length + ' publications');

    // Bind click handlers to publication filter links
    $("#publication-by-selected").on('click', function (e) {
        e.preventDefault();
        publicationBySelected();
    });

    $("#publication-by-date").on('click', function (e) {
        e.preventDefault();
        publicationByDate();
    });

    // Initialize with selected publications view
    $("#main-pub-card-container").removeClass("hide");
    publicationBySelected();

    console.log('=== Publications Ready ===\n');
}

// Initialize on DOM ready
$(function () {
    initPublications();

    // Start news-scroll slightly scrolled on page load
    var ns = $('.news-scroll');
    if (ns.length) {
        setTimeout(function () { ns.animate({ scrollTop: 20 }, 300); }, 100);
    }
});