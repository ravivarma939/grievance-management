package com.example.bookmark_service.service;

import com.example.bookmark_service.entity.Bookmark;
import com.example.bookmark_service.repository.BookmarkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository repository;

    public BookmarkService(BookmarkRepository repository) {
        this.repository = repository;
    }

    public Bookmark saveBookmark(Bookmark bookmark) {
        return repository.save(bookmark);
    }

    public List<Bookmark> getBookmarksByUser(String username) {
        return repository.findByUsername(username);
    }

    public void deleteBookmark(Long id) {
        repository.deleteById(id);
    }
}