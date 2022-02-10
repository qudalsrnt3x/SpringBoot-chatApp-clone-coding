package com.cos.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String> {

    @Tailable // 커서를 안 닫고 계속 유지한다.
    @Query("{sender: ?0, receiver: ?1}")
    Flux<Chat> mFindBySender(String sender, String receiver);
    // Flux (흐름) 데이터를 계속 흘려서 받겠다. 끊기 전까지 계속 데이터가 흘러간다.
    // response를 유지허면서 데이터를 계속 흘려보내기
}