package com.health.web.todo;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.health.web.pxy.Trunk;
import com.health.web.util.Printer;

@RestController
@RequestMapping("/todo")
public class TodoCtrl {
	@Autowired TodoService todoService;
	@Autowired Trunk<Object> trunk; @Autowired Printer printer;
	
	@PostMapping("/")
	public void insertDiet(@RequestBody Todo param){
		printer.accept("todo컨트롤러 진입");
		printer.accept("넘어온 값" +param);
		todoService.diet(param);
		todoService.calKcal(param);
	}
}
