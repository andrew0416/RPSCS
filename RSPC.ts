const readlineSync = require("readline-sync");

function main():void{

    console.log("가위바위보를 시작합니다.\n");

    const choices: string[] = ["가위", "바위", "보"];
    
    let quit: boolean = false
    let pattern: number[] = [-1, -1, -1, -1, -1];
    let nowPoint: number = 0;

    let ranking = new Map<string, number[]>()

    
    while(!quit){
        
        let username: string = readlineSync.question("이름을 입력해주세요. ")
        if (ranking.has(username) != true){
            ranking.set(username, [0, 0]);
        }
        
        console.log("\n 챔피언십 모드 시작! 3판 2선승제로 진행됩니다.\n")

        let winCount: number = 0;
        let loseCount: number = 0;

        while(true){
            let userChoices: number = correctValue([1,2,3],"가위(1), 바위(2), 보(3) 중 하나를 선택하세요: ")-1
            pattern[nowPoint] = userChoices;
            nowPoint = (nowPoint+1)%5;

            let rand: number = Math.floor(Math.random()*3);
            
            console.log(`컴퓨터: ${choices[rand]} (${rand+1})`)
            let j: number = judge(userChoices, rand);
            if (j == 0){
                console.log(`결과: 무승부 (${winCount}:${loseCount})`)
            }
            else if (j == 1){
                winCount++
                console.log(`결과: 승리! (${winCount}:${loseCount})`)
            }
            else {
                loseCount++
                console.log(`결과: 패배 (${winCount}:${loseCount})`)
            }
            let patternCount: number[] =[0, 0, 0];
            for(let n of pattern){
                if(n != -1){
                    patternCount[n]++;
                }
            }
            for(let i in patternCount){
                let idx: number = parseInt(i);
                if(patternCount[idx] >= 3){
                    console.log(`\nAI가 패턴을 감지했습니다: 당신은 '${choices[idx]}(${idx+1})'를 자주 선택합니다.\n`)
                }
            }
            if (winCount == 2){
                console.log(`\n${username}이/가 2승을 달성하여 승리했습니다.\n`)
                break;
            }
            else if (loseCount == 2){
                console.log(`\n컴퓨터가 2승을 달성하여 승리했습니다.\n`)
                break;
            }
        }
      
        let userRanking = ranking.get(username);
        if(userRanking){
            userRanking[0] += winCount;
            userRanking[1] += loseCount;
        }
        
        while(true){
            let q: number = correctValue([1, 2, 9],"새로운 게임을 시작하려면 1, 기록을 보려면 2, 종료하려면 9을 입력하세요: ");

            if (q == 1){
                break;
            }
            else if(q == 2){
                console.log("\n[승률 랭킹]");
                printRanking(ranking)
                
            }
            else if(q == 9){
                console.log("게임을 종료합니다");
                quit = true;
                break;
            }
        }
        
        
    }

}

function printRanking(ranking: Map<string, number[]>):void {
    let rate = new Map<string, number>()
    ranking.forEach((value, key) => {
        rate.set(key, value[0]/(value[0]+value[1])*100)
        
    });

    let sortRate:[string, number][] = [...rate.entries()].sort((a: [string, number], b: [string, number]) => b[1] - a[1])

    for (let i in sortRate){
        let idx:number = parseInt(i);
        let userRanking = ranking.get(sortRate[idx][0]);
        if(userRanking) {
 
            console.log(`${sortRate[idx][0]} - ${sortRate[idx][1].toFixed(2)}% (${userRanking[0]}승 ${userRanking[1]}패)`)
        }   
        else {
            console.log(`$${sortRate[idx][0]} - ${sortRate[idx][1].toFixed(2)}% (데이터 없음)`);
        }
    }
}

function judge(user:number, computer:number) : number{
    if (user == computer){
        return 0; 
    }
    else if (user-computer === 1 || user-computer === -2){
        return 1;
    }
    else {
        return -1;
    }

}
function correctValue(arr:number[], message:string): number{
    let question: number = Number(readlineSync.question(message));
    let loop: boolean = true
    while(loop){
        for(let n of arr){
            if(question === n){
                console.log(n)
                loop = false;
                break;
            }
        }
        if (loop == true){
            question = Number(readlineSync.question("정확한 값을 입력해주세요: "));
        }
    }
    return question;
}


main();