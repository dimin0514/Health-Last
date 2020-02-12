package com.health.web.post;


import org.springframework.stereotype.Repository;

@Repository
public interface LikesMapper {
		public void create(Likes param);

		public int read(Likes param);
		
		public void delete(Likes param);
		
		public int likecount(int param);
	

}
