package com.teamcook.tastyties.common.service;

import com.teamcook.tastyties.common.dto.post.PostDto;
import com.teamcook.tastyties.common.entity.Post;
import com.teamcook.tastyties.common.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public PostDto save(PostDto postDto) {
        Post post = new Post(postDto.getTitle(), postDto.getContent());
        Post savedPost = postRepository.save(post);
        return new PostDto(savedPost.getTitle(), savedPost.getContent());
    }

    public PostDto modify(long id, PostDto postDto) {
        Post postById = postRepository.findById(id).orElse(null);
        postById.update(postDto);

        return postDto;
    }

    public Page<PostDto> findPostsByPage(Pageable pageable) {
        Page<Post> posts = postRepository.findAll(pageable);
        return posts.map(post -> new PostDto(post.getTitle(), post.getContent()));
    }

    public PostDto findPostById(Long id) {
        Post post = postRepository.findById(id).orElse(null);
        return new PostDto(post.getTitle(), post.getContent());
    }

    public void deleteById(Long id) {
        postRepository.deleteById(id);
    }
}
