const readlineSync = require("readline-sync");

const choices: string[] = ["가위", "바위", "보"]; // 이건 전역변수로 두는게 더 좋아보입니다.


 // 가위바위보를 수행하는 클래스입니다.

class Rps {
    player1: string;
    player2: string;
    winTable: number[] = [0, 0];

    // 이름을 하나만 넣고 생성자를 호출할 경우 나머지 한 쪽의 이름은 컴퓨터가 됩니다.
    constructor(name1: string, name2: string = "컴퓨터") { 
        this.player1 = name1;
        this.player2 = name2;
        this.winTable = [0, 0]
    }

    // 첫 번째 플레이어가 이길 경우 1, 두 번째 플레이어가 이길 경우 -1, 무승부는 0을 반환하며, 각 결과에 따라 winTable을 갱신합니다.
    match(p1_act: number, p2_act: number): number {

        if (p1_act == p2_act){
            return 0; 
        }
        else if (p1_act-p2_act === 1 || p1_act-p2_act === -2){
            this.winTable[0]++
            return 1;
        }
        else {
            this.winTable[1]++
            return -1;
        }
    }

    // 3판 2선승제 종료 여부를 체크하고 승패가 갈렸을 경우 콘솔에 출력까지 해줍니다.
    checkBo3(): boolean {
        if(this.winTable[0] == 2){
            console.log(`\n${this.player1}가 2승을 달성하여 승리했습니다.\n`)
        }
        else if(this.winTable[1] == 2){
            console.log(`\n${this.player2}가 2승을 달성하여 승리했습니다.\n`)
        }
        else {
            return false
        }

        return true
    }

    // 가위바위보 매치 결과를 반환합니다.
    result(): number[] {
        return this.winTable
    }

    // winTable을 리셋합니다. 아마 현 코드에서 쓸 일은 없을듯
    reset(): void{
        this.winTable = [0, 0]
    }
}

class Pattern {
    arr: number[] = [-1, -1, -1, -1, -1];
    nowPoint: number;

    constructor() { 
        this.arr = [-1, -1, -1, -1, -1];
        this.nowPoint = 0;
    }

    // 현재 낸 수를 배열에 기록합니다.
    recentInput(userChoices: number): void {
        this.arr[this.nowPoint] = userChoices;
        this.nowPoint = (this.nowPoint+1)%5;
    }

    checkPattern(){
        let patternCount: number[] =[0, 0, 0];
            for(let n of this.arr){
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
    }


}

class Ranking {
    map: Map<string, number[]> = new Map<string, number[]>()

    constructor() { 
        this.map = new Map<string, number[]>()
    }

    update(key: string, result: number[]): void {
        if (this.map.has(key) != true){
            this.map.set(key, [0, 0]);
        }

        let userRanking = this.map.get(key);
        if(userRanking){
            userRanking[0] += result[0];
            userRanking[1] += result[1];
        }

    }

    print(): void{
        console.log("\n[승률 랭킹]");
        let rate = new Map<string, number>()
        this.map.forEach((value, key) => {
            rate.set(key, value[0]/(value[0]+value[1])*100)
            
        });

        let sortRate:[string, number][] = [...rate.entries()].sort((a: [string, number], b: [string, number]) => b[1] - a[1])

        for (let i in sortRate){
            let idx:number = parseInt(i);
            let userRanking = this.map.get(sortRate[idx][0]);
            if(userRanking) {
    
                console.log(`${sortRate[idx][0]} - ${sortRate[idx][1].toFixed(2)}% (${userRanking[0]}승 ${userRanking[1]}패)`)
            }   
            else {
                console.log(`$${sortRate[idx][0]} - ${sortRate[idx][1].toFixed(2)}% (데이터 없음)`);
            }
        }
    }
}

let ranking: Ranking = new Ranking()
let pattern: Pattern = new Pattern()


function main():void{
    game() // 일단은 게임은 시작하는게 먼저더라구요
    while(true){
        let q: number = correctValue([1, 2, 9],"새로운 게임을 시작하려면 1, 기록을 보려면 2, 종료하려면 9을 입력하세요: ");

        if (q == 1){ // game 함수를 실행하여 게임을 시작합니다.
            game()
        }
        else if(q == 2){ // 랭킹을 출력합니다.
            ranking.print();
            
        }
        else if(q == 9){ // while을 break하여 게임을 종료합니다.
            console.log("게임을 종료합니다");
            break;
        }
    }
}

function game():void{

    console.log("가위바위보를 시작합니다.\n");
    let username: string = readlineSync.question("이름을 입력해주세요. ")
    console.log("\n 챔피언십 모드 시작! 3판 2선승제로 진행됩니다.\n")


    let rps: Rps = new Rps(username) // 가위바위보 게임 오브젝트 생성
    
    while(true){
        let userChoices: number = correctValue([1,2,3],"가위(1), 바위(2), 보(3) 중 하나를 선택하세요: ")-1 // 유저가 낸 수
        let rand: number = Math.floor(Math.random()*3); // 컴퓨터가 랜덤으로 낸 수
        console.log(`컴퓨터: ${choices[rand]} (${rand+1})`)

        pattern.recentInput(userChoices) // 현재 낸 수를 패턴에 기록합니다.            

        // 가위바위보 시행
        let j: number = rps.match(userChoices, rand)

        // 해당 가위바위보의 승패를 출력합니다.
        let result: string[] = ["패배", "무승부", "승리!"];
        console.log(`결과: ${result[j+1]} (${rps.result()[0]}:${rps.result()[1]})`)

        // 유저가 낸 수의 패턴을 출력합니다.
        pattern.checkPattern()

        // 3판 2선승 조건을 확인하고, 달성했다면 해당 경기를 종료합니다.
        if (rps.checkBo3()){
            ranking.update(username, rps.result()) // 승패 업데이트
            break;
        }
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