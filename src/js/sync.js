const $ = require('jquery');
const moment = require('moment');
const slick = require('slick-carousel');
const jQueryBridget = require('jquery-bridget');
const Masonry = require('masonry-layout');
// let firstSource = `https://launchlibrary.net/1.4/launch/next/30`;
jQueryBridget('masonry', Masonry, $);


const sourceObj = {
    start: 50,
    get source() {
        return `https://launchlibrary.net/1.4/launch/next/${this.start}`
    },
    next: function () {
        this.start += 70
    },
    initial: function () {
        this.start = 30
    }
}



async function getInfo(source) {
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
    if (result.length > 30) {
        result.splice(0, 30);
    }
    return result;
}


function createArticle(source, amount, grid, callback) {
    const loader = document.createElement('div');
    loader.setAttribute('id', 'loader');
    loader.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
    document.body.appendChild(loader);
    getInfo(source).then((results, mas = grid, a = callback) => {
        let i = 0;
        while ($('.gallery-item').length < amount) {
            if (results[i] !== undefined) {
                if (!results[i].img.includes('placeholder')) {
                    if (mas === false) {
                        console.log('undef')
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
                    } else if (mas === true) {
                        console.log('def')
                        sourceObj.fGrid.append(`
                <div id="${i}" class="gallery-item grid-item load">
                    <img class="rocket-img" src="${results[i].img}" alt="">
                   
                    <div class="timer ${i}">
                        <div class="info-container">
                        <span class="name">${results[i].name}</span>
                        <span class="countdown"></span>
                        <span class="mission">${results[i].mission}</span>
                        </div>
                    </div>                    
                </div>
                `).masonry('appended', $('.load')).masonry()
                    }

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

const grid = function () {
    const $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        // columnWidth: 300,
        fitWidth: true,
    });

    sourceObj.fGrid = $grid;
    $grid.on('click', '.grid-item', function () {
        $(this).toggleClass('grid-item--gigante');
        $grid.masonry();
        if ($(this).width() > 250 || $(this).height() > 250) {
            $('html, body').animate({
                scrollTop: $(this).offset().top
            }, 1000);
        }
    });

    const loader = document.getElementById('loader');
    document.body.removeChild(loader);
};




createArticle(sourceObj.source, 12, false, grid);




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




