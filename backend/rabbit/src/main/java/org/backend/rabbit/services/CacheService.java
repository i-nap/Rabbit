//package org.backend.rabbit.services;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.CacheManager;
//import org.springframework.stereotype.Service;
//
//@Service
//public class CacheService {
//
//    @Autowired
//    private CacheManager cacheManager;
//
//    // Method to clear all caches
//    public void clearAllCaches() {
//        cacheManager.getCacheNames().forEach(cacheName -> {
//            cacheManager.getCache(cacheName).clear();
//        });
//    }
//
//    // Method to clear a specific cache by name
//    public void clearCacheByName(String cacheName) {
//        cacheManager.getCache(cacheName).clear();
//    }
//}
