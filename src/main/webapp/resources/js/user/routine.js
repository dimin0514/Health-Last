var routine = routine || {}
routine = (()=>{
	let context,img,css,js
	let routine_vue_js //루틴화면
	let navi_vue_js, auth_js
	let existing_routine_js 
	let mypage_js

	let init =()=>{
		context = $.ctx()
		img = $.img()
		css = $.css()
		js = $.js()
		routine_vue_js = js + '/vue/routine/routine_vue.js'
		auth_js = js + '/user/auth.js'
		existing_routine_js = js + '/user/existing_routine.js'
		navi_vue_js = js + '/vue/menu/navi_vue.js'
		mypage_js = js + '/user/mypage.js'
	}
	let onCreate =()=>{
		init()
		$.when(
			$.getScript(routine_vue_js),
			$.getScript(auth_js),
			$.getScript(existing_routine_js),
			$.getScript(navi_vue_js),
			$.getScript(mypage_js)
		)
		.done(()=>{
			setContentView() 
			createRoutine()
			create_diet()
			existRoutine()
			gohome() 
		})
		.fail(()=>{alert(`실패`)})
	}
	let setContentView =()=>{
//		$('head').append(routine_vue.routine_style({img :img}))
		$('.masthead2').remove()
		$('.page-footer').remove()
		$('#mainpage').html(routine_vue.routine_page1({css : css , img : img}))

	}
	let chooseCareer =()=>{
		let arr, description
		$('#setModal select[name="division"]').empty()
		if($('#setModal input[name="career"]:checked').val()==1) {
			arr = [
				{text: '근력증가', value: 1, detail: '헬린이들을 위한 근육 형성의 기초부터 시작하는 루틴을 소개해드립니다.'},
				{text: '다이어트&체지방감소', value: 6, detail: '근력운동은 무섭고 살만 빼고 싶다하시는 분들을 위한 daily 유산소'},
				{text: '근력&체지방 토탈루틴', value: 7, detail: '근육라인과 슬림한 바디라인 모두 놓치기 싫어하시는 분들을 위한 total 루틴'}]
			$('#setModal input[name="muscle"]').hide()
			$('#setModal input[name="fat"]').hide()
		}else{
			arr = [
				{text: '무분할', value: 1, detail: '무분할은 운동 가능시간이 짧고, 한 부위에 운동강도를 강하게 줄 수 없는 초보자, 여성들에게 적합합니다.'},
				{text: '2분할', value: 2, detail: '2분할은 운동 후 회복시간이 빠른 분들에게 적합하며 몸에 자극을 자주 줄 수 있어 근형성에 도움이 됩니다.'},
				{text: '3분할', value: 3, detail: '3분할은 운동 한 부위를 48시간 최대 휴식을 줄 수 있어 자극을 자주 줄 수 있고 근휴식도 챙길 수 있는 정석적인 분할법입니다.'},
				{text: '5분할', value: 5, detail: '5분할은 하루에 한 부위만을 자극하는 분할법으로, 해당 부위를 하루에 전부 털어낼 수 있는 숙련자에게 추천하는 분할법입니다.'}]	
			$('#setModal input[name="muscle"]').show()
			$('#setModal input[name="fat"]').show()
		}
		$.each(arr, (i, j) => {
			$(`<option value="" selected disabled hidden id=${i}>운동 루틴을 선택해주세요.</option><option value=${j.value}>${j.text} : <span><br />${j.detail}</span></option>`)
			.appendTo('#setModal select[name="division"]')
		})
		
	}
	let createRoutine =()=>{
		$('#newRoutine').click(function(){
			$('#fullHeightModalRight').modal('show')
			$('#setModal input[name="career"]').click(() => {
				chooseCareer()
			})
			$('#save_routine').click(e=>{
				e.preventDefault()
				$.ajax({
					url:context +'/users/make',
					type: 'PUT',
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify({
						userid : $.userid(),
						uname : $.uname(),
						height : $('#setModal input[name="height"]').val(),
						weight : $('#setModal input[name="weight"]').val(),
						muscle : $('#setModal input[name="muscle"]').val(),
						fat : $('#setModal input[name="fat"]').val(),
						career : $('#setModal input[name="career"]').val(),
						division : $('#setModal select[name="division"]').val(),
				}),
				success : d => {
					alert('ajax성공')
					alert(d.career)
					alert(d.division)
					sessionStorage.setItem('height', d.height)
					sessionStorage.setItem('weight', d.weight)
					sessionStorage.setItem('muscle', d.muscle)
					sessionStorage.setItem('fat', d.fat)
					localStorage.setItem('career', d.career)
					localStorage.setItem('division', d.division)
					onCreate()
				},
				error : function(request,status,error){
					alert("error code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				}
				})
			})
		})
	}
	let create_diet =()=>{
		$('#a_diet').click(e=>{
			e.preventDefault()
			$('#fullHeightModalLeft').modal('show')
			$('#save_diet').click(e=>{
				e.preventDefault()
				$.ajax({
					url : context + '/todo/',
					type : 'POST',
					dataType : 'json',
					data : JSON.stringify({
						userid : sessionStorage.getItem('userid'),
						existw : $('#setDiet input[name="existw"]').val(),
						goalw : $('#setDiet input[name="goalw"]').val(),
						goald : $('#setDiet input[name="period"]').val()
					}),
					contentType : 'application/json',
					success : ()=>{
						alert(`ajax성공`)
						mypage.onCreate()
					},
					error : e=>{
						alert(`ajax실패`)
					}
				})
			})
			
		})
	}
	let existRoutine =()=>{
		$('#existRoutine').click(()=>{
			if(localStorage.getItem('division')==0){
				alert(`division :: ${localStorage.getItem('division')}`)
				alert('새루틴 만들기를 먼저 완료하세요')
			}else{
				existing_routine.onCreate()
			}
		})
	}
	let gohome =()=>{
		$('#home').click(e=>{
			e.preventDefault()
			auth.login_home()
		})
	}
	return { onCreate }
})()