package com.example.bookmark_service.controller;

import com.example.bookmark_service.DTO.BookmarkRequest;
import com.example.bookmark_service.entity.Bookmark;
import com.example.bookmark_service.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookmarks")
public class BookmarkController {

    private final BookmarkService service;

    public BookmarkController(BookmarkService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> addBookmark(@RequestBody BookmarkRequest req) {

        if (req.getUsername() == null || req.getUsername().isBlank()
            || req.getGrievanceId() == null || req.getGrievanceId().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "username and grievanceId are required"));
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setUsername(req.getUsername());
        bookmark.setGrievanceId(req.getGrievanceId());
        bookmark.setCompany(req.getCompany());
        bookmark.setProduct(req.getProduct());
        bookmark.setState(req.getState());

        return ResponseEntity.ok(service.saveBookmark(bookmark));
    }

    @GetMapping("/user/{username}")
    public List<Bookmark> getBookmarks(@PathVariable String username) {
        return service.getBookmarksByUser(username);
    }

    @DeleteMapping("/{id}")
    public void deleteBookmark(@PathVariable Long id) {
        service.deleteBookmark(id);
    }
}
