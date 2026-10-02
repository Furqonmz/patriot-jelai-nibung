window.addEventListener("scroll",function(){
    const navbar=document.querySelector(".navbar-custom");
    navbar.classList.toggle("navbar-scroll",window.scrollY>50);
});

const counters=document.querySelectorAll(".counter");

counters.forEach(counter=>{
    const update=()=>{
        const target=+counter.getAttribute("data-target");
        const c=+counter.innerText;
        const increment=target/100;
        if(c<target){
            counter.innerText=Math.ceil(c+increment);
            setTimeout(update,20);
        } else {
            counter.innerText=target;
        }
    }
    update();
});