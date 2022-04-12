const mainContainer=(function(){

    // elements
    const specialDate=document.querySelector('.container>div:first-child>input[type="date"]')
    const specialTime=document.querySelector('.container>div:first-child>input[type="time"]')
    const startCountingBtn=document.querySelector('.startBtn');
    const invalidMsg=document.querySelector('.invalidMsg')
    const firstPage=document.querySelector('.firstPage');

    // second page
    const secondPage=document.querySelector('.secondPage');
    const hourDisplay=document.querySelector('.timeCountDisplay>div:nth-child(1)');
    const minuteDisplay=document.querySelector('.timeCountDisplay>div:nth-child(2)');
    const secondDisplay=document.querySelector('.timeCountDisplay>div:nth-child(3)');
    const dayDisplay=document.querySelector('.dayCountDisplay')
    const imgInput=document.querySelectorAll('.image>div>div:first-child>input');
    const nameInput=document.querySelectorAll('.image>div>div>input[type="text"]');
    const names=document.querySelectorAll('.image>div>div>div:last-child');
    const iconBetweenPhoto=document.querySelector('.iconBetweenPhoto');
    // element to choose time again
    const endBtn=document.querySelector('.secondPage>div:first-child');
    const confirmDiv=document.querySelector('.popUp');
    const confirmBtn=document.querySelector('.popUp button:first-child');
    const cancelBtn=document.querySelector('.popUp button:last-child');
    const heartIcon=document.querySelector('.fa-heart-broken')
    
    const defaultPhoto=['male.jpg','female.jpg'];
    const iconList=['bi:heart-pulse-fill','bi:arrow-through-heart','bi:balloon-heart','el:heart-alt','twemoji:heart-on-fire']
    
    let timeCount; //for setIntervel
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
        timeCount=setInterval(()=>{
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

    // Background image
    for(let i=0;i<imgInput.length;i++){
        if(localStorage.getItem('person'+ (i+1))){
            imgInput[i].parentElement.style.backgroundImage=`url(${localStorage.getItem('person'+ (i+1))})`
        }
        else{
            imgInput[i].parentElement.style.backgroundImage=`url(${defaultPhoto[i]})`;
        }
    }
    
    // input to change image
    for(let i=0;i<imgInput.length;i++){
        imgInput[i].parentElement.style.height=imgInput[i].parentElement.offsetWidth + 'px'
        imgInput[i].addEventListener('change',(event)=>{
            let file=event.target.files[0];
            const reader = new FileReader();
    
            reader.addEventListener("load", function () {
                // convert image file to base64 string and save to localStorage
                localStorage.setItem("person"+ (i+1), reader.result);
            }, false);
    
            if(file){
                reader.readAsDataURL(file);
            }
            
            imgInput[i].parentNode.style.backgroundImage=`url(${URL.createObjectURL(file)})`;
        })
    }

    // random icons to be shown
    iconBetweenPhoto.setAttribute('data-icon',iconList[Math.floor(Math.random()*iconList.length)]);
    // name input
    for(let i=0;i<nameInput.length;i++){
        if(localStorage.getItem('name'+i)){
            names[i].style.display='inline-block';
            names[i].textContent=localStorage.getItem(`name`+i)
            nameInput[i].style.display='none'
        }else{
            names[i].style.display='none';
        }

        // bind event
        nameInput[i].addEventListener('input',(e)=>{
            names[i].textContent=e.target.value;
            localStorage.setItem('name'+i,e.target.value)
        })
        nameInput[i].addEventListener('change',()=>{
            nameInput[i].style.display='none';
            names[i].style.display='inline-block';
        })
        names[i].addEventListener('click',()=>{
            names[i].style.display='none';
            nameInput[i].style.display='inline-block'
            nameInput[i].value=names[i].textContent
        })
    }

    // end relationship
    window.addEventListener('load',()=>{
        confirmDiv.style.top=`-${confirmDiv.offsetHeight}px`
    })
    endBtn.addEventListener('click',()=>{
        confirmDiv.style.top=0;
    })
    confirmBtn.addEventListener('click',()=>{
        localStorage.clear();
        clearInterval(timeCount)
        secondPage.style.display='none';
        firstPage.style.display='flex';
        
    })
    cancelBtn.addEventListener('click',()=>{
        confirmDiv.style.top=`-${confirmDiv.offsetHeight}px`;
    })

    // hide the name input
    window.addEventListener('click',(e)=>{
        for(let i=0;i<nameInput.length;i++){
            if(e.target==nameInput[i] || e.target==names[i]){
                return
            }
            nameInput[i].style.display='none';
            names[i].style.display='inline-block';
        }

        if(e.target==endBtn || e.target==heartIcon){
            return
        }else{
            confirmDiv.style.top=`-${confirmDiv.offsetHeight}px`
        }
    })

    window.addEventListener('resize',()=>{
        imgInput.forEach((input)=>{
            input.parentElement.style.height=input.parentElement.offsetWidth + 'px'
        })
        confirmDiv.style.top=`-${document.body.offsetHeight}px`
    })
})();