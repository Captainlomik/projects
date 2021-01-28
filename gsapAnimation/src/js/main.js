gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll('.rg__column')

/*PORTFOLIO VARS*/
const links = gsap.utils.toArray('.portfolio__categories a')
const largeImage = document.querySelector('.portfolio__image--l')
const smallImage = document.querySelector('.portfolio__image--s')


function initNavigation() {
    console.log()
    const mainNavLinks = gsap.utils.toArray('.main-nav a')
    const mainNavLinksRev = gsap.utils.toArray('.main-nav a').reverse()

    mainNavLinks.forEach(link => {
        link.addEventListener('mouseleave', e => {
            link.classList.add('animate-out')
            setTimeout(() => {
                link.classList.remove('animate-out')
            }, 300)
        })
    })

    function navAnimation(direction) {
        console.log(direction)
        const scrollingdown = direction === 1
        const links = scrollingdown ? mainNavLinks : mainNavLinksRev
        return gsap.to(links, {
            duration: 1,
            autoAlpha: () => scrollingdown ? 0 : 1,
            y: () => scrollingdown ? 20 : 0,
            ease: "Power4.out"
        })
    }

    ScrollTrigger.create({
        start: 100,
        end: "bottom bottom-=200",
        toggleClass: {
            targets: 'body',
            className: 'has-scrolled'
        },
        onEnter: ({
            direction
        }) => navAnimation(direction),
        onLeaveBack: ({
            direction
        }) => navAnimation(direction)
    })

}

function initFirstScreen() {

    document.querySelector('header').addEventListener('mousemove', moveImages)

}

function moveImages(e) {
    const {
        offsetX,
        offsetY,
        target
    } = e
    const {
        clientWidth,
        clientHeight
    } = target

    const xPos = (offsetX / clientWidth) - 0.5
    const yPos = (offsetY / clientHeight) - 0.5
    //console.log(`x- ${offsetX}, width: ${clientWidth}, ${(offsetX/clientWidth) - 0.5}`)

    const leftImg = gsap.utils.toArray('.hg__left .hg__image')
    const rightImg = gsap.utils.toArray('.hg__right .hg__image')
    const circle = document.querySelector('.decor__circle')

    let modifier = (index) => index * 1.5 + 0.5

    leftImg.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: xPos * 30 * modifier(index),
            y: yPos * 20 * modifier(index),
            rotationY: xPos * 20,
            rotationX: yPos * 10,
            ease: "Power3.out"
        })
    })

    rightImg.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: -xPos * 30 * modifier(index),
            y: -yPos * 20 * modifier(index),
            rotationY: xPos * 20,
            rotationX: xPos * 10,
            ease: "Power3.out"
        })
    })

    gsap.to(circle, {
        duration: 1.7,
        x: xPos * 100,
        y: yPos * 120,
        ease: "Power4.out"

    })

}

function initHoverReveal() {

    sections.forEach(section => {

        section.imageBlock = section.querySelector('.rg__image')
        section.mask = section.querySelector('.rg__image--mask')
        section.image = section.querySelector('.rg__image img')
        section.text = section.querySelector('.rg__text')
        section.textCopy = section.querySelector('.rg__text--copy')
        section.textMask = section.querySelector('.rg__text--mask')
        section.textP = section.querySelector('.rg__text--copy p')

        gsap.set([section.imageBlock, section.textP], {
            yPercent: -100
        })
        gsap.set([section.mask, section.textMask], {
            yPercent: 100
        })
        gsap.set(section.image, {
            scale: 1.2
        })



        section.addEventListener('mouseenter', createHoverReveal)
        section.addEventListener('mouseleave', createHoverReveal)
    })
}

function getTextHeight(textCopy) {
    return textCopy.clientHeight
}

function createHoverReveal(e) {

    const {
        imageBlock,
        mask,
        text,
        textCopy,
        textMask,
        textP,
        image
    } = e.target

    let tl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'Power4.out'
        }
    })

    if (e.type === 'mouseenter') {

        tl
            .to([mask, imageBlock, textMask, textP], {
                yPercent: 0
            }, 0)
            .to(text, {
                y: () => -getTextHeight(textCopy) / 2
            }, 0)
            .to(image, {
                duration: 1.1,
                scale: 1
            }, 0)

    } else if (e.type === 'mouseleave') {
        tl
            .to([mask, textP], {
                yPercent: 100
            })
            .to([imageBlock, textMask], {
                yPercent: -100
            }, 0)
            .to(text, {
                y: 0
            }, 0)
            .to(image, {
                scale: 1.2
            }, 0)

    }

    return tl
}

function resetProps(elements) {

    gsap.killTweenOf("*")
    if (elements.length) {
        elements.forEach(el => {
            el && gsap.set(el, {
                clearProps: 'all'
            })
        })
    }
}


function initportfolioHover() {
    links.forEach(link => {
        link.addEventListener('mouseenter', createPortfolioHover)
        link.addEventListener('mouseleave', createPortfolioHover)
        link.addEventListener('mousemove', createPortfolioMove)
    })
}

function createPortfolioHover(e) {
    const pageBackground = document.querySelector('.fill-background')
    const sInside = document.querySelector('.portfolio__image--s .image_inside')
    const lInside = document.querySelector('.portfolio__image--l .image_inside')

    const tl = gsap.timeline()

    if (e.type === 'mouseenter') {
        const {color,imagelarge,imagesmall } = e.target.dataset
        const allSiblings = links.filter(item=>item != e.target)

        
        tl
        .set(lInside, {css:{backgroundImage: `url(${imagelarge})` }})
        .set(sInside, {css:{backgroundImage: `url(${imagesmall})` }})
        .to([largeImage, smallImage], { autoAlpha: 1})
        .to(allSiblings, {color:'fff', autoAlpha:0.2}, 0)
        .to(e.target, {color:'white', autoAlpha:1, ease: 'slow(0.7, 0.7, false)'}, 0)
        .to(pageBackground, { backgroundColor:color, ease:'none'}, 0)
    } else if (e.type === 'mouseleave') {
        tl
        .to([largeImage, smallImage], { autoAlpha: 0})
        .to(links, {color:'#000', autoAlpha:1}, 0)
        .to(pageBackground, { backgroundColor:'#ACB7AB', ease:'none'}, 0)
    }
}

function createPortfolioMove(e){

    const {clientY} = e

    gsap.to(largeImage, {
        duration:1.2, 
        y:getPortfolioOffset(clientY)/6,
        ease:'Power3.Out'
    })

    gsap.to(smallImage, {
        duration:1.5, 
        y:-getPortfolioOffset(clientY)/3,
        ease:'Power3.Out'
    })

}
function getPortfolioOffset(clientY){
    return -(document.querySelector('.portfolio__categories').clientHeight - clientY)

}


function init() {
    // start here
    initNavigation()
    initFirstScreen()
    //initHoverReveal()
    handleWidthChange(mq)
    initportfolioHover()
}

window.addEventListener('load', function () {
    init();
});

const mq = window.matchMedia("(min-width:768px)")

mq.addListener(handleWidthChange)


function handleWidthChange(mq) {
    if (mq.matches) {
        initHoverReveal()
    } else {
        sections.forEach(section => {
            section.removeEventListener('mouseleave', createHoverReveal)
            section.removeEventListener('mouseenter', createHoverReveal)

            const {
                imageBlock,
                mask,
                text,
                textCopy,
                textMask,
                textP,
                image
            } = section
            resetProps([imageBlock, mask, text, textCopy, textMask, textP, image])
        })
    }
}