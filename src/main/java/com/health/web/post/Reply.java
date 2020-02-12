package com.health.web.post;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
@Lazy
public class Reply {
	private int commentno;
	private int postno;
	private String userid;
	private String regdate;
	private String content;
}
