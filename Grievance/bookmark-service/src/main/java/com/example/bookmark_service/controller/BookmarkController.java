package com.example.bookmark_service.controller;

import com.example.bookmark_service.entity.Bookmark;
import com.example.bookmark_service.service.BookmarkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookmarks")
public class BookmarkController {

    private final BookmarkService service;

    public BookmarkController(BookmarkService service) {
        this.service = service;
    }

    // Add a bookmark
    @PostMapping
    public Bookmark addBookmark(@RequestBody Bookmark bookmark) {
        return service.saveBookmark(bookmark);
    }

    // Get bookmarks for a user
    @GetMapping("/{username}")
    public List<Bookmark> getBookmarks(@PathVariable String username) {
        return service.getBookmarksByUser(username);
    }

    // Delete a bookmark
    @DeleteMapping("/{id}")
    public void deleteBookmark(@PathVariable Long id) {
        service.deleteBookmark(id);
    }
}