document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener("click", function(event){
        event.preventDefault();

        const targetId = this.getAttribute("href");

        const targetSelection = document.querySelector(targetId);

        if (targetSelection) {
            targetSelection.scrollIntoView({
                behavior:"smooth"
            });
        }
    });
});

const element = document.querySelectorAll(
    ".timeline-item, .legacy-card, .about-content p" 
);

const observer = new InteresectionObserver(
    function(entries){

        entries.forEach(function (entry) {
            
            if (entry.isIntersecting) {
                entry.target.classList.add("show");

                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

elements.forEach(function(element) {

    element.classList.add("hidden");
    observer.observe(element);
});
