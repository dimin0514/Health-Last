var existing_routine = existing_routine || {}
existing_routine = (()=>{
	let context,img,css,js
	let routine_vue_js
	let routine_js , auth_js
	let init =()=>{
		context = $.ctx()
		img = $.img()
		css = $.css()
		js = $.js()
		routine_vue_js = js + '/vue/routine/routine_vue.js'
		routine_js = js + '/user/routine.js'
		auth_js = js + '/user/auth.js'
	}
	let onCreate =()=>{
		init()
		$.when(
			$.getScript(routine_vue_js),
			$.getScript(routine_js),
			$.getScript(auth_js)
		)
		.done(()=>{
			setContentView()
		})
		.fail(()=>{alert('Something goes wrong')})
	}
	let setContentView =()=>{
		$('head').append(routine_vue.exist_style({css : $.css()}))
		$('.masthead').remove()
		$('.page-footer').remove()
		$('#mainpage').empty()
		$('<div id="contents" class="container" style="margin-top : 80px;"></div>').appendTo('#mainpage')
		setPartition()
	}
	let setPartition=()=>{
		let today = new Date()
		const week = new Array(0, 1, 2, 3, 4, 5, 6)
		let day = week[today.getDay()]
		alert('로칼스토리지 분할 ::: ' + localStorage.getItem('division'))
		let parta = ''
		let partb = ''
		let partc = ''
		let partd = ''
		let parte = ''
		let data = {
						parta : parta,
						partb : partb,
						partc : partc,
						partd : partd,
						parte : parte
					}
		switch(parseInt(localStorage.getItem('division'))) {	
			case 1 : data.parta = '어깨운동', data.partb = '가슴운동', data.partc = '등운동', data.partd = '팔운동', data.parte = '하체&코어운동'
					showRoutine(data)
					break
			case 2 : if(day == 0 || day == 3) {
						alert('오늘은 근성장을 위해서 휴식을 갖는 날입니다!!!')
						setContentView()
					}else if (day == 2 || day == 5) {
						data.parta = '하체&코어운동'
						showRoutine(data)
					}else {
						data.parta = '어깨운동', data.partb = '가슴운동', data.partc = '등운동', data.partd = '팔운동'
						showRoutine(data)
					}
					break
			case 3 : alert("3분할 도착!!!")
					if(day==0) {
						alert('오늘은 근성장을 위해서 휴식을 갖는 날입니다!!!')
						setContentView()
					}else if (day == 1 || day == 4) {
						data.parta = '가슴운동', data.partb = '팔운동'
						showRoutine(data)
					}else if (day == 2 || day == 5) {
						data.parta = '등운동', data.partb = '팔운동'
						showRoutine(data)
					}else {
						data.parta = '하체&코어운동'
						showRoutine(data)
					}
					break
			case 5 : if (day == 1) {
						data.parta = '가슴운동'
						showRoutine(data)
					}else if (day == 2) {
						data.parta = '등운동'
						showRoutine(data)
					}else if (day == 3) {
						data.parta = '팔운동'
						showRoutine(data)
					}else if (day == 4) {
						data.parta = '어깨운동'
						showRoutine(data)
					}else if (day == 5) {
						data.parta = '하체&코어운동'
						showRoutine(data)
					}else {
						alert('오늘은 근성장을 위해서 휴식을 갖는 날입니다!!!')
						setContentView()
					}
					break
			case 6 : 
					data.parta = '유산소'
					showRoutine(data)
					break;
			case 7 :
					data.parta = '어깨운동', data.partb = '가슴운동', data.partc = '등운동', data.partd = '팔운동', data.parte = '하체&코어운동'
					showRoutine(data)
					break;
		}
	}
	let showRoutine =x=>{
		$.ajax({
			url: context+'/routine/'+sessionStorage.getItem('userid'),
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				userid : sessionStorage.getItem('userid'),
				muscle : sessionStorage.getItem('muscle'),
				fat : sessionStorage.getItem('fat'),
				career : localStorage.getItem('career'),
				division : localStorage.getItem('division'),
				parta : x.parta,
				partb : x.partb,
				partc : x.partc,
				partd : x.partd,
				parte : x.parte
			}),
			success : d => {
				let career = localStorage.getItem('career')
				let macho = 1
				let result = sessionStorage.getItem('gender')==='female'? gender = 0.7 : gender = 1
				if(sessionStorage.getItem('muscle')>=50.0) {
					macho = 1.7
				}else if(sessionStorage.getItem('muscle')>=40.0) {
					macho = 1.5
				}
				$('#contents').html(routine_vue.existRoutine())
				$('#backbtn').click(()=>{
					routine.onCreate()
				})
				if(localStorage.getItem('division') == 6) {
					$.each(d, (i,j)=>{
						$(`<div class="timeline">
							<span class="icon fa fa-globe"></span>
							<a href="#" class="timeline-content">
							<h3 id=id_${i} class="title">오늘의 다이어트 시작</h3>
							</a></div>`).appendTo('#exercise_list')
							$(`<h3>${j.part}<br />운동명 : ${j.ename}<p style="font-size: 25px; color : black;">최소목표운동시간 : ${j.rweight}</p><iframe src="${j.link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></h3>`).appendTo("#id_"+i)
					})
				}else if(localStorage.getItem('division') == 7){
					$.each(d, (i,j)=>{
						let recommend = Math.floor(j.rweight*career*result*macho)
						$(`<div class="timeline">
							<span class="icon fa fa-globe"></span>
							<a href="#" class="timeline-content">
							<h3 id=id_${i} class="title">오늘의 ${i+1}번째 토탈루틴</h3>
							</a></div>`).appendTo('#exercise_list')
							if(j.rweight==0){
								$(`<h3>${j.part}<br />운동명 : ${j.ename}<p style="font-size: 25px; color : black;">추천중량 : 본인 체중(본인 필요시 중량 추가부하)</p><iframe src="${j.link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></h3>`).appendTo("#id_"+i)
							}else if(i == d.length-1) {
								$(`<h3>${j.part}<br />운동명 : ${j.ename}<p style="font-size: 25px; color : black;">최소목표운동시간 : ${j.rweight}분</p><iframe src="${j.link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></h3>`).appendTo("#id_"+i)
							}else{
								$(`<h3>${j.part}<br />운동명 : ${j.ename}<p style="font-size: 25px; color : black;">추천중량 : ${recommend + (5 - (recommend%5))}kg</p><iframe src="${j.link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></h3>`).appendTo("#id_"+i)
							}
					})
				}else {
					$.each(d, (i,j)=>{
						let recommend = Math.floor(j.rweight*career*result*macho)
						$(`<div class="timeline">
							<span class="icon fa fa-globe"></span>
							<a href="#" class="timeline-content">
							<h3 id=id_${i} class="title">오늘의 ${i+1}번째운동</h3>
							</a></div>`).appendTo('#exercise_list')
						if(j.rweight==0){
							$(`<h3>${j.part}<br />운동명 : ${j.ename}<p style="font-size: 25px; color : black;">추천중량 : 본인 체중(본인 필요시 중량 추가부하)</p><iframe src="${j.link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></h3>`).appendTo("#id_"+i)
						}else{
							$(`<h3>${j.part}<br />운동명 : ${j.ename}<p style="font-size: 25px; color : black;">추천중량 : ${recommend + (5 - (recommend%5))}kg</p><iframe src="${j.link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></h3>`).appendTo("#id_"+i)
						}
					})
				}
				$('#endbtn').click(e=>{
					e.preventDefault()
					alert('수고하셨습니다, 오늘도 득근득근!!!')
					auth.login_home()
				})
			},
			error : function(request,status,error){
		        alert("error code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		       }
		})
	}
	return { onCreate }
})()