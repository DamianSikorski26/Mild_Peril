// on capture les balises HTML-------------------

const heroName = document.getElementById("heroName");
const heroChoice = document.getElementById("heroChoice");
const submit = document.getElementById("submit");
const heroForm = document.querySelector(".createHeroForm");
const heroesContainer = document.querySelector(".heroesContainer");
const EnnemiesContainer =document.querySelector(".enemiesContainer");
const actionButtons = document.querySelector(".actionButtonContainer");
const message = document.querySelector(".message");
const partyNumber = document.querySelector(".party");

let heroImg = document.querySelector(".hero-img img");
let heroTxt = document.querySelector(".hero-txt h2");
let heroSpans = document.querySelectorAll(".hero-txt span");



let turn = true;
let action;
let attaquant = "";

// tableau qui contient les archétype de héro et d'ennemi
const infoHero = [
    {
        classe: "Paladin",
        attaque: 75,
        attaqueMagique: 40,
        mana: 50,
        vie: 100,
        agilite: 30,
        defense: 80,
        defenseMagique: 60,
        isGentil: true,
        img : "img/h-paladin.png"
    },
    {
        classe: "Mage",
        attaque: 20,
        attaqueMagique: 95,
        mana: 100,
        vie: 100,
        agilite: 40,
        defense: 25,
        defenseMagique: 50,
        isGentil: true,
        img : "img/h-mage2.png"
    },
    {
        classe: "Healer",
        attaque: 15,
        attaqueMagique: 80,
        mana: 90,
        vie: 100,
        agilite: 35,
        defense: 30,
        defenseMagique: 70,
        isGentil: true,
        img : "img/h-healer2.png"
    },
    {
        
        classe:"Rogue",
        attaque: 70,
        attaqueMagique: 20,
        mana: 30,
        vie: 100,
        agilite: 90,
        defense: 35,
        defenseMagique: 25,
        isGentil: true,
        img : "img/h-rogue1.png"
          
    }


]


const infoEnnemie =[
    {
        classe : "Zombie",
        attaque: 50,
        attaqueMagique: 0,
        mana: 0,
        vie: 100,
        agilite: 10,
        defense: 60,
        defenseMagique: 20,
        isGentil: false,
        img : "img/e-zombie2.png"
    },
    {   classe : "Werewolf",
        attaque: 70,
        attaqueMagique: 0,
        mana: 0,
        vie: 100,
        agilite: 85,
        defense: 30,
        defenseMagique: 10,
        isGentil: false,
        img : "img/e-werewolf1.png"
    },
    {
        classe : "Sorcerer",
        attaque: 10,
        attaqueMagique: 90,
        mana: 100,
        vie: 100,
        agilite: 30,
        defense: 20,
        defenseMagique: 60,
        isGentil: false,
        img : "img/e-sorcerer.png"
    },
    {
        classe : "Gobelin",
        attaque: 60,
        attaqueMagique: 10,
        mana: 10,
        vie: 100,
        agilite: 70,
        defense: 25,
        defenseMagique: 20,
        isGentil: false,
        img : "img/e-goblin1.png"
    },
    {
        classe : "Skeleton",
        attaque: 55,
        attaqueMagique: 0,
        mana: 0,
        vie: 100,
        agilite: 40,
        defense: 40,
        defenseMagique: 50,
        isGentil: false,
        img : "img/e-skeleton1.png"
    },
    {
        classe : "Ghost",
        attaque: 30,
        attaqueMagique: 70,
        mana: 80,
        vie: 100,
        agilite: 90,
        defense: 10,
        defenseMagique: 85,
        isGentil: false,
        img : "img/e-ghost5.png"
    }
]

// tableau qui contient les hero sous formes d'objet------------
const listHero = [];
 
//// tableau qui contient les ennemies sous formes d'objet------------

const listEnnemie = [];

// classe permettant de générer les heros et entité

class Entite{
    constructor(nom,classe,atq,magie,mana,vie,agilite,def,defMag,isGentil,img){
        this.nom=nom,
        this.classe=classe,
        this.atq=atq;
        this.magie=magie;
        this.mana=mana,
        this.vie=vie;
        this.agilite = agilite;
        this.def=def;
        this.defMag = defMag;
        this.isGentil = isGentil;
        this.image = img;
        
    }
    afficher(index){
        let Entity = document.createElement("div");
        Entity.classList.add("Entity");
        Entity.setAttribute("data-index",index);
        let div = document.createElement("div");
        div.classList.add("battle-message");
        Entity.append(div,getImg(this.image),getLifebar(this.vie),getManabar(this.mana),getEntityInfo(this));
        return Entity
        
    }

    attaque(cible){
        cible.takeDamage(this.atq,cible.def)
    }
    attaqueMagique(cible){
        if(this.mana == 0){
            message.innerHTML += "Pas assez de mana! <br>";
            return

        }
        message.innerHTML += `${this.nom} lance une boule de feu sur ${cible.nom} !<br>`;
        this.mana -= 10;
        cible.takeDamage(this.magie,cible.defMag);
    }

    takeDamage(baseDamage,baseDefense){
        if(this.esquive()){
            message.innerHTML += ` ${this.nom} a esquivé l'attaque !<br>`;
            return
        }

        let reduction = baseDefense * 0.8;
        let damage = baseDamage - reduction;
        if (damage < 0){
            return
            
        } 
        
        if(damage > this.vie){
            this.vie = 0;
        }
        else{
            this.vie -= damage;
        }
        if(this.isGentil){
            let index = listHero.indexOf(this);
            let div = heroesContainer.querySelector(`[data-index="${index}"] .imgContainer img`);
            
            div.classList.add("hit");
        }
        else{
            let index = listEnnemie.indexOf(this);
            let div = EnnemiesContainer.querySelector(`[data-index="${index}"]`);
            div.classList.add("hit");
            setTimeout(function(){
                div.classList.remove("hit");
            },500);
            
        }
    }
    esquive(){
        let chancedetoucher = Math.random() * 100;
        console.log("chance de toucher :" + chancedetoucher);
        if ((this.agilite/2)> chancedetoucher){
            return true
        }
        else{
            return false
        }
    }
    
    
    isDead(){
        if(this.life <= 0){
            return true
        }
        else{
            return false
        }
    }

    heal(cible){
        if(cible.vie + 30 > 100){
            cible.vie = 100;
        }
        else{
            cible.vie += 30;
        }
            
    }
    
}

// fonction qui créer des entité en focntion de la classe choisie et l'ajoute dans la liste correspondante

function createEntity(liste,classe,name,info){
    for(let element of info){
        if(element.classe == classe){
            liste.push(new Entite(name,element.classe,element.attaque,element.attaqueMagique,element.mana,element.vie,element.agilite,element.defense,element.defenseMagique,element.isGentil,element.img))
        }
    }
    
}

//fonction qui choisit quel méchant mettre dans la liste des méchant et renvoie une valuer qui sera utilisé par la fonction createEntity()

function randomEnnemyCreator(){
    let index = parseInt(Math.floor(Math.random()*(infoEnnemie.length - 1)));
    console.log(index);
    return infoEnnemie[index].classe;

}

// fonctions qui renvoient des element html quont va utiliser dans la méthode affichage() des entité 

function getImg(imageUrl){
    let img = document.createElement("img");
    let div = document.createElement("div");
    div.classList.add("imgContainer");
    img.setAttribute("src",imageUrl);
    div.append(img);
    return div;
}

function getLifebar(life){
    let lifeContainer = document.createElement("div");
    lifeContainer.classList.add("lifeContainer");
    let redLife = document.createElement("div");
    redLife.classList.add("redLife");
    redLife.style.width = `${life}%`;
    lifeContainer.append(redLife);
    return lifeContainer;
}

function getManabar(Mana){
    let ManaContainer = document.createElement("div");
    ManaContainer.classList.add("ManaContainer");
    let ManaPoints = document.createElement("div");
    ManaPoints.classList.add("Mana");
    ManaPoints.style.width = `${Mana}%`;
    ManaContainer.append(ManaPoints);
    return ManaContainer;
}

function getEntityInfo(object){
    // creation des conteneur des ligne de stats
    let name = document.createElement("h3");
    let atqContainer = document.createElement("div");
    let atqMagContainer = document.createElement("div");
    let defenseContainer = document.createElement("div");
    let defenseMagiqueContainer = document.createElement("div");
    let agilityContainer = document.createElement("div");
    let statContainer = document.createElement("div");

    //On ajoute la classe statContainer au conteneur
    name.classList.add("stat");
    atqContainer.classList.add("stat");
    atqMagContainer.classList.add("stat");
    defenseContainer.classList.add("stat");
    defenseMagiqueContainer.classList.add("stat");
    agilityContainer.classList.add("stat");
    statContainer.classList.add("statContainer");

    //on créer les images et on ajoute l'info à chaque ligne()

    name.innerText = `${object.nom}`;
    //
    let atq = document.createElement("span");
    atq.innerText = `${object.atq}`;
    atqContainer.append(getImg("img/icone/damage-physical.png"),atq);

    //
    let atqMag = document.createElement("span");
    atqMag.innerText = `${object.magie}`;
    atqMagContainer.append(getImg("img/icone/damage-magic.png"),atqMag);

    //
    let def = document.createElement("span");
    def.innerText = `${object.def}`;
    defenseContainer.append(getImg("img/icone/defense-physical.png"),def);

    //
    let defMag = document.createElement("span");
    defMag = `${object.defMag}`;
    defenseMagiqueContainer.append(getImg("img/icone/defense-magic.png"),defMag);

    //
    let agility = document.createElement("span");
    agility.innerText = `${(object.agilite)}`;
    agilityContainer.append(getImg("img/icone/agility.png"),agility);

    //On ajoute tout les element au stats container
    statContainer.append(name,atqContainer,atqMagContainer,defenseContainer,defenseMagiqueContainer,agilityContainer);
    
    return statContainer;
}

// function qui return true si les entité d'une liste sont mort

function checkLoss(list){
    let allDead = list.every( entity => entity.isDead())
    return allDead
}

function checkIfEnd(){
    
}


//-------------------------------------------
// boutons------------------------------------
// --------------------------------------------
submit.addEventListener("click",(e)=>{
    e.preventDefault();

    createEntity(listHero,heroChoice.value,heroName.value,infoHero);
    let mechant = randomEnnemyCreator();
    createEntity(listEnnemie,mechant,mechant,infoEnnemie);
    
    
    partyNumber.innerHTML = `Your party : ${listHero.length}/4`;


    if (listHero.length == 4){
        heroForm.classList.add("dnone");
        listHero.forEach((element,index) =>{
            heroesContainer.append(element.afficher(index));
        })
        listEnnemie.forEach((element,index) =>{
            EnnemiesContainer.append(element.afficher(index));
        })
        
        actionButtons.classList.remove("dnone");
        let heroInfo = document.querySelector(".hero-info");
        heroInfo.classList.add("dnone");
        document.querySelector(".choice").classList.add("dnone");
        message.classList.remove("dnone");
        message.innerHTML = "Lets start !<br>";
    }
})



EnnemiesContainer.addEventListener("click",(e)=>{
    e.preventDefault();
    
    const targetEntity = e.target.closest('.Entity');
    // const targetEntityImg = targetEntity.querySelector("")
    let indexAttaquant = listHero.indexOf(attaquant);
    let manaAttaquant = heroesContainer.querySelector(`[data-index="${indexAttaquant}"] .Mana`);
    

    if (targetEntity.classList.contains("Entity")){
        let index = targetEntity.dataset.index;
        let cible = listEnnemie[index];
        console.log("Cible: "+cible);
        const targetLifeBar = targetEntity.querySelector(".redLife");
        

        console.log(targetLifeBar);
        

        switch (action){
            case "attaque":
                attaquant.attaque(cible);
                console.log(cible.vie);
                
                targetLifeBar.style.width = `${cible.vie}%`;
                break;

            case "attaqueMagique":
                attaquant.attaqueMagique(cible);
                targetLifeBar.style.width = `${cible.vie}%`;
                manaAttaquant.style.width = `${attaquant.mana}%`;
                break;
                
        }
        if(cible.vie == 0){
            targetEntity.remove();
        }
        attaquant = "";
    
    }
    let buttons = actionButtons.querySelectorAll(".actionButton");
    buttons.forEach(button => button.classList.remove("selectedButton"));
    
    let heroes = heroesContainer.querySelectorAll(".Entity");
    heroes.forEach(hero => hero.classList.remove("active"));
    
    
})

actionButtons.addEventListener("click",(event)=>{
    event.preventDefault();

    if(event.target.classList.contains("actionButton")){
        let idAction = event.target.id;
        switch(idAction){
            case "attackButton":
                action = "attaque";
                break;
            case "MagickAttackButton":
                action = "attaqueMagique";
                break;
            case "HealButton":
                action = "Heal";
                break;
        }
        let buttons = actionButtons.querySelectorAll(".actionButton");
        buttons.forEach(button => button.classList.remove("selectedButton"));
        event.target.classList.add("selectedButton");
    }
    console.log(action);
    

})

heroesContainer.addEventListener("click",(e)=>{
    e.preventDefault();
    const targetEntity = e.target.closest(".Entity");
    targetEntity.classList.add("active");

    console.log(targetEntity.dataset.index);

    if(attaquant != ""){
        attaquant.heal(e.target.dataset.index);
    }
    
    
    
    if (targetEntity.classList.contains("Entity")){
        attaquant = listHero[targetEntity.dataset.index];
        console.log(attaquant);
    }
    

})

heroChoice.addEventListener("change",(event)=>{
    event.preventDefault();
    for(let element of infoHero){
        if(element.classe == heroChoice.value){
            heroImg.setAttribute("src",element.img);
            heroTxt.innerText = element.classe;
            heroSpans[0].innerHTML = element.attaque;
            heroSpans[1].innerHTML = element.attaqueMagique;
            heroSpans[2].innerHTML = element.agilite;
            heroSpans[3].innerHTML = element.defense;
            heroSpans[4].innerHTML = element.defenseMagique;

        }
    }

})














