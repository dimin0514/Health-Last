package com.health.web.todo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.health.web.pxy.Proxy;
import com.health.web.util.Printer;

@Service
public class TodoService extends Proxy{
	@Autowired TodoMapper todoMapper;
	@Autowired Printer printer;
	
	public void diet(Todo param) {
		Consumer<Todo> consumer = t -> todoMapper.insertTodo(t);
		consumer.accept(param);
	}
	public String findExercise() {
		Function<Todo, List<Todo>> function = t -> todoMapper.findYooAndMoo(t);
		
		return null;
	}
	public String calKcal(Todo param) {
		String totalW = "", Mbasic = "2500" , Fbasic = "2000";
		totalW = string(integer(param.getExistw()) - integer(param.getGoalw()));
		printer.accept("뺴야될 몸무게" + totalW);
		
		Supplier<List<HashMap<String, String>>> supplier = ()-> todoMapper.findKcal();
		for(Map<String ,String> map : supplier.get()) {
//			map.get("KCAL")
		}
		return null;
	}
}
