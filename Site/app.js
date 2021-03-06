let controller
let slideScene
let pageScene
let detailScene
let cntroller2

function animateSlides() {
    controller = new ScrollMagic.Controller()
    const sliders = document.querySelectorAll('.slide')
    const nav = document.querySelector('.nav-header')

    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img')
        const img = slide.querySelector('img')
        const revealText = slide.querySelector('.reveal-text')

        const slideTl = gsap.timeline({defaults: {duration: 1,ease: "power2.inOut"}})
        slideTl.fromTo(revealImg, { x: '0%'}, { x: '100%'})
        slideTl.fromTo(img, {scale: 2}, { scale: 1}, '-=1')
        slideTl.fromTo(revealText, { x: '0%'}, { x: '100%'}, '-=0.5')
      

        slideScene = new ScrollMagic.Scene({
                triggerElement: slide,
                triggerHook: 0.25,
                reverse: false
            })
            .setTween(slideTl)
            /*.addIndicators({
                colorStart: 'white',
                colorTrigger: 'white'
            })*/
            .addTo(controller)


        const pageTl = gsap.timeline()
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1]
        pageTl.fromTo(nextSlide, {
            y: '0%'
        }, {
            y: '50%'
        })
        pageTl.fromTo(slide, {
            opacity: 1,
            scale: 1
        }, {
            opacity: 0,
            scale: 0.5
        })
        pageTl.fromTo(nextSlide, {
            y: '50%'
        }, {
            y: '0%'
        }, '-=0.5')
        pageScene = new ScrollMagic.Scene({
                triggerElement: slide,
                duration: '100%',
                triggerHook: 0
            }).setPin(slide, {
                pushFollowers: false
            })
           /* .addIndicators({
                colorStart: 'white',
                colorTrigger: 'white',
                indent: 200,
                name: 'page'
            })*/
            .addTo(controller)
            .setTween(pageTl)
    })

}

let mouse = document.querySelector('.cursor')
let mouseTxt = document.querySelector('.cursor-text')
let burger = document.querySelector('.burger')
let srcIndex=document.querySelector('#logo')

function cursor(e) {
    mouse.style.top = e.pageY + "px"
    mouse.style.left = e.pageX + "px"
}

function activecursor(e) {
    const item = e.target;
    if (item.id === 'logo' || item.classList.contains('burger')) {
        mouse.classList.add('nav-active')
    } else {
        mouse.classList.remove('nav-active')
    }
    if (item.classList.contains('explore')) {
        mouse.classList.add('explore-active')
        gsap.to('.title-swipe', 1, {
            y: '0%'
        })
        mouseTxt.innerText = 'Tap'
    } else {
        mouse.classList.remove('explore-active')
        gsap.to('.title-swipe', 1, {
            y: '100%'
        })
        mouseTxt.innerText = ''
    }
}

function navOpen(e) {
    if (!e.target.classList.contains('active')) {
        e.target.classList.add('active')
        gsap.to('.line1', 0.5, {
            rotate: '45',
            y: 5,
            background: 'black'
        })
        gsap.to('.line2', 0.5, {
            rotate: '-45',
            y: -5,
            background: 'black'
        })
        gsap.to('#logo', 1, {
            color: 'black'
        })
        gsap.to('.nav-bar', 1, {
            clipPath: 'circle(2500px at 100% -10%)'
        })
        document.body.classList.add('hide')
    } else {
     navClose(e)
   
}
}

function navClose(e) {
    e.target.classList.remove('active')
    gsap.to('.line1', 0.5, {
        rotate: '0',
        y: 0,
        background: 'white'
    })
    gsap.to('.line2', 0.5, {
        rotate: '0',
        y: 0,
        background: 'white'
    })
    gsap.to('#logo', 1, {
        color: 'white'
    })
    gsap.to('.nav-bar', 1, {
        clipPath: 'circle(50px at 100% -10%)'
    })
    document.body.classList.remove('hide')

}


const logo = document.querySelector('#logo')
barba.init({
    views: [{
            namespace: 'home',
            beforeEnter() {
                animateSlides()
                logo.href = './index.html'
            },
            beforeLeave() {
                slideScene.destroy()
                pageScene.destroy()
                controller.destroy()
            }
           
        },
        {
            namespace: 'fashion',
            beforeEnter() {
                logo.href = '../index.html'
               
                 detailAnimation() 
                //gsap.fromTo('.nav-header', 1, { y: '100%'}, {y: '0%',    ease: 'power2.inOut'})
            }, 
            
            beforeLeave(){
            controller.destroy()
            detailScene.destroy()  
        },
        afterLeave(){
           setTimeout(location.reload(), 1000) 
        }
        }
        
    ],
    transitions: [{

        leave({
            current,
            next
        }) {
            let done = this.async()
            window.scrollTo(0, 0)
            const tl = gsap.timeline({
                defaults: {
                    ease: "power2.inOut"
                }
            })
            tl.fromTo(current.container, 1, {
                opacity: 1
            }, {
                opacity: 0,
                onComplete: done
            })
            tl.fromTo('.swipe', 1, {
                x: '-100%'
            }, {
                x: '0%',
                onComplete: done
            }, '-0.5')
        },
        enter({
            current,
            next
        }) {
            let done = this.async()
            window.scrollTo(0, 0)
            const tl = gsap.timeline({ defaults: {  ease: "power2.inOut" }})
            tl.fromTo(
            '.swipe', 
            1, 
            { x: '0%'}, 
            { x: '100%', stagger: 0.3, onComplete: done}, 
            '-0.5'
            )
            tl.fromTo(next.container, 1, {opacity: 0 }, { opacity: 1})
            tl.fromTo('.nav-header', 1, { y: '-100%'}, {y: '0%', ease:'power.inOut'}, '-=1.5')
        }
    }]
})


function detailAnimation() {
   
    controller = new ScrollMagic.Controller()

    const sliders = document.querySelectorAll(".detail-slide")
    sliders.forEach((slide, index, slides) => {

        const slideTl = gsap.timeline({
            defaults: {
                duration: 1
            }
        })
        let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1]
        const nextImg = nextSlide.querySelector('img')
        slideTl.fromTo(slide, {opacity: 1 }, { opacity: 0})
        slideTl.fromTo(nextSlide, {opacity:0}, {opacity:1}, "-=1.5")
        slideTl.fromTo(nextImg, {x:'40%'}, {x:'0%'})

        detailScene = new ScrollMagic.Scene({
                triggerElement: slide,
                duration: '100%',
                triggerHook: 0
            }).setPin(slide, {
                pushFollowers: false
            })
            .setTween(slideTl)
            .addTo(controller)
    })
}

burger.addEventListener('click', navOpen)
window.addEventListener('mousemove', cursor)
window.addEventListener('mouseover', activecursor)

