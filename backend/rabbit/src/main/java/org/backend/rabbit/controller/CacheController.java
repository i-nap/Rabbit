//package org.backend.rabbit.controller;
//
//import org.backend.rabbit.services.CacheService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class CacheController {
//
//    @Autowired
//    private CacheService cacheService;
//
//    // Endpoint to clear all caches
//    @DeleteMapping("/clear-cache")
//    public String clearAllCaches() {
//        cacheService.clearAllCaches();
//        return "All caches cleared!";
//    }
//
//}
