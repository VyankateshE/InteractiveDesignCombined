package com.example.InteractiveDesignBackend;


import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Enables @Async so BulkPdfJobService.processAsync() runs off the HTTP thread.
 */
@Configuration
@EnableAsync
public class AsyncConfig {
    // Spring's default SimpleAsyncTaskExecutor is used for @Async here;
    // BulkPdfJobService manages its own fixed thread pool internally,
    // so the @Async annotation is just used to kick off the job without
    // blocking the request thread.
}