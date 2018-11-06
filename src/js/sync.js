const $ = require('jquery');
const moment = require('moment');
const slick = require('slick-carousel');
const jQueryBridget = require('jquery-bridget');
const Masonry = require('masonry-layout');
let source = `https://launchlibrary.net/1.4/launch/next/20`;
jQueryBridget('masonry', Masonry, $);


async function getInfo() {
    let result = [];
    let l = await fetch(source);
    let json = await l.json();
    for (let i = 0, n = json.launches.length; i < n; i++) {
        try {
            let nameValue = json.launches[i].name;
            let mission = json.launches[i].missions[0].description;
            let rocketID = json.launches[i].rocket.id;
            let rocketImgUrl = `https://launchlibrary.net/1.4/rocket/${rocketID}`;
            let start = moment(json.launches[i].isostart).valueOf();
            let imgRequest = await fetch(rocketImgUrl);
            let jsonImg = await imgRequest.json();
            console.log(jsonImg);
            let imgUrl = jsonImg.rockets[0].imageURL;
            let workingObj = {
                name: nameValue,
                obj: json,
                mission: mission,
                rocketImg: rocketID,
                img: imgUrl,
                start: start
            };
            result.push(workingObj);
        } catch (e) {
            continue;
        }
    }
    console.log(result);
    return result;
}


function createArticle(callback) {
    getInfo().then((results, a = callback) => {
        let i = 0;
        while ($('.gallery-item').length < 10) {
            if (results[i] !== undefined) {
                if (!results[i].img.includes('placeholder')) {
                    $('.gallery-container').append(`
                <div id="${i}" class="gallery-item grid-item">
                    <img class="rocket-img" src="${results[i].img}" alt="">
                   
                    <div class="timer ${i}">
                        <div class="info-container">
                        <span class="name">${results[i].name}</span>
                        <span class="countdown"></span>
                        <span class="mission">${results[i].mission}</span>
                        </div>
                    </div>                    
                </div>
                `);

                    $(`#${i}`)
                        .css({
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',

                        });
                    createTimer(results[i].start, i);
                }
            } else {
                console.log('done');
                break;
            }
            i++;
        }
        a();
    });
}

createArticle(function () {
    const $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        // columnWidth: 300,
        fitWidth: true,
    });

    $grid.on('click', '.grid-item', function () {
        $(this).toggleClass('grid-item--gigante');
        $grid.masonry();
        if ($(this).width() > 250 || $(this).height() > 250) {
            $('html, body').animate({
                scrollTop: $(this).offset().top
            }, 1000);
        }
    });
});


function createTimer(startDate, i) {
    let interval = setInterval(function () {
        const now = new Date().getTime();
        if (now <= 0) {
            clearInterval(interval);
        }
        const distance = startDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        $(`.${i} .countdown`).animate({opacity: '0.3'}, 250, function () {
            $(this).text(`${days}d ${hours}h ${minutes}m ${seconds}s`).animate({opacity: '1'}, 250)
        })
    }, 1000);
}

