package com.health.web.post;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Component
@AllArgsConstructor
@NoArgsConstructor
@Lazy
public class Post {
	private int postno;			
	private int userno;
	private String content,tagname, userid;
	private String regdate;	
	private String img;
}
