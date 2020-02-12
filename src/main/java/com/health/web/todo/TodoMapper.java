package com.health.web.todo;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface TodoMapper {
	public void insertTodo(Todo param);
	public List<Todo> findYooAndMoo(Todo param);
	public List<HashMap<String, String>> findKcal();
}
