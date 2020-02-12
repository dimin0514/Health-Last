package com.health.web.todo;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
@Lazy
public class Todo {
	private String tname, tkcal,timg,goalw,goald,existw,attendence;
}
