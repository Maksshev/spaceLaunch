const $ = require('jquery');
const slick = require('slick-carousel');
const jQueryBridget = require('jquery-bridget');
const Masonry = require('masonry-layout');
let source = `https://launchlibrary.net/1.4/launch/next/20`;
jQueryBridget( 'masonry', Masonry, $ );





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
            let imgRequest = await fetch(rocketImgUrl);
            let jsonImg = await imgRequest.json();
            console.log(jsonImg);
            let imgUrl = jsonImg.rockets[0].imageURL;
            let workingObj = {
                name: nameValue,
                obj: json,
                mission: mission,
                rocketImg: rocketID,
                img: imgUrl
            };
            result.push(workingObj);
        } catch (e) {
            continue;
        }
    }
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
                    
                    <p>${results[i].name}</p>
                </div>
                `);

                    $(`#${i}`)
                        .css({
                            backgroundImage: `url('${results[i].img}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',

                        });
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
        columnWidth: 60,
        fitWidth: true
    });

    $grid.on( 'click', '.grid-item', function() {
        // change size of item via class
        $( this ).toggleClass('grid-item--gigante');
        // trigger layout
        $grid.masonry();
    });
});

// createArticle(function () {$(document).ready(function(){
//     $('.gallery-container').slick({
//         slidesToShow: 1,
//         arrows: true,
//         prevArrow: `<div class="arrow-left"></div>`,
//         nextArrow: `<div class='arrow-right'></div>`
//     });
// })});






// function () {$(document).ready(function(){
//     $('.gallery-container').slick({
//         slidesToShow: 3,
//         dots:true,
//         centerMode: true,
//     });
// })}

