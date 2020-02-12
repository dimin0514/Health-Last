package com.health.web.post;

import java.io.File;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.health.web.enums.Path;
import com.health.web.pxy.PageProxy;
import com.health.web.pxy.ProxyMap;
import com.health.web.pxy.Trunk;

@RestController
@RequestMapping("/post")
public class PostCtrl {
	@Autowired PostMapper postMapper;
	@Autowired ReplyMapper replyMapper;
	@Autowired LikesMapper likesMapper;
	@Autowired ProfileMapper profileMapper;
	@Autowired Trunk<Object> trunk;
	@Autowired PageProxy pager;
	@Autowired List<Post> list;
	@Autowired ProxyMap map;
	
	@PutMapping("/")
	public Map<?,?> writeBrd(@RequestBody Post param){
		Consumer<Post> c = t -> postMapper.insertPost(t);
		c.accept(param);
		
		Supplier<Integer> s =()->  postMapper.countBrdSeq();
		trunk.put(Arrays.asList("msg","count"),Arrays.asList("SUCCESS",s.get()));
		return trunk.get();
	}
	
	@GetMapping("/list")
	public List<Post> list(){
		Supplier<List<Post>> s= ()-> postMapper.selectAll();
		return s.get(); 
	}
	
	@GetMapping("/infintelist/{pageSize}/{currPage}")
	public Map<?,?> infinteList(@PathVariable("pageSize") String pageSize, @PathVariable("currPage") String currPage){
		list.clear();
		pager.setPageSize(Integer.parseInt(pageSize));
		pager.setCurrPage(Integer.parseInt(currPage));
		pager.setBlockSize(5);
		Supplier<Integer> s2 =()->  postMapper.countBrdSeq();
		pager.setRowCount(s2.get());
		pager.paging();
		Supplier<List<Post>> s1= ()-> postMapper.infiniteScroll(pager);
		map.accept(Arrays.asList("post","pxy"), Arrays.asList(s1.get(), pager));
		
		return map.get();
	}
	
	@GetMapping("/list/{userno}")
	public List<Post> userList(@PathVariable int userno){
		Supplier<List<Post>> s= ()-> postMapper.userSelectAll(userno);
		return s.get(); 
	}
	
	@GetMapping("/countNum/{postno}")
	public Map<?,?> countAll(@PathVariable int postno) {
		Supplier<Integer> s1 =()->  replyMapper.countReply(postno);
		Supplier<Integer> s2 = () -> likesMapper.likecount(postno);
		trunk.clear();
		trunk.put(Arrays.asList("replyCount","likeCount"), Arrays.asList(s1.get(),s2.get()));
		return trunk.get();
	}
	
	@GetMapping("/read/{postno}")
	public Post readBrd(@PathVariable int postno) {
		Supplier<Post> c = ()-> postMapper.selectPost(postno);
		return c.get();
	}
	
	@PutMapping("/update/{postno}")
	public Post updateBrd(@PathVariable int postno, @RequestBody Post param) {
		Consumer<Post> c = t -> postMapper.updatePost(param);
		c.accept(param);
		Supplier<Post> d = ()-> postMapper.selectPost(postno);
		return d.get();
		
	}
	
	@DeleteMapping("/delete/{postno}")
	public Map<?,?> deleteBrd(@PathVariable int postno){
		Consumer<Integer> c = t-> postMapper.deletePost(postno);
		c.accept(postno);
		trunk.clear();
		trunk.put(Arrays.asList("msg"), Arrays.asList("success"));
		return trunk.get();
	}
	
	@PostMapping("/fileupload")
	public void fileUpload(MultipartFile[] uploadFile,
			@RequestParam String content, @RequestParam String tagname, @RequestParam int userno, @RequestParam String userid) {
		Post post = new Post();
		String tempContent=null;
		String tempTagname=null;
		try {
			tempContent=URLDecoder.decode(content,"UTF-8");
			tempTagname=URLDecoder.decode(tagname,"UTF-8");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		System.out.println("변환된 컨텐츠값"+tempContent+"변환된 태그네임"+tempTagname);
		UUID uuid = UUID.randomUUID();
		String uploadFolder = Path.UPLOAD_PATH.toString();
		for(MultipartFile multipartFile : uploadFile) {
			String uploadFileName = uuid+ "_"+multipartFile.getOriginalFilename();
			
			uploadFileName = uploadFileName.substring(uploadFileName.lastIndexOf("\\")+1);
			post.setImg(uploadFileName);
			File saveFile = new File(uploadFolder,uploadFileName);
			try {
				multipartFile.transferTo(saveFile);  //이거 글자치면 try catch가 자동으로 뜸
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		post.setUserno(userno);
		post.setUserid(userid);
		post.setContent(tempContent);
		post.setTagname(tempTagname);
		Consumer<Post> c = t -> postMapper.insertPost(t);
		c.accept(post);
	}
}