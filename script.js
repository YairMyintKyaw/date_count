const mainContainer=(function(){

    // elements
    const specialDate=document.querySelector('.container>div:first-child>input[type="date"]')
    const specialTime=document.querySelector('.container>div:first-child>input[type="time"]')
    const startCountingBtn=document.querySelector('.startBtn');
    const invalidMsg=document.querySelector('.invalidMsg')

    const firstPage=document.querySelector('.firstPage');
    const secondPage=document.querySelector('.secondPage');
    const hourDisplay=document.querySelector('.timeCountDisplay>div:nth-child(1)');
    const minuteDisplay=document.querySelector('.timeCountDisplay>div:nth-child(2)');
    const secondDisplay=document.querySelector('.timeCountDisplay>div:nth-child(3)');
    const dayDisplay=document.querySelector('.dayCountDisplay')
    // bind Events
    startCountingBtn.addEventListener('click',()=>{
        // check validity
        if(specialDate.validity.valid && specialTime.validity.valid){
            let inputedDate=specialDate.valueAsDate;
            let time=specialTime.value.split(':');
    
            // get time from input and store in local storage
            const timeObjToBeStored=(function(year,month,date,hour,minute){
                    localStorage.setItem('specialDate',JSON.stringify({year,month,date,hour,minute}))
                })(inputedDate.getFullYear(),
                    inputedDate.getMonth(),
                    inputedDate.getDate(),
                    time[0],
                    time[1])
            
            firstPage.style.display='none';
            secondPage.style.display='flex';
            runningTime(JSON.parse(localStorage.getItem('specialDate')))
        }else{
            invalidMsg.textContent='Data is nedded to be filled'
        }
    })

    if(localStorage.getItem('specialDate')){
        firstPage.style.display='none';
        secondPage.style.display='flex'
        runningTime(JSON.parse(localStorage.getItem('specialDate')))
    }

    function runningTime(timeobj){
        let days, hours, minutes, seconds;
        let time=new Date(+timeobj.year,+timeobj.month,+timeobj.date,+timeobj.hour,+timeobj.minute);
        setInterval(()=>{
            let duration= (new Date().getTime() - time.getTime())/1000;
            days=Math.floor(duration/86400);
            hours=Math.floor((duration%86400)/3600);
            minutes=Math.floor(((duration%86400)%3600)/60);
            seconds=Math.floor(((duration%86400)%3600)%60);
            
            dayDisplay.textContent=days+` ${days>1?'days':'day'}`
            hourDisplay.textContent=`${hours} ${hours>1?'hours':'hour'} :`;
            minuteDisplay.textContent=` ${minutes} ${minutes>1?'minutes':'minute'} :`;
            secondDisplay.textContent=` ${seconds} ${seconds>1?'seconds':'second'}`
        },1000)
    }
})();