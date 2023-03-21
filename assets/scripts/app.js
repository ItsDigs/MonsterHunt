const ATTACK_VALUE = 10
const MONSTER_ATTACK_VALUE = 14
const STRONG_ATTACK_VALUE = 17
const HEAL_VALUE = 20

const MODE_ATTACK = 'ATTACK'
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK'
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK'
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK'
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL'
const LOG_EVENT_GAME_OVER = 'GAME_OVER'


function getMaxLifeValues(){
    const enteredValue = parseInt(prompt('Maximum life for you and the monster.', '100'))
    const chosenMaxLife = enteredValue
    
    if(isNaN(chosenMaxLife) || chosenMaxLife <= 0){
        throw {message: 'Invalid user input, not a number'}
    }
    return chosenMaxLife
}

try{
    chosenMaxLife = getMaxLifeValues()
} catch (error) {
    console.log(error)
    chosenMaxLife = 100
    alert('You entered something wrong, default value of 100 was used.')
}

let currentMonsterHealth = chosenMaxLife
let currentPlayerHealth = chosenMaxLife
let hasBonusLife = true
let battleLog = [ ]

adjustHealthBars(chosenMaxLife)

function writeToLog(ev, val, monsterHealth, playerHealth){
    let logEntry ={
        event: ev,
        value: val, 
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    }
    switch (ev){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER'
            break;

        case LOG_EVENT_PLAYER_STRONG_ATTACK:
           logEntry = {
                event: ev,
                value: val, 
                target: 'MONSTER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            } 
            break;

        case LOG_EVENT_PLAYER_HEAL:
            logEntry ={
                event: ev,
                value: val, 
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            }
            break;
        
        case LOG_EVENT_GAME_OVER:
            logEntry ={
                event: ev,
                value: val, 
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
                }
            break;
    }
    battleLog.push(logEntry)
}

function reset(){
    currentMonsterHealth = chosenMaxLife
    currentPlayerHealth = chosenMaxLife
    resetGame(chosenMaxLife)
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth -= playerDamage

if (currentPlayerHealth<=0 && hasBonusLife){
    hasBonusLife = false
    removeBonusLife()
    currentPlayerHealth = initialPlayerHealth
    alert('The bonus life saved you!')
    setPlayerHealth(initialPlayerHealth)
}

    if(currentMonsterHealth <= 0 && currentPlayerHealth >0){
        alert('You won!')
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )
        reset()
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth >0){
        alert('You lost')
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )
        reset()
    } else if(currentMonsterHealth<=0 || currentPlayerHealth<=0){
        alert('You have a draw')
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        )
        reset()
    }
}

function attackMonster(mode){
    let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE
    //if mode is attack, set it to attack value else set it to strong
    // if (mode === MODE_ATTACK){
    //     maxDamage = ATTACK_VALUE
    // }else if (mode === MODE_STRONG_ATTACK){
    //     maxDamage = STRONG_ATTACK_VALUE
    // }
    const damage = dealMonsterDamage(maxDamage)
    currentMonsterHealth -= damage
    writeToLog(LOG_EVENT_PLAYER_ATTACK, damage, currentMonsterHealth, currentPlayerHealth)
    endRound()
}

function attackHandler(){
    attackMonster(MODE_ATTACK)
}

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK)
}

function healPlayerHandler(){
    let healValue
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert("You can't heal to more than your max initial health")
        healValue = chosenMaxLife - currentPlayerHealth
    } else {
        healValue = HEAL_VALUE
    }
    increasePlayerHealth(healValue)
    currentPlayerHealth += healValue
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    )
    endRound()
}

function printLogHandler(){
    // for (let i = 0; i < battleLog.length; i++){
    //     console.log(`#${i}`)
    //     for (const key in battleLog){
    //         console.log(`${key} => ${battleLog[key]}`)
    //     }
    // }

    for(const logEntry of battleLog){console.log(logEntry)}
    for (const logEntry in battleLog) delete battleLog[logEntry];
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)