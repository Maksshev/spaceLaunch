let source = `https://launchlibrary.net/1.4/launch/next/5`;

// let promise = fetch(test).then(smth => smth.json()).then(result => console.log(result));



async function getInfo() {
    let l = await fetch(source);
    let json = await l.json();
    let nameValue = json.launches[0].name;
    let mission = json.launches[0].missions[0].description;
    let rocketID = json.launches[0].rocket.id;
    let rocketImgUrl = `https://launchlibrary.net/1.4/rocket/${rocketID}`;
    let imgRequest = await fetch(rocketImgUrl);
    let jsonImg = await imgRequest.json();
    console.log(jsonImg);
    let imgUrl = jsonImg.rockets[0].imageURL;

    return {
        name: nameValue,
        obj: json,
        mission: mission,
        rocketImg: rocketID,
        img: imgUrl
    }
}

function createArticle(infoArr) {

}

getInfo().then(results => {
    console.log([results.name, results.mission, results.img, results.obj])
    document.body.innerHTML += `<img src=${results.img}>`
});

// console.log(getInfo());


